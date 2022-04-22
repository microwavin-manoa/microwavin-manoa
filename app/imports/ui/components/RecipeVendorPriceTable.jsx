import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Vendors } from '../../api/vendor/Vendors';

function formatPrice(price) {
  return `$${(Math.round(price * 100) / 100).toFixed(2)}`;
}

function getVendorID(name) {
  return Vendors.collection.findOne({ name })._id;
}

class RecipeVendorPriceTable extends React.Component {

  render() {
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
};

export default RecipeVendorPriceTable;
