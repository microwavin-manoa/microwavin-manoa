import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

class StuffIngredientVendorPrice extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.ivp.ingredient}</Table.Cell>
        <Table.Cell>{this.props.ivp.ingredientId}</Table.Cell>
        <Table.Cell>{this.props.ivp.vendor}</Table.Cell>
        <Table.Cell>{this.props.ivp.price}</Table.Cell>
        <Table.Cell>
          <Link to={`/edit/${this.props.ivp._id}`}>Edit</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffIngredientVendorPrice.propTypes = {
  ivp: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  return {
    ready: sub1.ready(),
  };
})(StuffIngredientVendorPrice);
