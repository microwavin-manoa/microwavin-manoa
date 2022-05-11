import React from 'react';
import { Grid, Segment, Header, Image, Button } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Vendors } from '../../api/vendor/Vendors';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  address: String,
  hours: String,
  imageURL: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddVendor extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    let { name } = data;
    const { address, hours, imageURL } = data;
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    Vendors.collection.insert({ name, address, hours, imageURL },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Vendor made successfully', 'success');
          formRef.reset();
        }
      });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    let fRef = null;
    const submitStyle = { backgroundColor: '#4f583d', color: 'white' };
    return (
      <Grid id={'add-vendor-page'} container centered style={{ marginTop: '10px' }}>
        <Grid.Column>
          <Link to='/admin'><Button id='back-button-style' content='Back to admin' icon='left arrow' labelPosition='left'/></Link>
          <Header as="h2" textAlign="center">Add Vendor</Header>
          <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
          <Segment className='form-style'>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <TextField name='name'/>
                <TextField name='address'/>
                <TextField name='hours'/>
                <TextField name='imageURL'/>
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

export default AddVendor;
