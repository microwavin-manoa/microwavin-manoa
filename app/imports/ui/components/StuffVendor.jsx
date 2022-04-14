import React from 'react';
import { Table, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../../api/vendor/Vendors';

class StuffVendor extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.vendor.name}</Table.Cell>
        <Table.Cell><Image size = 'small' src={this.props.vendor.imageURL}/></Table.Cell>
        <Table.Cell>{this.props.vendor.address}</Table.Cell>
        <Table.Cell>{this.props.vendor.hours}</Table.Cell>
        <Table.Cell>
          <Link to={`/editvendor/${this.props.vendor._id}`}>Edit</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffVendor.propTypes = {
  vendor: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Vendors.userPublicationName);
  return {
    ready: sub1.ready(),
  };
})(StuffVendor);
