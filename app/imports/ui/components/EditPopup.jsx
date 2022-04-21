import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import EditIngredientVendor from './EditIngredientVendor';

class EditPopup extends React.Component {
  state = {};

  handleClick = () => this.setState((prevState) => ({ active: !prevState.active }));

  render() {
    const { active } = this.state;

    return (
      <Popup onOpen={this.handleClick} onClose={this.handleClick}
        content={
          <EditIngredientVendor ing={this.props.ing} vendorName={this.props.vendorName}/>
        }
        on='click'
        position={'bottom center'}
        trigger={<Button floated={'right'} size={'tiny'} compact toggle active={active}>Edit</Button>}
      />
    );
  }
}

// Require a document to be passed to this component.
EditPopup.propTypes = {
  ing: PropTypes.object,
  vendorName: PropTypes.string,
};

export default EditPopup;
