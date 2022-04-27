import React from 'react';
import { Card, Image, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Tags } from '../../api/tag/Tags';
import { Recipes } from '../../api/recipe/Recipes';

// returns an array of tags for this recipe
function getTags(name) {
  const recipeID = Recipes.collection.findOne({ name })._id;
  const tagVal = _.pluck(TagRecipe.collection.find({ recipeID: recipeID }).fetch(), 'tagID');
  return _.flatten(tagVal.map(tagID => _.pluck(Tags.collection.find({ _id: tagID }).fetch(), 'name')));
}

const tagStyle = { backgroundColor: '#85865f', color: '#f5f0e6', marginBottom: '5px', fontSize: '12px' };
const cardImageStyle = { alignSelf: 'center', height: 300, width: 300, borderWidth: 1, borderRadius: 75 };

class RecipeCard extends React.Component {
  render() {
    const tagData = getTags(this.props.recipe.name);
    return (
      <Card href={`#/recipe/${this.props.recipe._id}`}>
        <Image style={cardImageStyle} src={this.props.recipe.imageURL} wrapped/>
        <Card.Content>
          <Card.Header id="card-title">{this.props.recipe.name}</Card.Header>
          <Card.Meta>
            Serving size: {this.props.recipe.servingSize}
          </Card.Meta>
          <Card.Meta>
            Prep time: {this.props.recipe.prepTime}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          {_.map(tagData, (tag, index) => <Label tag key={index} style={tagStyle}>{tag}</Label>)}
        </Card.Content>
      </Card>
    );
  }
}

// Require a recipe to be passed to this component.
RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default RecipeCard;
