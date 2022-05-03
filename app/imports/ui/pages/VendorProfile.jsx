import React from 'react';
import { Image, Grid, Container, Loader, Header, Table, Icon } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Vendors } from '../../api/vendor/Vendors';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import StuffIngredientVendorPrice from '../components/StuffIngredientVendorPrice';
import { Ingredients } from '../../api/ingredient/Ingredient';
import AddIngredientVendor from '../components/AddIngredientVendor';

function getVendorData(vendorName) {
// get all ingredients for a vendor
  const ingredient = _.pluck(IngredientVendorPrice.collection.find({ vendor: vendorName }).fetch(), 'ingredient');
  // get the ingredients' respective IDs
  const ingredientID = ingredient.map(ing => Ingredients.collection.findOne({ name: ing })._id);
  // get the ingredients' respective prices
  const price = _.pluck(IngredientVendorPrice.collection.find({ vendor: vendorName }).fetch(), 'price');
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
    let vendorData = getVendorData(this.props.doc.name);
    vendorData = _.zip(vendorData.ingredient, vendorData.ingredientID, vendorData.price);
    vendorData = vendorData.map(item => makeObject(item));
    const tableHeadStyle = { backgroundColor: '#85865F' };
    return (
      <Container id={'vendor-profile-page'}>
        <Grid textAlign='center'>
          <Grid.Row stretched>
            <br/>
            <Header centered as='h1' id='page-header-style'>{this.props.doc.name}</Header>
          </Grid.Row>
          <Grid.Row>
            <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-30px' }}/>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={7}>
              <Image size='large' rounded src={this.props.doc.imageURL}/>
              <br/>
              <Grid.Row>
                <p style={{ textAlign: 'left' }}><Icon name={'map marker alternate'} size={'large'} style={{ color: '#4F583D' }}/>{this.props.doc.address}</p>
                <p style={{ textAlign: 'left' }}><Icon name={'clock outline'} size={'large'} style={{ color: '#4F583D' }}/>{this.props.doc.hours}</p>
                <br/>
                <AddIngredientVendor vendorName={this.props.doc.name}/>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={5}>
              <Header as="h3" textAlign="center">Stock</Header>
              <Image centered size={'small'} src={'images/curl-divider.png'} style={{ marginTop: '-27px' }}/>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={tableHeadStyle}>Ingredient</Table.HeaderCell>
                    <Table.HeaderCell style={tableHeadStyle}>Price</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.map(vendorData, (ingredient, index) => <StuffIngredientVendorPrice key={index} ivp={ingredient} vendorName={this.props.doc.name}/>)}
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
  ingredients: PropTypes.array.isRequired,
  ingredientVendorPrice: PropTypes.array.isRequired,
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
    ingredients: Ingredients.collection.find().fetch(),
    ingredientVendorPrice: IngredientVendorPrice.collection.find().fetch(),
    doc,
    ready,
  };
})(VendorProfile);
