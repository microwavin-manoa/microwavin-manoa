import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Container, Table, Header, Loader, Button, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import StuffRecipeAdmin from '../components/StuffRecipeAdmin';
import StuffVendor from '../components/StuffVendor';
import AdminSidebar from '../components/Sidebar';
import { Recipes } from '../../api/recipe/Recipes';
import { Vendors } from '../../api/vendor/Vendors';
import { Tags } from '../../api/tag/Tags';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { Ingredients } from '../../api/ingredient/Ingredient';

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
      <div id={'admin-page'}>
        <AdminSidebar/>
        <Container style={{ marginTop: '30px' }}>
          <Header as="h2" textAlign="center" id="recipeHeader">All Recipes</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
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
                <Table.HeaderCell style={tableHeadStyle}>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.recipes.map((recipe) => <StuffRecipeAdmin key={recipe._id} recipe={recipe} />)}
            </Table.Body>
          </Table>
          <Header as="h2" textAlign="center" id="vendorHeader">Vendor Profiles</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={tableHeadStyle}>Vendor Name</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Image</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Address</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Hours</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Edit Vendor</Table.HeaderCell>
                <Table.HeaderCell style={tableHeadStyle}>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.vendors.map((vendor) => <StuffVendor key={vendor._id} vendor={vendor} />)}
            </Table.Body>
          </Table>
        </Container>
        <Container>
          <Button as={Link} to='/addvendor' id={'add-vendor-button'} fluid style={buttonStyle} attached={'bottom'}>Add Vendor</Button>
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
  const sub3 = Meteor.subscribe(Tags.userPublicationName);
  const sub4 = Meteor.subscribe(TagRecipe.userPublicationName);
  const sub5 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  const sub6 = Meteor.subscribe(Ingredients.userPublicationName);
  // Determine if the subscriptions are ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready();
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
