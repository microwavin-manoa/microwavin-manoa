import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Recipes } from '../../api/recipe/Recipes';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Ingredients } from '../../api/ingredient/Ingredient';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allIngredients) => new SimpleSchema({
  name: String,
  imageURL: String,
  prepTime: String,
  servingSize: String,
  ingredients: { type: Array, label: 'Ingredients' },
  'ingredients.$': { type: String, allowedValues: allIngredients },
  description: String,
});

/** Renders the Page for editing a single document. */
class EditRecipe extends React.Component {

  // On successful submit, insert the data.
  // STILL NEED TO EDIT IT IN INGREDIENT RECIPE COLLECTION
  submit(data) {
    const { name, imageURL, prepTime, servingSize, owner, description, _id } = data;
    Recipes.collection.update(_id, { $set: { name, imageURL, prepTime, servingSize, owner, description } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Recipe updated successfully', 'success')));
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    const allIngredients = _.pluck(Ingredients.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allIngredients);
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Recipe</Header>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
            <Segment>
              <TextField name='name'/>
              <TextField name='imageURL'/>
              <TextField name='prepTime'/>
              <TextField name='servingSize'/>
              <MultiSelectField name='ingredients' placeholder='Select ingredients'/>
              <LongTextField name='description'/>
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
EditRecipe.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  // SHOULD FIND WAY TO FILL IN INGREDIENT SELECT
  const documentId = match.params._id;
  const sub1 = Meteor.subscribe(Recipes.userPublicationName);
  const sub2 = Meteor.subscribe(Ingredients.userPublicationName);
  const ready = sub1.ready() && sub2.ready();
  // Get the document
  const doc = Recipes.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(EditRecipe);
