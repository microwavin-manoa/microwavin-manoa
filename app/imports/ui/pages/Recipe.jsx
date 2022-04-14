import React from 'react';
import { Header, Image, Grid } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Recipes } from '../../api/recipe/Recipes';

/** A simple static component to render some text for the Recipe page. */
class Recipe extends React.Component {
  render() {
    return (
      <div container>
        <Grid verticalAlign='middle' textAlign='center'>
          <Grid.Column width={5}>
            <Image size='large' fluid rounded src={this.props.doc.imageURL}/>
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h2" textAlign="center">{this.props.doc.name}</Header>
            <Header as='h3' textAlign='center'>Ingredients</Header>
            <p>{this.props.doc.ingredients}</p>
            <Header as='h3' textAlign='center'>Recipe</Header>
            <p>{this.props.doc.description}</p>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
Recipe.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Recipes.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Recipes.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(Recipe);
