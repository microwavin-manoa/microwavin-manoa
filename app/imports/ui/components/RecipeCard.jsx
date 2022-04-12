import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Recipe extends React.Component {
  render() {
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
          any tags will appear here
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
