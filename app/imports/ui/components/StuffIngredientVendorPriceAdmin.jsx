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
  const ingredientVal = _.pluck(IngredientVendorPrice.collection.find({ ingID: ingID }).fetch(), 'ingredientID');
  return _.flatten(ingredientVal.map(vendorID => _.pluck(Vendors.collection.find({ _id: vendorID }).fetch(), 'name')));
}

class StuffIngredientVendorPrice extends React.Component {
  render() {
    const vendorData = getVendor(this.props.ivp.ingredient);
    return (
      <Table.Row>
        <Table.Cell>
          {this.props.ivp.ingredient}
          <EditPopup ing={this.props.ivp.ingredient} vendorName={this.props.vendorName}/>
        </Table.Cell>
        <Table.Cell>
          {formatPrice(this.props.ivp.price)}
          <EditPopup ing={this.props.ivp} vendorName={this.props.vendorName}/>
        </Table.Cell>
        <Table.Cell>
          {_.map(vendorData, (vendor, index) => <Label key={index}>{vendor}</Label>)}
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
