import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import EditIngredientVendor from './EditIngredientVendor';

class EditPopup extends React.Component {
  state = {};

  handleClick = () => this.setState((prevState) => ({ active: !prevState.active }));

  render() {

    return (
      <Popup onOpen={this.handleClick} onClose={this.handleClick}
        content={
          <EditIngredientVendor ing={this.props.ing} vendorName={this.props.vendorName}/>
        }
        on='click'
        position={'bottom center'}
        trigger={<Button size='small' icon='edit' id='edit-button-style' style={{ padding: '4px', float: 'right' }}/>}
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
