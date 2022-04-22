import React from 'react';
import { Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../../api/vendor/Vendors';

function formatPrice(price) {
  return `$${(Math.round(price * 100) / 100).toFixed(2)}`;
}

function getVendorID(name) {
  return Vendors.collection.findOne({ name })._id;
}

class RecipeVendorPriceTable extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    console.log(getVendorID(this.props.vendor));
    return (
      <Table.Row>
        <Table.Cell>{this.props.name}</Table.Cell>
        <Table.Cell>
          <Link to={`/vendor/${getVendorID(this.props.vendor)}`}>{this.props.vendor}</Link>
        </Table.Cell>
        <Table.Cell>
          {formatPrice(this.props.price)}
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
RecipeVendorPriceTable.propTypes = {
  name: PropTypes.string,
  vendor: PropTypes.string,
  price: PropTypes.number,
  ready: PropTypes.bool.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Vendors.userPublicationName);
  return {
    ready: sub1.ready(),
  };
})(RecipeVendorPriceTable);
