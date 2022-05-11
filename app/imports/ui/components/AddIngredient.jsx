import React from 'react';
import { Segment, Accordion, Icon, Form, Container } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { addIngredientMethod } from '../../startup/both/Methods';
import { Vendors } from '../../api/vendor/Vendors';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allVendors) => new SimpleSchema({
  name: String,
  vendor: {
    type: String,
    defaultValue: 'Foodland',
    allowedValues: allVendors,
  },
  price: Number,
});

/** Renders the Page for adding a document. */
class AddIngredient extends React.Component {

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
    const accStyle = { backgroundColor: '#85865F', width: '1100px' };
    const submitStyle = { backgroundColor: '#4f583d', color: '#FFFFFF' };
    return (
      <Accordion styled style={accStyle}>
        <Accordion.Title style={{ color: '#FFFFFF' }} active={activeIndex === -1} index={0} onClick={this.handleClick}>
          <Icon name='dropdown'/>
          Add New Ingredient
        </Accordion.Title>
        <Accordion.Content active={activeIndex === -1}>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <TextField id='addIng-form-name' name='name' size={'small'}/>
              <Form.Group widths={'equal'}>
                <SelectField name='vendor'/>
                <NumField id='addIng-form-price' name='price' decimal={true}/>
              </Form.Group>
              <SubmitField id='addIng-form-submit' value='Submit' style={submitStyle}/>
              <ErrorsField/>
            </Segment>
            <Container text style={{ float: 'left', paddingBottom: '5px', color: 'white' }}><Icon inverted name='shopping basket' style={{ marginRight: '8px' }}/>After you submit, you can now see the ingredient above</Container><br/>
          </AutoForm>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default AddIngredient;
