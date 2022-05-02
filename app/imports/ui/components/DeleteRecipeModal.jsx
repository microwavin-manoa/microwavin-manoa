import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Recipes } from '../../api/recipe/Recipes';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { TagRecipe } from '../../api/tag/TagRecipe';

class DeleteRecipeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  removeItem(docID) {
    this.setState({ open: false });
    console.log(`item removed: ${docID}`);
    Recipes.collection.remove(docID);
    let toRemove = IngredientRecipe.collection.find({ recipeID: docID }).fetch();
    console.log(toRemove);
    toRemove.map((item) => IngredientRecipe.collection.remove(item._id));
    toRemove = TagRecipe.collection.find({ recipeID: docID }).fetch();
    console.log(toRemove);
    toRemove.map((item) => TagRecipe.collection.remove(item._id));
  }

  render() {

    return (
      <Modal
        basic
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        size='small'
        trigger={<Button icon='trash'/>}
      >
        <Header icon size='large'>
          <Icon name='trash' />
          Delete Recipe
        </Header>
        <Modal.Content>
          <p style={{ textAlign: 'center' }}>Are you sure you want to delete this recipe for good?</p>
          <p style={{ textAlign: 'center', fontSize: '20px' }}>{this.props.recipe.name}</p>
        </Modal.Content>
        <Modal.Actions style={{ textAlign: 'center' }}>
          <Button basic color='green' inverted onClick={() => this.setState({ open: false })}>
            <Icon name='remove' /> No, go back
          </Button>
          <Button color='red' inverted onClick={() => this.removeItem(this.props.recipe._id)}>
            <Icon name='checkmark' /> Yes, delete
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

DeleteRecipeModal.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default DeleteRecipeModal;
