import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';

class DeleteIngredientModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  removeItem(ivp) {
    console.log(ivp);
    this.setState({ open: false });
    IngredientVendorPrice.collection.remove(ivp._id);
    // if the same ingredient, different vendor is not in IngredientVendorPrice, need to delete from Ingredients and IngredientRecipe Collections
    const repeatIng = IngredientVendorPrice.collection.find({ ingredientId: ivp.ingredientId }).fetch();
    if (repeatIng.length === 0) {
      const toRemove = IngredientRecipe.collection.find({ ingredientID: ivp.ingredientId }).fetch();
      toRemove.map(item => IngredientRecipe.collection.remove(item._id));
      Ingredients.collection.remove(ivp.ingredientId);
    }
  }

  render() {
    return (
      <Modal
        basic
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        size='small'
        trigger={<Button size='big' icon='trash' id='edit-button-style'/>}
      >
        <Header icon size='large'>
          <Icon name='trash' />
          Delete Ingredient
        </Header>
        <Modal.Content>
          <p style={{ textAlign: 'center' }}>Are you sure you want to delete this ingredient for good?</p>
          <p style={{ textAlign: 'center', fontSize: '20px' }}>{this.props.ivp.ingredient}</p>
        </Modal.Content>
        <Modal.Actions style={{ textAlign: 'center' }}>
          <Button basic color='green' inverted onClick={() => this.setState({ open: false })}>
            <Icon name='remove' /> No, go back
          </Button>
          <Button color='red' inverted onClick={() => this.removeItem(this.props.ivp)}>
            <Icon name='checkmark' /> Yes, delete
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

DeleteIngredientModal.propTypes = {
  ivp: PropTypes.object.isRequired,
};

export default DeleteIngredientModal;
