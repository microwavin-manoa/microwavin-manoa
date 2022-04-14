import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import StuffRecipeAdmin from '../components/StuffRecipeAdmin';
import { Recipes } from '../../api/recipe/Recipes';

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
        <Table basic='very' celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor Name</Table.HeaderCell>
              <Table.HeaderCell>Edit Vendor Profile</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Header as='h4' image>
                  <Image src="/images/foodland.jpeg" rounded size='mini' />
                  <Header.Content>
                    Foodland
                    <Header.Subheader>Hours: 6:00am - 9:00pm</Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>Edit Profile Here</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
AdminPage.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  recipes: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Recipes.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const recipes = Recipes.collection.find({}).fetch();
  return {
    recipes,
    ready,
  };
})(AdminPage);
