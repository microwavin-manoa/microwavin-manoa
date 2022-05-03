import React from 'react';
import { Label, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import EditPopup from './EditPopup';
import { Vendors } from '../../api/vendor/Vendors';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

function formatPrice(price) {
  return `$${(Math.round(price * 100) / 100).toFixed(2)}`;
}

function getVendor(name) {
  const ingID = Ingredients.collection.findOne({ name })._id;
  const vendorData = IngredientVendorPrice.collection.findOne({ ingredientId: ingID });
  return vendorData.vendor;
}

class StuffIngredientVendorPrice extends React.Component {
  render() {
    console.log(this.props.ivp.ingredient);
    const vendorName = getVendor(this.props.ivp.ingredient);
    console.log(vendorName);
    return (
      <Table.Row>
        <Table.Cell>
          {this.props.ivp.ingredient}
        </Table.Cell>
        <Table.Cell>
          {formatPrice(this.props.ivp.price)}
        </Table.Cell>
        <Table.Cell>
          {vendorName}
        </Table.Cell>
        <Table.Cell>
          
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
