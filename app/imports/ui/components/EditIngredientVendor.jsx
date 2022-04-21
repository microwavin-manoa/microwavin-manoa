import React from 'react';
import { Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { updateIngredientMethod } from '../../startup/both/Methods';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { Vendors } from '../../api/vendor/Vendors';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  price: Number,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class EditIngredientVendor extends React.Component {

  // On submit, insert the data.
  submit(data) {
    let { price } = data;
    const name = this.props.ing.ingredient;
    const vendor = this.props.vendorName;
    // round price to 2 decimal places and get rid of negative if needed
    price = Math.abs(Number((Math.round(price * 100) / 100).toFixed(2)));
    const newData = { name, vendor, price };
    Meteor.call(updateIngredientMethod, newData, (error) => {
      if (error) {
        swal('Error', 'Ingredient already exists!', 'error');
      } else {
        swal('Success', 'Ingredient added successfully', 'success');
      }
    });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    const model = _.extend({}, this.props.ing);
    model.price = this.props.ing.price;
    return (
      <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={model}>
        <Segment>
          <NumField name='price' decimal={true}/>
          <SubmitField value='Submit'/>
          <ErrorsField/>
        </Segment>
      </AutoForm>
    );
  }
}

EditIngredientVendor.propTypes = {
  ing: PropTypes.object.isRequired,
  vendorName: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  // this makes double the subscriptions on the add recipe page for IngredientVendorPrice and Ingredient but let's keep them here for now in case we need it
  const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
  const sub2 = Meteor.subscribe(IngredientVendorPrice.userPublicationName);
  const sub3 = Meteor.subscribe(Vendors.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(EditIngredientVendor);
