import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Header, Loader, Card, Segment, Image, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
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

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class SearchRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: [], isFiltered: false };
  }

  // Submit the tags
  submit(data, formRef) {
    if (data.tags.length > 0) {
      this.setState({ tags: data.tags || [], isFiltered: true });
    } else {
      this.setState({ tags: data.tags || [], isFiltered: false });
      formRef.reset();
    }
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const filterButtonStyle = { backgroundColor: '#85865F', color: 'white' };
    let fRef = null;
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
    let recipeMap = _.flatten(testing.map((recipeID) => Recipes.collection.find({ _id: recipeID }).fetch()));
    recipeMap = recipeMap.sort((a, b) => a.name.localeCompare(b.name));
    return (
      <Container id="search-recipe-page" style={{ marginTop: '30px' }}>
        <Header as="h2" textAlign="center" id='page-header-style'>Search Recipes</Header>
        <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
        <Segment className='form-style'>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <MultiSelectField id='tags' name='tags' showInlineError={true} placeholder={'Filter by Tag'}/>
              <SubmitField id='submit' value='Filter' style={filterButtonStyle}/>
              <Button id='display-button-style' onClick={() => this.submit({ tags: [] }, fRef)}>Display all</Button>
            </Segment>
          </AutoForm>
        </Segment>
        <br/><br/>
        <Card.Group centered itemsPerRow={5}>
          {(this.state.isFiltered) ? recipeMap.map((recipe, index) => <RecipeCard key={index} recipe={recipe}/>) : this.props.recipes.map((recipe, index) => <RecipeCard key={index} recipe={recipe}/>)}
        </Card.Group>
        <Button as={Link} to='/search#search-recipe-page' icon='arrow up' circular id='to-top-button' size='big'/>
      </Container>
    );
  }

}

// Require an array of Stuff documents in the props.
SearchRecipe.propTypes = {
  recipes: PropTypes.array.isRequired,
  tagsCol: PropTypes.array.isRequired,
  tagRep: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Recipes.adminPublicationName);
  const subscription2 = Meteor.subscribe(Tags.userPublicationName);
  const subscription3 = Meteor.subscribe(TagRecipe.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready() && subscription2.ready() && subscription3.ready();
  // Get the Stuff documents
  let recipes = Recipes.collection.find().fetch();
  recipes = recipes.sort((a, b) => a.name.localeCompare(b.name));
  const tagsCol = Tags.collection.find({}).fetch();
  const tagRep = TagRecipe.collection.find({}).fetch();
  return {
    recipes,
    tagsCol,
    tagRep,
    ready,
  };
})(SearchRecipe);
