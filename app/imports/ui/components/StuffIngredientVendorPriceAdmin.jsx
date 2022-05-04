import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    const vendorName = getVendor(this.props.ivp.ingredient);
    return (
      <Table.Row id="table-text-style">
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
          <Link id='edit-ingredient-button-admin' to={`/editingredient/${this.props.ivp.ingredientId}`}><Button size='big' icon='edit' id='edit-button-style'/></Link>
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
