import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Recipes } from '../../api/recipe/Recipes';
import StuffRecipe from '../components/StuffRecipe';
import { Tags } from '../../api/tag/Tags';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { Ingredients } from '../../api/ingredient/Ingredient';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class MyRecipes extends React.Component {

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the page once subscriptions have been received.
  renderPage() {
    return (
      <Container>
        <br/>
        <Header as="h2" textAlign="center">My Recipes</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Prep-Time</Table.HeaderCell>
              <Table.HeaderCell>Serving Size</Table.HeaderCell>
              <Table.HeaderCell>Ingredients</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.recipes.map((recipe) => <StuffRecipe key={recipe._id} recipe={recipe} />)}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
MyRecipes.propTypes = {
  recipes: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const sub1 = Meteor.subscribe(Recipes.userPublicationName);
  const sub2 = Meteor.subscribe(Tags.userPublicationName);
  const sub3 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub4 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub5 = Meteor.subscribe(Ingredients.userPublicationName);
  let recipes = Recipes.collection.find().fetch();
  recipes = recipes.sort((a, b) => a.name.localeCompare(b.name));
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();

  return {
    recipes,
    ready,
  };
})(MyRecipes);
