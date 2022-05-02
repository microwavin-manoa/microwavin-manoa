import React from 'react';
import { Table, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DeleteVendorModal from './DeleteVendorModal';

class StuffVendor extends React.Component {
  render() {
    return (
      <Table.Row id="table-text-style">
        <Table.Cell id="columnStyle">{this.props.vendor.name}</Table.Cell>
        <Table.Cell><Image size = 'small' src={this.props.vendor.imageURL}/></Table.Cell>
        <Table.Cell>{this.props.vendor.address}</Table.Cell>
        <Table.Cell>{this.props.vendor.hours}</Table.Cell>
        <Table.Cell>
          <Link id={'edit-vendor-button'} to={`/editvendor/${this.props.vendor._id}`}>Edit</Link>
        </Table.Cell>
        <Table.Cell>
          <DeleteVendorModal vendor={this.props.vendor}/>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffVendor.propTypes = {
  vendor: PropTypes.object.isRequired,
};

export default StuffVendor;
