import React from 'react';
import { Grid, Header, Form, Segment, Image, Button, Container } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { HashLink as Link } from 'react-router-hash-link';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Ingredients } from '../../api/ingredient/Ingredient';
// import { Recipes } from '../../api/recipe/Recipes';
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
    // const color = { color: '#4f583d' };
    const textStyle = { color: '#4f583d', fontSize: '16px' };
    // const submitStyle = { backgroundColor: '#85865F', color: '#FFFFFF' };
    const submitStyle = { backgroundColor: '#4f583d', color: '#FFFFFF' };
    let fRef = null;
    // get all ingredients and tags to choose from
    let allIngredients = _.pluck(Ingredients.collection.find().fetch(), 'name');
    allIngredients = allIngredients.sort();
    const allTags = _.pluck(Tags.collection.find().fetch(), 'name');
    // create the form schema
    const formSchema = makeSchema(allIngredients, allTags);
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Container>
        <Grid container centered style={{ marginTop: '10px' }} id={'add-recipe-page'}>
          <Grid.Column centered>
            <Header as="h2" textAlign="center" id='page-header-style'>Add Recipe</Header>
            <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
            <Segment style={{ backgroundColor: '#85865F' }}>
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='name' id='addrecipe-form-name' style={textStyle}/>
                  <TextField name='imageURL' id='addrecipe-form-imageURL' style={textStyle}/>
                  <Form.Group widths={'equal'}>
                    <TextField name='prepTime' id='addrecipe-form-prep' placeholder='5 minutes' style={textStyle}/>
                    <TextField name='servingSize' id='addrecipe-form-serving' style={textStyle}/>
                  </Form.Group>
                  <MultiSelectField name='ingredients' id='addrecipe-form-ingredients' placeholder='Type or select ingredients' style={textStyle}/>
                  <AddIngredient/><br/>
                  <MultiSelectField name='tags' id='addrecipe-form-tags' placeholder='Type or select tags' style={textStyle}/>
                  <LongTextField name='description' id='addrecipe-form-description' style={textStyle}/>
                  <SubmitField value='Submit' id='addrecipe-form-submit' style={submitStyle}/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Segment>
          </Grid.Column>
        </Grid>
        <Button as={Link} to='/add#navbar' icon='arrow up' circular id='to-top-button' size='big'/>
      </Container>
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
  // I realized some of these might be meaningless but im too scared to touch it now
  const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
  const sub3 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub4 = Meteor.subscribe(Tags.userPublicationName);
  const sub5 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub6 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub7 = Meteor.subscribe(Vendors.userPublicationName);
  return {
    ready: sub1.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready(),
    ingredients: Ingredients.collection.find().fetch(),
  };
})(AddRecipe);
