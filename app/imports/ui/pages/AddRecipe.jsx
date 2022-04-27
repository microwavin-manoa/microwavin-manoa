import React from 'react';
import { Grid, Header, Form, Input, Segment, Image } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField } from 'uniforms-semantic';
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
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Tags } from '../../api/tag/Tags';
import AddIngredient from '../components/AddIngredient';
import { addRecipeMethod } from '../../startup/both/Methods';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { Vendors } from '../../api/vendor/Vendors';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allIngredients, allTags) => new SimpleSchema({
  name: String,
  imageURL: String,
  prepTime: String,
  servingSize: String,
  ingredients: { type: Array, label: 'Ingredients', optional: false },
  'ingredients.$': { type: String, allowedValues: allIngredients },
  tags: { type: Array, label: 'Tags', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
  description: String,
});

/** Renders the Page for adding a document. */
class AddRecipe extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    Meteor.call(addRecipeMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe added successfully', 'success').then(() => formRef.reset());
      }
    });
  }

  render() {
    const color = { color: '#4f583d' };
    const textStyle = { color: '#4f583d', fontSize: '16px' };
    let fRef = null;
    // get all ingredients and tags to choose from
    const allIngredients = _.pluck(Ingredients.collection.find().fetch(), 'name');
    const allTags = _.pluck(Tags.collection.find().fetch(), 'name');
    // create the form schema
    const formSchema = makeSchema(allIngredients, allTags);
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Grid container centered style={{ marginTop: '10px' }}>
        <Grid.Column centered>
          <Header as="h2" textAlign="center" style={ color }>Add Recipe</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
          <Segment>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
              <Form.Field inline required style={ textStyle } value={'name'}>
                <label>Name</label>
                <Input style={{ width: '1030px' }}/>
              </Form.Field>
              <Form.Field inline required style={ textStyle } value={'imageURL'}>
                <label>ImageURL</label>
                <Input style={{ width: '1000px' }}/>
              </Form.Field>
              <Form.Group widths={'equal'}>
                <Form.Field inline required style={ textStyle } value={'prepTime'}>
                  <label>Prep Time</label>
                  <Input placeholder='15 minutes' style={{ width: '540px' }}/>
                </Form.Field>
                <Form.Field inline required style={ textStyle } value={'servingSize'}>
                  <label>Serving Size</label>
                  <Input style={{ width: '540px' }}/>
                </Form.Field>
              </Form.Group>
              <MultiSelectField style={ textStyle } name='ingredients' placeholder='Select ingredients'/>
              <AddIngredient/><br/>
              <MultiSelectField style={ textStyle } name='tags' placeholder='Select tags'/>
              <LongTextField style={ textStyle } name='description'/>
              <SubmitField style={ textStyle } value='Submit'/>
              <ErrorsField/>
            </AutoForm>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

AddRecipe.propTypes = {
  ready: PropTypes.bool.isRequired,
  ingredients: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */

export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
  const sub2 = Meteor.subscribe(Recipes.userPublicationName);
  const sub3 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub4 = Meteor.subscribe(Tags.userPublicationName);
  const sub5 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub6 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub7 = Meteor.subscribe(Vendors.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready(),
    ingredients: Ingredients.collection.find().fetch(),
  };
})(AddRecipe);
