import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Table, Header, Loader, Button, Image } from 'semantic-ui-react';
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
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

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
    const margins = { marginLeft: 25, marginRight: 25 };
    // this style is already in css as #page-header-style so I commented it out
    // and replaced the id so it's easier to edit later where pageHeader is used
    // const pageHeader = { fontFamily: 'Libre Bodoni', fontSize: 28 };
    return (
      <div id={'admin-page'} style={margins}>
        <AdminSidebar/>
        <div style={{ marginTop: '30px' }}>
          <Header as="h2" textAlign="center" id='page-header-style'>All Recipes</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
          <Table celled>
            <Table.Header >
              <Table.Row >
                <Table.HeaderCell id="table-header-style" >Name</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Image</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Prep-Time</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Serving Size</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Ingredients</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Tags</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Owner</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Edit</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style">Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.recipes.map((recipe) => <StuffRecipeAdmin key={recipe._id} recipe={recipe} />)}
            </Table.Body>
          </Table>
          <Header as="h2" textAlign="center" id='page-header-style'>Vendor Profiles</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell id="table-header-style" >Vendor Name</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style" >Image</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style" >Address</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style" >Hours</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style" >Edit Vendor</Table.HeaderCell>
                <Table.HeaderCell id="table-header-style" >Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.vendors.map((vendor) => <StuffVendor key={vendor._id} vendor={vendor} />)}
            </Table.Body>
          </Table>
        </div>
        <div>
          <Button as={Link} to='/addvendor' id={'add-vendor-button'} fluid style={buttonStyle} attached={'bottom'}>Add Vendor</Button>
        </div>

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
  const sub7 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  // Determine if the subscriptions are ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
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
