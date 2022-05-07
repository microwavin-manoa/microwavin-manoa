import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Table, Header, Loader, Image, Container } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    const tableStyle = { backgroundColor: '#ffffff' };
    const margins = { marginLeft: 25, marginRight: 25 };
    return (
      <div id="my-recipes-page" style={margins}>
        <br/>
        <Header as="h2" textAlign="center" id="page-header-style">My Recipes</Header>
        <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
        {(this.props.recipes.length > 0) ?
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell id="table-header-style">Name</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Image</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Prep-Time</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Serving Size</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Ingredients</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Tags</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Description</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style"> </Table.HeaderCell>
                <Table.HeaderCell id="table-header-style"> </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body style = {tableStyle}>
              {this.props.recipes.map((recipe) => <StuffRecipe key={recipe._id} recipe={recipe} />)}
            </Table.Body>
          </Table> : ''}
        {(this.props.recipes.length === 0) ?
          <Container textAlign='center'>
            <Header as='h4' style={{ marginTop: '20px' }}>You haven&apos;t made any recipes yet!</Header><br/>
            <Link to='/add' style={{ marginTop: '20px' }}>Make one now!</Link>
            <br/><br/>
            <Link to='/search' style={{ marginTop: '20px' }}>See all recipes</Link>
          </Container> : ''}
      </div>
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
  let recipes = Recipes.collection.find({ owner: Meteor.user().username }).fetch();
  recipes = recipes.sort((a, b) => a.name.localeCompare(b.name));
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();

  return {
    recipes,
    ready,
  };
})(MyRecipes);
