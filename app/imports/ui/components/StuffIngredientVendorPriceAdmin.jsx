import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { Link } from 'react-router-dom';

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
    const vendorName = getVendor(this.props.ivp.ingredient);
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
          <Link id={'edit-ingredient-button-admin'} to={`/editingredient/${this.props.ivp.ingredientId}`}>Edit</Link>
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
