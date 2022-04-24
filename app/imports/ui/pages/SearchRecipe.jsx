import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Header, Loader, Card, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import { Recipes } from '../../api/recipe/Recipes';
import { Tags } from '../../api/tag/Tags';
import { TagRecipe } from '../../api/tag/TagRecipe';
import RecipeCard from '../components/RecipeCard';
import MultiSelectField from '../forms/controllers/MultiSelectField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allTags) => new SimpleSchema({
  tags: { type: Array, label: 'Tags', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
});

// Get the tags associated with a recipe
function getTags(recID) {
  const tagVal = _.pluck(TagRecipe.collection.find({ recipeID: recID }).fetch(), 'tagID');
  return _.flatten(tagVal.map(tagID => _.pluck(Tags.collection.find({ _id: tagID }).fetch(), 'name')));
}

/**
function checkTags(tagObj) {
   return _.filter(tagObj, function (item) {
    return _.every(item.tags, function (tag) { return tag.contains(this.state.tags)}; );
  });
  // return this.state.tags.map((tag) => (_.filter(tagObj, function (obj) { obj.tags.contains(tag); })));
  console.log(this.state.tags);
  console.log(tagObj);
  console.log(tagObj.tags);
  if (_.every(this.state.tags, (tag) => (tagObj.tags.includes(tag)))) {
    return tagObj.id;
  }
  return [];
}
*/

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class SearchRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: [] };
  }

  // Submit the tags
  submit(data) {
    this.setState({ tags: data.tags || [] });
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the page once subscriptions have been received.
  renderPage() {
    const allTags = _.pluck(Tags.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allTags);
    const bridge = new SimpleSchema2Bridge(formSchema);
    // console.log(this.state.tags);
    // vv all of tags' id's
    const tagIDPluck = _.pluck(Tags.collection.find({ name: { $in: this.state.tags } }).fetch(), '_id');
    // vv all of the recipe ids that have any of those tags
    const tagPluck = _.uniq(_.pluck(TagRecipe.collection.find({ tagID: { $in: tagIDPluck } }).fetch(), 'recipeID'));
    // const tagPluckTags = tagPluck.map((recId) => (getTags(recId))) // array of the tags for each recID
    // const tagPluckObj = _.object(tagPluck, tagPluckTags); // object has recipeID: [array of tags]
    // const checkTagPluckObj = checkTags(tagPluckObj);
    const mapTagPluck = _.map(tagPluck, (rec) => ({ id: rec, tags: getTags(rec), stateTags: this.state.tags }));
    const testing = _.map(mapTagPluck, function (rec) {
      if (_.every(rec.stateTags, (tag) => (rec.tags.includes(tag)))) {
        return rec.id;
      }
      return [];
    });
    const recipeMap = _.flatten(testing.map((recipeID) => Recipes.collection.find({ _id: recipeID }).fetch()));
    return (
      <Container>
        <Header as="h2" textAlign="center">Search Recipes</Header>
        <AutoForm schema={bridge} onSubmit={data => this.submit(data)}>
          <Segment>
            <MultiSelectField id='tags' name='tags' showInlineError={true} placeholder={'Filter by Tag'}/>
            <SubmitField id='submit' value='Submit'/>
          </Segment>
        </AutoForm>
        <br/><br/>
        <Card.Group centered>
          {recipeMap.map((recipe, index) => <RecipeCard key={index} recipe={recipe}/>)}
        </Card.Group>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
SearchRecipe.propTypes = {
  recipe: PropTypes.array.isRequired,
  tagsCol: PropTypes.array.isRequired,
  tagRep: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Recipes.userPublicationName);
  const subscription2 = Meteor.subscribe(Tags.userPublicationName);
  const subscription3 = Meteor.subscribe(TagRecipe.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready() && subscription2.ready() && subscription3.ready();
  // Get the Stuff documents
  const recipe = Recipes.collection.find({}).fetch();
  const tagsCol = Tags.collection.find({}).fetch();
  const tagRep = TagRecipe.collection.find({}).fetch();
  return {
    recipe,
    tagsCol,
    tagRep,
    ready,
  };
})(SearchRecipe);
