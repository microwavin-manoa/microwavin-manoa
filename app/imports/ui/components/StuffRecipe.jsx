import React from 'react';
import { Table, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class StuffRecipe extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.recipe.name}</Table.Cell>
        <Table.Cell><Image size = 'small' src={this.props.recipe.imageURL}/></Table.Cell>
        <Table.Cell>{this.props.recipe.description}</Table.Cell>
        <Table.Cell>
          <Link to={`/editrecipe/${this.props.recipe._id}`}>Edit</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(StuffRecipe);
