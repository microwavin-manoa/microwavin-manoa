import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Vendors } from '../../api/vendor/Vendors';
import VendorCard from '../components/VendorCard';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class AllVendors extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the page once subscriptions have been received.
  renderPage() {
    return (
      <Container id = "all-vendors-page" style={{ marginTop: '30px' }}>
        <Header as="h2" textAlign="center">Vendors</Header>
        <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/>
        <br/>
        <Card.Group centered>
          {this.props.vendor.map((vendor, index) => <VendorCard key={index} vendor={vendor}/>)}
        </Card.Group>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
AllVendors.propTypes = {
  vendor: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Vendors.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const vendor = Vendors.collection.find({}).fetch();
  return {
    vendor,
    ready,
  };
})(AllVendors);
