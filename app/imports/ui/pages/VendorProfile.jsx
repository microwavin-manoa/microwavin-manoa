import React from 'react';
import { Image, Grid, Container, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Vendors } from '../../api/vendor/Vendors';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import StuffIngredientVendorPrice from '../components/StuffIngredientVendorPrice';

function getVendorIngredients(name) {
  // const vendors = name.name;
  const ingredient = _.pluck(IngredientVendorPrice.collection.find({ vendor: name }).fetch(), 'ingredient');
  const price = _.pluck(IngredientVendorPrice.collection.find({ vendor: name }).fetch(), 'price');
  return _.extend({ }, name, { ingredient, price });
}

/** A simple static component to render some text for the Recipe page. */
class VendorProfile extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const vendors = _.pluck(Vendors.collection.find().fetch(), this.props.doc.vendor);
    const vendorData = vendors.map(vendor => getVendorIngredients(vendor));

    // const mapped = this.props.ivp.map((ingredient) => <StuffIngredientVendorPrice key={ingredient._id} ivp={ingredient}/>);
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
            <Grid.Column width={4}>
              <h3>Stock</h3>
              {_.map(vendorData, (ingredient) => <StuffIngredientVendorPrice key={ingredient._id} ivp={ingredient}/>)}
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Container>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
VendorProfile.propTypes = {
  ivp: PropTypes.array,
  ready: PropTypes.bool.isRequired,
  doc: PropTypes.object.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const sub = Meteor.subscribe(Vendors.userPublicationName);
  const sub2 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  // Determine if the subscription is ready
  const ready = sub.ready() && sub2.ready();
  // Get the document
  const doc = Vendors.collection.findOne(documentId);
  const ivp = IngredientVendorPrice.collection.find({}).fetch();
  return {
    ivp,
    ready,
    doc,
  };
})(VendorProfile);
