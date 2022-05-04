import React from 'react';
import { Grid, Loader, Header, Segment, Image } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Vendors } from '../../api/vendor/Vendors';
import { updateIngredientMethod } from '../../startup/both/Methods';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { Ingredients } from '../../api/ingredient/Ingredient';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = () => new SimpleSchema({
  ingredient: String,
  price: String,
  vendor: String,
});

function getIngredient(name) {
  const ingID = Ingredients.collection.findOne({ name })._id;
  const ingredientData = IngredientVendorPrice.collection.findOne({ ingredientId: ingID });
  return ingredientData.ingredients;
}

function getPrice(name) {
  const ingID = Ingredients.collection.findOne({ name })._id;
  const vendorData = IngredientVendorPrice.collection.findOne({ ingredientId: ingID });
  return vendorData.price;
}

function getVendor(name) {
  const ingID = Ingredients.collection.findOne({ name })._id;
  const vendorData = IngredientVendorPrice.collection.findOne({ ingredientId: ingID });
  return vendorData.vendor;
}

/** Renders the Page for editing a single document. */
class EditIngredient extends React.Component {
  // On successful submit, insert the data.
  submit(data) {
    const newData = data;
    newData.oldName = this.props.doc.ingredientId;
    Meteor.call(updateIngredientMethod, newData, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe updated successfully', 'success');
      }
    });
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    const allIngredients = _.pluck(IngredientVendorPrice.collection.find().fetch(), 'ingredient');
    const allPrices = _.pluck(IngredientVendorPrice.collection.find().fetch(), 'price');
    const allVendors = _.pluck(IngredientVendorPrice.collection.find().fetch(), 'vendor');
    const formSchema = makeSchema(allIngredients, allPrices, allVendors);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const model = _.extend({}, this.props.doc);
    model.ingredient = this.props.doc.ingredient;
    model.price = getPrice(this.props.doc.price);
    model.vendor = getVendor(this.props.doc.vendor);
    return (
      <Grid id={'edit-ingredient-page'} container centered style={{ marginTop: '10px' }}>
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Ingredient</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
            <Segment>
              <TextField name='ingredient'/>
              <NumField name='price' decimal={true}/>
              <TextField name='vendor'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditIngredient.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const sub1 = Meteor.subscribe(Vendors.userPublicationName);
  const sub2 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub3 = Meteor.subscribe(Ingredients.userPublicationName);
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready();
  // Get the document
  const doc = Ingredients.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(EditIngredient);
