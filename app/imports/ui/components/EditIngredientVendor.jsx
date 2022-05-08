import React from 'react';
import { Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { updatePriceMethod } from '../../startup/both/Methods';

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
    Meteor.call(updatePriceMethod, newData, (error) => {
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
};

export default EditIngredientVendor;
