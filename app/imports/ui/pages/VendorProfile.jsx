import React from 'react';
import { Image, Grid, Container, Loader, Header, Table } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Vendors } from '../../api/vendor/Vendors';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import StuffIngredientVendorPrice from '../components/StuffIngredientVendorPrice';
import { Ingredients } from '../../api/ingredient/Ingredient';

function getVendorData(vendorName) {
  const ingredient = _.pluck(IngredientVendorPrice.collection.find({ vendor: vendorName }).fetch(), 'ingredient');
  console.log(ingredient);
  const ingredientID = ingredient.map(ing => Ingredients.collection.findOne({ name: ing })._id);
  console.log(ingredientID);
  const price = _.pluck(IngredientVendorPrice.collection.find({ vendor: vendorName }).fetch(), 'price');
  console.log(price);
  return _.extend({ ingredient, ingredientID, price });
}

function makeObject(item) {
  return {
    ingredient: item[0],
    ingredientId: item[1],
    price: item[2],
  };
}

/** A simple static component to render some text for the Recipe page. */
class VendorProfile extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const vendorName = this.props.doc.name;
    let vendorData = getVendorData(vendorName);
    vendorData = _.zip(vendorData.ingredient, vendorData.ingredientID, vendorData.price);
    vendorData = vendorData.map(item => makeObject(item));
    console.log(vendorData);
    return (
      <Container>
        <Grid textAlign='center'>
          <Grid.Row>
            <h1>{this.props.doc.name}</h1>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={7}>
              <Image size='large' rounded src={this.props.doc.imageURL}/>
              <Grid.Row>
                <Grid.Column>
                  <h3>Address</h3>
                  <p>{this.props.doc.address}</p>
                </Grid.Column>
                <Grid.Column>
                  <h3>Hours</h3>
                  <p>{this.props.doc.hours}</p>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as="h3" textAlign="center">Stock</Header>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Ingredient</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Edit</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.map(vendorData, (ingredient, index) => <StuffIngredientVendorPrice key={index} ivp={ingredient}/>)}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Container>
    );
  }
}

VendorProfile.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  const documentId = match.params._id;
  // Get access to collections
  const sub = Meteor.subscribe(Vendors.userPublicationName);
  const sub2 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub3 = Meteor.subscribe(Ingredients.userPublicationName);
  // Determine if the subscription is ready
  const ready = sub.ready() && sub2.ready() && sub3.ready();
  // Get the document
  const doc = Vendors.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(VendorProfile);
