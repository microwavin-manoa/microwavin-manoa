import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Vendors } from '../../api/vendor/Vendors';
import { updateVendorMethod } from '../../startup/both/Methods';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { Ingredients } from '../../api/ingredient/Ingredient';

const bridge = new SimpleSchema2Bridge(Vendors.schema);

/** Renders the Page for editing a single document. */
class EditVendor extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    let newData = data;
    let { name } = data;
    const { address, hours, imageURL } = data;
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    newData = { name, address, hours, imageURL };
    newData.oldName = this.props.doc.name;
    Meteor.call(updateVendorMethod, newData, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Vendor updated successfully', 'success');
      }
    });
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    return (
      <Grid id={'edit-vendor-page'} container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Vendor Profile</Header>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
            <Segment>
              <TextField name='name'/>
              <TextField name='address'/>
              <TextField name='hours'/>
              <TextField name='imageURL'/>
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
EditVendor.propTypes = {
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
  const doc = Vendors.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(EditVendor);
