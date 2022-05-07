import React from 'react';
import { Segment, Accordion, Icon, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { addIngredientMethod } from '../../startup/both/Methods';
import { Vendors } from '../../api/vendor/Vendors';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allVendors) => new SimpleSchema({
  name: String,
  vendor: {
    type: String,
    allowedValues: allVendors,
  },
  price: Number,
});

/** Renders the Page for adding a document. */
class AddIngredientVendor extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    let { name, price } = data;
    const { vendor } = data;
    // format name with proper capitalization
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    // round price to 2 decimal places and get rid of negative if needed
    price = Math.abs(Number((Math.round(price * 100) / 100).toFixed(2)));
    const newData = { name, vendor, price };
    Meteor.call(addIngredientMethod, newData, (error) => {
      if (error) {
        swal('Error', 'Ingredient already exists!', 'error');
      } else {
        swal('Success', 'Ingredient added successfully', 'success').then(() => formRef.reset());
      }
    });
  }

  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    let fRef = null;
    const { activeIndex } = this.state;
    const allVendors = _.pluck(Vendors.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allVendors);
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Accordion styled className='form-style'>
        <Accordion.Title active={activeIndex === -1} index={0} onClick={this.handleClick}>
          <Icon name='dropdown' />
          Add New Ingredient
        </Accordion.Title>
        <Accordion.Content active={activeIndex === -1}>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <TextField name='name' size={'small'}/>
              <Form.Group widths={'equal'}><SelectField name='vendor' value={this.props.vendorName} disabled={true}/>
                <NumField name='price' decimal={true}/></Form.Group>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Accordion.Content>
      </Accordion>
    );
  }
}

AddIngredientVendor.propTypes = {
  vendorName: PropTypes.string.isRequired,
};

export default AddIngredientVendor;
