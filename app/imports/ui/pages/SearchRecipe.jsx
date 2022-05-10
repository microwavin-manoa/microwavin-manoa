import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Header, Loader, Card, Segment, Image, Button, Popup } from 'semantic-ui-react';
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
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allTags, allIng) => new SimpleSchema({
  tags: { type: Array, label: 'Tags', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
  ing: { type: Array, label: 'Ingredients', optional: true },
  'ing.$': { type: String, allowedValues: allIng },
});

// Get the tags associated with a recipe
function getTags(recID) {
  const tagVal = _.pluck(TagRecipe.collection.find({ recipeID: recID }).fetch(), 'tagID');
  return _.flatten(tagVal.map(tagID => _.pluck(Tags.collection.find({ _id: tagID }).fetch(), 'name')));
}

// returns an array of ingredients for this recipe
function getIngredients(name) {
  const recipeID = Recipes.collection.findOne({ name })._id;
  const ingredientVal = _.pluck(IngredientRecipe.collection.find({ recipeID: recipeID }).fetch(), 'ingredientID');
  return _.flatten(ingredientVal.map(ingID => _.pluck(Ingredients.collection.find({ _id: ingID }).fetch(), 'name')));
}

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class SearchRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: [], ing: [], isFiltered: false, showRand: false };
  }

  // Submit the tags
  submit(data, formRef) {
    console.log(data.ing, data.ing.length);
    if (data.tags.length > 0 || data.ing.length > 0) {
      console.log('in');
      this.setState({ tags: data.tags || [], ing: data.ing || [], isFiltered: true, showRand: false });
    } else {
      console.log('not');
      this.setState({ tags: data.tags || [], ing: data.ing || [], isFiltered: false, showRand: false });
      formRef.reset();
    }
    console.log(this.state.isFiltered);
  }

  randRecipe(recipeMap, formRef) {
    this.setState({ tags: [], ing: [], isFiltered: false, showRand: true });
    formRef.reset();
  }

  renderCards(recipeMap) {
    if (this.state.showRand) {
      return <RecipeCard recipe={_.shuffle(this.props.recipes)[0]}/>;
    }
    if (!this.state.showRand && this.state.isFiltered) {
      return recipeMap.map((recipe, index) => <RecipeCard key={index} recipe={recipe}/>);
    }
    return this.props.recipes.map((recipe, index) => <RecipeCard key={index} recipe={recipe}/>);
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const filterButtonStyle = { backgroundColor: '#85865F', color: 'white' };
    const randButtonStyle = { borderRadius: 10, opacity: 0.6, padding: '2em' };
    let fRef = null;
    const allTags = _.pluck(Tags.collection.find().fetch(), 'name');
    let allIng = _.pluck(Ingredients.collection.find().fetch(), 'name');
    allIng = allIng.sort();
    const formSchema = makeSchema(allTags, allIng);
    const bridge = new SimpleSchema2Bridge(formSchema);
    // vv all of tags' id's
    const tagIDPluck = _.pluck(Tags.collection.find({ name: { $in: this.state.tags } }).fetch(), '_id');
    // vv all of the recipe ids that have any of those tags
    const tagPluck = _.uniq(_.pluck(TagRecipe.collection.find({ tagID: { $in: tagIDPluck } }).fetch(), 'recipeID'));
    const mapTagPluck = _.map(tagPluck, (rec) => ({ id: rec, tags: getTags(rec), stateTags: this.state.tags }));
    const testing = _.map(mapTagPluck, function (rec) {
      if (_.every(rec.stateTags, (tag) => (rec.tags.includes(tag)))) {
        return rec.id;
      }
      return [];
    });
    // ingredient filtering
    const ingIDPluck = _.pluck(Ingredients.collection.find({ name: { $in: this.state.ing } }).fetch(), '_id');
    const ingPluck = _.uniq(_.pluck(IngredientRecipe.collection.find({ ingredientID: { $in: ingIDPluck } }).fetch(), 'recipeID'));
    const mapIngPluck = _.map(ingPluck, (rec) => ({ id: rec, ing: getIngredients(rec), stateIng: this.state.ing }));
    const testing2 = _.map(mapIngPluck, function (rec) {
      if (_.every(rec.stateIng, (ingredient) => (rec.ing.includes(ingredient)))) {
        return rec.id;
      }
      return [];
    });
    let recipeMapTag = _.flatten(testing.map((recipeID) => Recipes.collection.find({ _id: recipeID }).fetch()));
    // console.log(recipeMapTag);
    const recipeMapIng = _.flatten(testing2.map((recipeID) => Recipes.collection.find({ _id: recipeID }).fetch()));
    console.log(recipeMapIng);
    recipeMapTag = recipeMapTag.sort((a, b) => a.name.localeCompare(b.name));
    return (
      <Container id="search-recipe-page" style={{ marginTop: '30px' }}>
        <Header as="h2" textAlign="center" id='page-header-style'>Search Recipes</Header>
        <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-10px' }}/><br/>
        <Segment className='form-style'>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <MultiSelectField id='tags' name='tags' showInlineError={true} placeholder={'Filter by Tag'}/>
              <MultiSelectField id='ing' name='ing' showInlineError={true} placeholder={'Filter by Ingredients'}/>
              <SubmitField id='submit' value='Filter' style={filterButtonStyle}/>
              <Button id='display-button-style' onClick={() => this.submit({ tags: [], ing: [] }, fRef)}>Display all</Button>
              <Popup
                trigger={<Button id='random-button' icon='random' floated='right' onClick={() => this.randRecipe(this.props.recipes, fRef)}/>}
                content='Surprise me!'
                hideOnScroll
                position='top right'
                style={randButtonStyle}
                inverted
              />
            </Segment>
          </AutoForm>
        </Segment>
        <br/><br/>
        <Card.Group centered itemsPerRow={5}>
          {this.renderCards(recipeMapIng)}
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
  const subscription4 = Meteor.subscribe(Ingredients.userPublicationName);
  const subscription5 = Meteor.subscribe(IngredientRecipe.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready() && subscription2.ready() && subscription3.ready() && subscription4.ready() && subscription5.ready();
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
