import React from 'react';
import { Segment, Accordion, Icon } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Vendors } from '../../api/vendor/Vendors';
import { Ingredients } from '../../api/ingredient/Ingredient';

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
    const { name, vendor, price } = data;
    const owner = Meteor.user().username;
    Ingredients.collection.insert({ name, vendor, price, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Ingredient added successfully', 'success');
          formRef.reset();
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
      <Accordion styled>
        <Accordion.Title active={activeIndex === -1} index={0} onClick={this.handleClick}>
          <Icon name='dropdown' />
          Add New Ingredient
        </Accordion.Title>
        <Accordion.Content active={activeIndex === -1}>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <TextField name='name' size={'small'}/>
              <SelectField name='vendor'/>
              <NumField name='price' decimal={true}/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Accordion.Content>
      </Accordion>
    );
  }
}

AddIngredient.propTypes = {
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Vendors.userPublicationName);
  return {
    ready: sub1.ready(),
  };
})(AddIngredient);
