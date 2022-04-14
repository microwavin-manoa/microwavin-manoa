import React from 'react';
import { Table, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

class StuffVendor extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.vendor.name}</Table.Cell>
        <Table.Cell><Image size = 'small' src={this.props.vendor.imageURL}/></Table.Cell>
        <Table.Cell>{this.props.vendor.address}</Table.Cell>
        <Table.Cell>{this.props.vendor.hours}</Table.Cell>
        <Table.Cell>
          <Link to={`/edit/${this.props.vendor._id}`}>Edit</Link>
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
export default withRouter(StuffVendor);
