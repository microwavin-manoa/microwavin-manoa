import React from 'react';
import { Grid, Loader, Header, Segment, Image, Form, Button } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Link } from 'react-router-dom';
import { Vendors } from '../../api/vendor/Vendors';
import { updateIngredientMethod } from '../../startup/both/Methods';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allVendors) => new SimpleSchema({
  ingredient: String,
  price: String,
  vendor: {
    type: String,
    allowedValues: allVendors,
  },
});

/** Renders the Page for editing a single document. */
class EditIngredient extends React.Component {
  // On successful submit, insert the data.
  submit(data) {
    const newData = data;
    newData.ingredientId = this.props.doc.ingredientId;
    newData.oldVendor = this.props.doc.vendor;
    Meteor.call(updateIngredientMethod, newData, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Ingredient updated successfully', 'success');
      }
    });
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    console.log(this.props.doc.ingredientId);
    const submitStyle = { backgroundColor: '#4f583d', color: 'white' };
    const allVendors = _.pluck(Vendors.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allVendors);
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Grid id={'edit-ingredient-page'} container centered style={{ marginTop: '10px' }}>
        <Grid.Column>
          <Link to='/admin#ingredientHeader'><Button id='back-button-style' content='Back to admin' icon='left arrow' labelPosition='left'/></Link>
          <Header as="h2" textAlign="center" id='page-header-style'>Edit Ingredient</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
          <Segment className='form-style'>
            <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
              <Segment>
                <TextField name='ingredient' disabled/>
                <Form.Group widths='equal'><NumField name='price' decimal={true}/>
                  <SelectField name='vendor'/></Form.Group>
                <SubmitField value='Submit' style={submitStyle}/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Segment>
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
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready();
  // Get the document
  const doc = IngredientVendorPrice.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(EditIngredient);
