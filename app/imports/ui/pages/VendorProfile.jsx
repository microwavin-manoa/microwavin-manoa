import React from 'react';
import { Image, Grid, Container } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Vendors } from '../../api/vendor/Vendors';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

/** A simple static component to render some text for the Recipe page. */
class VendorProfile extends React.Component {
  render() {
    return (
      <div>
        <Container>
          <Grid verticalAlign='middle' textAlign='center'>
            <Grid.Column width={8}>
              <h1>{this.props.doc.name}</h1>
              <Image size='large' rounded src={this.props.doc.imageURL}/>
              <Grid.Column>
                <h3>Address</h3>
                <p>{this.props.doc.address}</p>
              </Grid.Column>
              <Grid.Column>
                <h3>Hours</h3>
                <p>{this.props.doc.hours}</p>
              </Grid.Column>
            </Grid.Column>

            <Grid.Column width={4}>
              <h3>Ingredients</h3>
              <p>{this.props.doc2.}</p>
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
Vendors.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

IngredientVendorPrice.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Vendors.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Vendors.collection.find({}).fetch();
  const doc2 = IngredientVendorPrice.collection.find(documentId);
  return {
    doc,
    doc2,
    ready,
  };
})(VendorProfile);
