import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { Recipes } from '../../api/recipe/Recipes';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import AddIngredient from '../components/AddIngredient';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allIngredients) => new SimpleSchema({
  name: String,
  imageURL: String,
  prepTime: String,
  servingSize: String,
  ingredients: { type: Array, label: 'Ingredients' },
  'ingredients.$': { type: String, allowedValues: allIngredients },
  description: String,
});

/** Renders the Page for adding a document. */
class AddRecipe extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    Ingredients.collection.insert({ name, quantity, condition, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    let fRef = null;
    // const allIngredients = _.pluck(Stuffs.collection.find().fetch(), 'name');
    const allIngredients = _.pluck(Ingredients.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allIngredients);
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Add Recipe</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
            <Segment>
              <TextField name='name'/>
              <TextField name='imageURL'/>
              <TextField name='prepTime'/>
              <TextField name='servingSize'/>
              <MultiSelectField name='ingredients' placeholder='Select ingredients'/>
              <AddIngredient/><br/>
              <LongTextField name='description'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

AddRecipe.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */

export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
  const sub2 = Meteor.subscribe(Recipes.userPublicationName);
  const sub3 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub4 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(AddRecipe);
