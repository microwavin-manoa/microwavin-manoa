import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Recipes } from '../../api/recipe/Recipes';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Ingredients } from '../../api/ingredient/Ingredient';
import AddIngredient from '../components/AddIngredient';
import { Tags } from '../../api/tag/Tags';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { updateRecipeMethod } from '../../startup/both/Methods';
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

// returns an array of ingredients for this recipe
function getIngredients(name) {
  const recipeID = Recipes.collection.findOne({ name })._id;
  const ingredientVal = _.pluck(IngredientRecipe.collection.find({ recipeID: recipeID }).fetch(), 'ingredientID');
  return _.flatten(ingredientVal.map(ingID => _.pluck(Ingredients.collection.find({ _id: ingID }).fetch(), 'name')));
}

// returns an array of tags for this recipe
function getTags(name) {
  const recipeID = Recipes.collection.findOne({ name })._id;
  const tagVal = _.pluck(TagRecipe.collection.find({ recipeID: recipeID }).fetch(), 'tagID');
  return _.flatten(tagVal.map(tagID => _.pluck(Tags.collection.find({ _id: tagID }).fetch(), 'name')));
}

/** Renders the Page for editing a single document. */
class EditRecipe extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    const newData = data;
    newData.owner = this.props.doc.owner;
    newData.oldName = this.props.doc.name;
    Meteor.call(updateRecipeMethod, newData, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe updated successfully', 'success');
      }
    });
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    // get all ingredients and tags to choose from
    const allIngredients = _.pluck(Ingredients.collection.find().fetch(), 'name');
    const allTags = _.pluck(Tags.collection.find().fetch(), 'name');
    // create the form schema
    const formSchema = makeSchema(allIngredients, allTags);
    const bridge = new SimpleSchema2Bridge(formSchema);
    // to fill the form with the correct info
    const model = _.extend({}, this.props.doc);
    model.ingredients = getIngredients(this.props.doc.name);
    model.tags = getTags(this.props.doc.name);
    return (
      <Grid id={'edit-recipe-page'} container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Recipe</Header>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={model}>
            <Segment>
              <TextField name='name'/>
              <TextField name='imageURL'/>
              <TextField name='prepTime' placeholder='5 minutes'/>
              <TextField name='servingSize'/>
              <MultiSelectField name='ingredients' placeholder='Select ingredients'/>
              <AddIngredient/><br/>
              <MultiSelectField name='tags' placeholder='Select tags'/>
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

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditRecipe.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
  ingredients: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
  const sub2 = Meteor.subscribe(Recipes.userPublicationName);
  const sub3 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub4 = Meteor.subscribe(Tags.userPublicationName);
  const sub5 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub6 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub7 = Meteor.subscribe(Vendors.userPublicationName);
  // Get the document
  const doc = Recipes.collection.findOne(documentId);
  return {
    ingredients: Ingredients.collection.find().fetch(),
    doc,
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready(),
  };
})(EditRecipe);
