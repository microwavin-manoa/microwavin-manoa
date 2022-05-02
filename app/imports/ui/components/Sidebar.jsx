import React from 'react';
import { Icon, Menu, Segment } from 'semantic-ui-react';
import { HashLink as Link } from 'react-router-hash-link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class AdminSidebar extends React.Component {
  render() {
    const sidebarStyle = { backgroundColor: '#F5EACF', color: '#f5f0e6', position: 'fixed', width: '150px', zIndex: '1', left: 0 };
    return (
      <Segment
        as={Menu}
        vertical
        visible
        left
        style= {sidebarStyle}
      >
        <Menu.Item as={Link} to={'/admin#recipeHeader'}>
          <Icon name='food' />
            List of Recipes
        </Menu.Item>
        <Menu.Item as={Link} to={'/admin#vendorHeader'}>
          <Icon name='shop' />
            List of Vendors
        </Menu.Item>
      </Segment>
    );
  }
}

export default AdminSidebar;
