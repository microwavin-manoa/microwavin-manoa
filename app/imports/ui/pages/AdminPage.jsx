import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import StuffRecipeAdmin from '../components/StuffRecipeAdmin';
import StuffVendor from '../components/StuffVendor';
import { Recipes } from '../../api/recipe/Recipes';
import { Vendors } from '../../api/vendor/Vendors';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class AdminPage extends React.Component {

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the page once subscriptions have been received.
  renderPage() {
    return (
      <Container>
        <Header as="h2" textAlign="center">Admin Edit Page</Header>
        <Header as="h4" textAlign="center">Admin can edit the recipes of all users and profiles of vendors</Header>
        <Header as="h2" textAlign="center">All Recipes</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.recipes.map((recipe) => <StuffRecipeAdmin key={recipe._id} recipe={recipe} />)}
          </Table.Body>
        </Table>
        <Header as="h2" textAlign="center">Vendor Profiles</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor Name</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Hours</Table.HeaderCell>
              <Table.HeaderCell>Edit Vendor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.vendors.map((vendor) => <StuffVendor key={vendor._id} vendor={vendor} />)}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
AdminPage.propTypes = {
  ready: PropTypes.bool.isRequired,
  recipes: PropTypes.array.isRequired,
  vendors: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Recipes.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const recipes = Recipes.collection.find({}).fetch();
  const vendors = Vendors.collection.find({}).fetch();
  return {
    recipes,
    vendors,
    ready,
  };
})(AdminPage);
