import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Segment, Icon, Button, ButtonOr } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = { marginBottom: '10px' };
    const headerFont = { fontSize: '16px' };
    const signinButton = { backgroundColor: '#85865f', color: '#f5f0e6' };
    const signupButton = { backgroundColor: '#4f583d', color: '#f5f0e6' };
    const font = { color: '#f5f0e6' };
    const headerColor = { color: '#4f583d' };
    return (
      <Segment id={'navbar'}>
        <Menu inverted style={menuStyle} attached="top" borderless pointing secondary>
          <Menu.Item as={NavLink} activeClassName="" exact to="/" style={{ height: '43px' }}>
            <Header as='h1' style={headerColor}>Microwavin Manoa</Header>
          </Menu.Item>
          {this.props.currentUser ? (
            [<Menu.Item id="add-recipe-button" as={NavLink} style={headerFont} activeClassName="active" exact to="/add" key='add'><Icon name='add'/>Add Recipe</Menu.Item>,
              <Menu.Item id="search-recipe-button" as={NavLink} style={headerFont} activeClassName="active" exact to="/search" key='search'><Icon name='search'/>Search Recipe</Menu.Item>,
              <Menu.Item id="vendors-page-button" as={NavLink} style={headerFont} activeClassName="active" exact to="/vendors" key='vendors'><Icon name='tags'/>Vendors</Menu.Item>,
              <Menu.Item id="my-recipes-page-button" as={NavLink} style={headerFont} activeClassName="active" exact to="/myrecipes" key='myrecipes'><Icon name='like'/>My Recipes</Menu.Item>,
            ]
          ) : ''}
          {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <Menu.Item id={'admin-button'} as={NavLink} style={headerFont} activeClassName="active" exact to="/admin" key='admin'><Icon name='wrench'/>Admin</Menu.Item>
          ) : ''}
          <Menu.Item position="right">
            {this.props.currentUser === '' ? (
              <Button.Group>
                <Button animated='vertical' style={signupButton}>
                  <Button.Content style={font} hidden as={NavLink} exact to="/signup"><Icon name='signup'/></Button.Content>
                  <Button.Content visible>
                    Sign Up!
                  </Button.Content>
                </Button>
                <ButtonOr/>
                <Button id="login-button" animated='vertical' style={signinButton}>
                  <Button.Content style={font} inverted hidden as={NavLink} exact to="/signin"><Icon name='sign-in'/></Button.Content>
                  <Button.Content visible>
                    Sign In!
                  </Button.Content>
                </Button>
              </Button.Group>
            ) : (
              <Button id="logout-button" animated='vertical' style={signinButton}>
                <Button.Content style={font} inverted hidden as={NavLink} exact to="/signout">Sign Out</Button.Content>
                <Button.Content visible>
                  <Icon name='sign-out'/>
                </Button.Content>
              </Button>
            )}
          </Menu.Item>
        </Menu>
      </Segment>
    );
  }
}

// Declare the types of all properties.
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(NavBarContainer);
