import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Container, Table, Header, Loader, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import StuffRecipeAdmin from '../components/StuffRecipeAdmin';
import StuffVendor from '../components/StuffVendor';
import AdminSidebar from '../components/Sidebar';
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
    // define styles
    const buttonStyle = { backgroundColor: '#4f583d', color: '#FFFFFF' };
    const tableHeadStyle = { backgroundColor: '#d4c8a1' };
    return (
      <div>
        <AdminSidebar/>
        <Container>
          <Header as="h2" textAlign="center" id="recipeHeader">All Recipes</Header>
          <Table celled>
            <Table.Header >
              <Table.Row >
                <Table.HeaderCell style={tableHeadStyle} >Name</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Image</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Prep-Time</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Serving Size</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Ingredients</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Tags</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Description</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Owner</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.recipes.map((recipe) => <StuffRecipeAdmin key={recipe._id} recipe={recipe} />)}
            </Table.Body>
          </Table>
          <Header as="h2" textAlign="center" id="vendorHeader">Vendor Profiles</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={tableHeadStyle}>Vendor Name</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Image</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Address</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Hours</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Edit Vendor</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.vendors.map((vendor) => <StuffVendor key={vendor._id} vendor={vendor} />)}
            </Table.Body>
          </Table>
        </Container>
        <Container>
          <Button as={Link} to='/addvendor' id={'adminPageLink'} fluid style={buttonStyle} attached={'bottom'}>Add Vendor</Button>
        </Container>

      </div>
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
  // Get access to Recipes and Vendors documents.
  const sub1 = Meteor.subscribe(Recipes.userPublicationName);
  const sub2 = Meteor.subscribe(Vendors.userPublicationName);
  // Determine if the subscriptions are ready
  const ready = sub1.ready() && sub2.ready();
  // Get the Stuff documents
  let recipes = Recipes.collection.find().fetch();
  recipes = recipes.sort((a, b) => a.name.localeCompare(b.name));
  const vendors = Vendors.collection.find().fetch();
  return {
    recipes,
    vendors,
    ready,
  };
})(AdminPage);
