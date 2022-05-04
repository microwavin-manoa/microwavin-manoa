import React from 'react';
import { Image, Grid, Container, Loader, Header, Table, Icon, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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

function isNewVendor(vendorName) {
  if (vendorName !== 'Foodland' && vendorName !== 'Safeway' && vendorName !== 'Down to Earth' && vendorName !== 'Kokua Market' && vendorName !== 'Nijiya Market') {
    return true;
  }
  return false;
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
    vendorData = vendorData.sort((a, b) => a.ingredient.localeCompare(b.ingredient));
    const tableHeadStyle = { backgroundColor: '#c9c9a9', fontFamily: 'Libre Bodoni' };
    const mapStyle = { border: 0, opacity: '0.7' };
    const textStyle = { fontFamily: 'Libre Bodoni' };
    return (
      <Container id={'vendor-profile-page'}>
        <Grid textAlign='center'>
          <Grid.Row>
            <br/>
            <Link to='/vendors'><Button id='back-button-style' content='See all vendors' icon='left arrow' labelPosition='left'/></Link>
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
                <br/>
                <Header as='h4' style={textStyle}>Map</Header>
                {(isNewVendor(this.props.doc.name)) ?
                  <iframe
                    /* eslint-disable-next-line max-len */
                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d14869.763570799363!2d-157.82540445619043!3d21.293588212292523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgrocery%20store%20near%20UH%20manoa!5e0!3m2!1sen!2sus!4v1651619660878!5m2!1sen!2sus"
                    width="100%" height="400" style={mapStyle} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  : ''}
                {(this.props.doc.name === 'Foodland') ?
                  <iframe
                    /* eslint-disable-next-line max-len */
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14869.763616583326!2d-157.82540445864532!3d21.293587759665495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d83419b577b%3A0xe0b8f12d6627bbf8!2sFoodland%20Market%20City!5e0!3m2!1sen!2sus!4v1651620420517!5m2!1sen!2sus"
                    width="100%" height="400" style={mapStyle} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  : ''}
                {(this.props.doc.name === 'Safeway') ?
                  <iframe
                    /* eslint-disable-next-line max-len */
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14868.230007799664!2d-157.82676119218752!3d21.308744100000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006da777aad419%3A0xa20184732719b1e5!2sSafeway!5e0!3m2!1sen!2sus!4v1651621667891!5m2!1sen!2sus"
                    width="100%" height="400" style={mapStyle} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  : ''}
                {(this.props.doc.name === 'Down to Earth') ?
                  <iframe
                    /* eslint-disable-next-line max-len */
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59472.92158985062!2d-157.8530260399221!3d21.308740250347046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d90440259e9%3A0x94de762f468e21a4!2sDown%20To%20Earth%20Organic%20%26%20Natural%20Honolulu!5e0!3m2!1sen!2sus!4v1651621770883!5m2!1sen!2sus"
                    width="100%" height="400" style={mapStyle} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  : ''}
                {(this.props.doc.name === 'Nijiya Market') ?
                  <iframe
                    /* eslint-disable-next-line max-len */
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14869.853916477965!2d-157.84275812381972!3d21.29269502369408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d9071136ab3%3A0x313a80759d1b6f88!2sNijiya%20Market%20University%20Store!5e0!3m2!1sen!2sus!4v1651621841230!5m2!1sen!2sus"
                    width="100%" height="400" style={mapStyle} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  : ''}
                {(this.props.doc.name === 'Kokua Market') ?
                  <iframe
                    /* eslint-disable-next-line max-len */
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.5031538234616!2d-157.82310128527982!3d21.29112598585677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d854f94fb19%3A0x419df6aa24ed8346!2sKokua%20Market%20Natural%20Foods!5e0!3m2!1sen!2sus!4v1651621921673!5m2!1sen!2sus"
                    width="100%" height="400" style={mapStyle} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                  : ''}
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={5}>
              <Header as="h3" textAlign="center" style={textStyle}>Stock</Header>
              <Image centered size={'small'} src={'images/curl-divider.png'} style={{ marginTop: '-27px' }}/>
              {(vendorData.length === 0) ?
                <Container>
                  <Header as='h4' style={{ marginTop: '20px' }}>There isn&apos;t any ingredient<br/>info for this vendor yet!</Header>
                </Container> : ''}
              {(vendorData.length > 0) ?
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
                </Table> : ''}
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
