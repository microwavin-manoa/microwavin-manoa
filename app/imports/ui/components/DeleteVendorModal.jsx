import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Vendors } from '../../api/vendor/Vendors';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

class DeleteVendorModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  removeItem(docID) {
    this.setState({ open: false });
    const vendor = Vendors.collection.findOne({ _id: docID }).name;
    const toRemove = IngredientVendorPrice.collection.find({ vendor: vendor }).fetch();
    toRemove.map(item => IngredientVendorPrice.collection.remove(item._id));
    Vendors.collection.remove(docID);
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
          Delete Vendor
        </Header>
        <Modal.Content>
          <p style={{ textAlign: 'center' }}>Are you sure you want to delete this vendor for good?</p>
          <p style={{ textAlign: 'center', fontSize: '20px' }}>{this.props.vendor.name}</p>
        </Modal.Content>
        <Modal.Actions style={{ textAlign: 'center' }}>
          <Button basic color='green' inverted onClick={() => this.setState({ open: false })}>
            <Icon name='remove' /> No, go back
          </Button>
          <Button color='red' inverted onClick={() => this.removeItem(this.props.vendor._id)}>
            <Icon name='checkmark' /> Yes, delete
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

DeleteVendorModal.propTypes = {
  vendor: PropTypes.object.isRequired,
};

export default DeleteVendorModal;
