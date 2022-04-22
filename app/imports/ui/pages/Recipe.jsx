import React from 'react';
import { Header, Image, Grid, Table, Container, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Recipes } from '../../api/recipe/Recipes';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import RecipeVendorPriceTable from '../components/RecipeVendorPriceTable';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Tags } from '../../api/tag/Tags';

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

/** A simple static component to render some text for the Recipe page. */
class Recipe extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const allIngredients = getIngredients(this.props.doc.name);
    const ingredientData = _.filter(IngredientVendorPrice.collection.find().fetch(), ing => allIngredients.includes(ing.ingredient));
    return (
      <Container>
        <Grid verticalAlign='middle' textAlign='center'>
          <Grid.Column width={5}>
            <Image size='large' rounded src={this.props.doc.imageURL}/>
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h2" textAlign="center">{this.props.doc.name}</Header>
            <Header as='h3' textAlign='center'>Ingredients</Header>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ingredient</Table.HeaderCell>
                  <Table.HeaderCell>Vendor</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(ingredientData, (ing, index) => <RecipeVendorPriceTable key={index} name={ing.ingredient} vendor={ing.vendor} price={ing.price}/>)}
              </Table.Body>
            </Table>
            <Header as='h3' textAlign='center'>Instructions</Header>
            <p>{this.props.doc.description}</p>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
Recipe.propTypes = {
  doc: PropTypes.object,
  recipe: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const sub1 = Meteor.subscribe(Recipes.userPublicationName);
  const sub2 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub3 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub4 = Meteor.subscribe(Ingredients.userPublicationName);
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready();
  // Get the document
  const doc = Recipes.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(Recipe);
