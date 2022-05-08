import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DeleteIngredientModal from './DeleteIngredientModal';

function formatPrice(price) {
  return `$${(Math.round(price * 100) / 100).toFixed(2)}`;
}

class StuffIngredientVendorPrice extends React.Component {
  render() {
    return (
      <Table.Row id="table-text-style">
        <Table.Cell>
          {this.props.ivp.ingredient}
        </Table.Cell>
        <Table.Cell>
          {formatPrice(this.props.ivp.price)}
        </Table.Cell>
        <Table.Cell>
          {this.props.ivp.vendor}
        </Table.Cell>
        <Table.Cell>
          <Link id='edit-ingredient-button-admin' to={`/editingredient/${this.props.ivp._id}`}><Button size='big' icon='edit' id='edit-button-style'/></Link>
        </Table.Cell>
        <Table.Cell>
          <DeleteIngredientModal ivp={this.props.ivp}/>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffIngredientVendorPrice.propTypes = {
  ivp: PropTypes.object.isRequired,
};

export default StuffIngredientVendorPrice;
