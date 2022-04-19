import React from 'react';
import { Card, Image, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Tags } from '../../api/tag/Tags';
import { Recipes } from '../../api/recipe/Recipes';

/** get access to the tags by using recipeID and access corresponding tag ids from tag recipe collection
 then from those tag ids use the tags collection to get the name */
/**
 *   const ingredient = _.pluck(IngredientVendorPrice.collection.find({ vendor: vendorName }).fetch(), 'ingredient');
 *   const ingredientID = ingredient.map(ing => Ingredients.collection.findOne({ name: ing })._id);
 *   const price = _.pluck(IngredientVendorPrice.collection.find({ vendor: vendorName }).fetch(), 'price');
 */

function getTags(recipeName) {
  const recipeId = Recipes.collection.findOne({ name: recipeName })._id;
  console.log(recipeId);
  const tags = _.pluck(TagRecipe.collection.find({ recipeID: recipeId }.fetch()), 'tagID');
  console.log(tags);

}


class Recipe extends React.Component {
  render() {
    const tagData = getTags(this.props.recipe.name);
    return (
      <Card href={`#/recipe/${this.props.recipe._id}`}>
        <Image src={this.props.recipe.imageURL} wrapped ui={false}/>
        <Card.Content>
          <Card.Header>{this.props.recipe.name}</Card.Header>
          <Card.Meta>
            Serving size: {this.props.recipe.servingSize}
          </Card.Meta>
          <Card.Meta>
            Prep time: {this.props.recipe.prepTime}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
        </Card.Content>
      </Card>
    );
  }
}

// Require a recipe to be passed to this component.
Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Recipe);
