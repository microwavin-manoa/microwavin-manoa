import React from 'react';
import { Header, Image, Grid, Table, Container, Loader, Label } from 'semantic-ui-react';
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
import { Vendors } from '../../api/vendor/Vendors';

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

function getTotalPrice(ingredientData) {
  const groups = _.groupBy(ingredientData, 'ingredient');
  // _.mapObject doesn't seem to be defined in meteor so I had to use _.each
  // const lowestPrices = _.mapObject(groups, ing => _.min(_.pluck(ing, 'price')));
  const lowestPrices = {};
  _.each(groups, function (ing, key) {
    lowestPrices[key] = _.min(_.pluck(ing, 'price'));
  });
  return _.reduce(lowestPrices, function (memo, num) { return memo + num; }, 0);
}

function formatPrice(price) {
  return `$${(Math.round(price * 100) / 100).toFixed(2)}`;
}

const tagStyle = { backgroundColor: '#85865f', color: '#f5f0e6', marginBottom: '5px', fontSize: '11px' };
const ingStyle = { backgroundColor: '#4f583d', color: '#f5f0e6', marginBottom: '5px', fontSize: '12px' };

/** A simple static component to render some text for the Recipe page. */
class Recipe extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const allIngredients = getIngredients(this.props.doc.name);
    const ingredientData = _.sortBy(_.filter(IngredientVendorPrice.collection.find().fetch(), ing => allIngredients.includes(ing.ingredient)), 'ingredient');
    const allTags = getTags(this.props.doc.name);
    const totalPrice = getTotalPrice(ingredientData);
    const tableHeadStyle = { backgroundColor: '#85865F' };
    return (
      <Container>
        <Grid verticalAlign='middle' textAlign='center' padded>
          <Grid.Row stretched>
            <br/>
            <Header as="h1" textAlign="center">{this.props.doc.name}</Header>
          </Grid.Row>
          <Grid.Row>
            <Image size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-20px' }}/>
          </Grid.Row>
          <Grid.Column width={5}>
            <Image size='large' rounded src={this.props.doc.imageURL}/><br/>
            <Grid.Row>{_.map(allTags, (tag, index) => <Label tag key={index} style={tagStyle}>{tag}</Label>)}</Grid.Row>
          </Grid.Column>
          <Grid.Column width={5}>
            <div>
              <Header as={'h3'}>Ingredients:</Header>
              <div>{_.map(allIngredients, (ing, index) => <Label style={ingStyle} key={index}>{ing}</Label>)}</div>
              <Header as={'h5'}>Lowest Calculated Cost: {formatPrice(totalPrice)}</Header>
              <Header as='h3' textAlign='center'>Instructions</Header>
              <p>{this.props.doc.description}</p>
            </div>
          </Grid.Column>
        </Grid>
        <br/><hr/><br/>
        <Grid padded>
          <Grid.Row centered>
            <div>
              <Header as='h3' textAlign='center'>Ingredients Lookup</Header>
              <Image size={'small'} src={'images/curl-divider.png'} style={{ marginTop: '-15px' }}/>
            </div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={tableHeadStyle}>Ingredient</Table.HeaderCell>
                  <Table.HeaderCell style={tableHeadStyle}>Vendor</Table.HeaderCell>
                  <Table.HeaderCell style={tableHeadStyle}>Price</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(ingredientData, (ing, index) => <RecipeVendorPriceTable key={index} name={ing.ingredient} vendor={ing.vendor} price={ing.price}/>)}
              </Table.Body>
            </Table>
          </Grid.Row>
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
  const sub5 = Meteor.subscribe(Tags.userPublicationName);
  const sub6 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub7 = Meteor.subscribe(Vendors.userPublicationName);
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
  // Get the document
  const doc = Recipes.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(Recipe);
