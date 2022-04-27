import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Table, Image, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { Recipes } from '../../api/recipe/Recipes';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Tags } from '../../api/tag/Tags';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { Ingredients } from '../../api/ingredient/Ingredient';

// returns an array of tags for this recipe
function getTags(name) {
  const recipeID = Recipes.collection.findOne({ name })._id;
  const tagVal = _.pluck(TagRecipe.collection.find({ recipeID: recipeID }).fetch(), 'tagID');
  return _.flatten(tagVal.map(tagID => _.pluck(Tags.collection.find({ _id: tagID }).fetch(), 'name')));
}

const tagStyle = { backgroundColor: '#85865f', color: '#f5f0e6', marginBottom: '5px', fontSize: '12px' };
const ingStyle = { backgroundColor: '#4f583d', color: '#f5f0e6', marginBottom: '5px', fontSize: '12px' };

// returns an array of ingredients for this recipe
function getIngredients(name) {
  const recipeID = Recipes.collection.findOne({ name })._id;
  const ingredientVal = _.pluck(IngredientRecipe.collection.find({ recipeID: recipeID }).fetch(), 'ingredientID');
  return _.flatten(ingredientVal.map(ingID => _.pluck(Ingredients.collection.find({ _id: ingID }).fetch(), 'name')));
}

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class StuffRecipeAdmin extends React.Component {
  render() {
    const tagData = getTags(this.props.recipe.name);
    const ingredientData = getIngredients(this.props.recipe.name);
    return (
      <Table.Row>
        <Table.Cell>{this.props.recipe.name}</Table.Cell>
        <Table.Cell><Image size = 'small' src={this.props.recipe.imageURL}/></Table.Cell>
        <Table.Cell>{this.props.recipe.prepTime}</Table.Cell>
        <Table.Cell>{this.props.recipe.servingSize}</Table.Cell>
        <Table.Cell>
          {_.map(ingredientData, (ing, index) => <Label style={ingStyle}key={index}>{ing}</Label>)}
        </Table.Cell>
        <Table.Cell>
          {_.map(tagData, (tag, index) => <Label style={tagStyle} tag key={index}>{tag}</Label>)}
        </Table.Cell>
        <Table.Cell>{this.props.recipe.description}</Table.Cell>
        <Table.Cell>{this.props.recipe.owner}</Table.Cell>
        <Table.Cell>
          <Link id={'edit-recipe-button-admin'} to={`/editrecipe/${this.props.recipe._id}`}>Edit</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffRecipeAdmin.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const sub1 = Meteor.subscribe(Recipes.userPublicationName);
  const sub2 = Meteor.subscribe(Tags.userPublicationName);
  const sub3 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub4 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub5 = Meteor.subscribe(Ingredients.userPublicationName);
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();
  return {
    ready,
  };
})(StuffRecipeAdmin);
