import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Recipe extends React.Component {
  render() {
    return (
      <Card id={'vendor-card-click'} href={`#/vendor/${this.props.vendor._id}`}>
        <Image src={this.props.vendor.imageURL} wrapped ui={false}/>
        <Card.Content>
          <Card.Header>{this.props.vendor.name}</Card.Header>
          <Card.Meta>
            {this.props.vendor.address}
          </Card.Meta>
          <Card.Meta>
            Hours: {this.props.vendor.hours}
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

// Require a recipe to be passed to this component.
Recipe.propTypes = {
  vendor: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Recipe);
