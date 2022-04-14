import React from 'react';
import { Grid, Segment, Header, Accordion, Icon } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Stuffs } from '../../api/stuff/Stuff';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  vendor: String,
  price: Number,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddIngredient extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { name, vendor, price } = data;
    const owner = Meteor.user().username;
    Stuffs.collection.insert({ name, vendor, price, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
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
              {/* make vendor a multiselect */}
              <TextField name='vendor'/>
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

export default AddIngredient;
