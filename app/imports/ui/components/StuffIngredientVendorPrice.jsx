import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import EditPopup from './EditPopup';

function formatPrice(price) {
  return `$${(Math.round(price * 100) / 100).toFixed(2)}`;
}

class StuffIngredientVendorPrice extends React.Component {
  render() {
    return (
      <Table.Row id='table-text-style'>
        <Table.Cell>{this.props.ivp.ingredient}</Table.Cell>
        <Table.Cell>
          {formatPrice(this.props.ivp.price)}
          <EditPopup ing={this.props.ivp} vendorName={this.props.vendorName}/>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffIngredientVendorPrice.propTypes = {
  ivp: PropTypes.object.isRequired,
  vendorName: PropTypes.string.isRequired,
};

export default StuffIngredientVendorPrice;
