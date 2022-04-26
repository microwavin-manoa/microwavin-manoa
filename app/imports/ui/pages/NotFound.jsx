import React from 'react';
import { Header } from 'semantic-ui-react';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class NotFound extends React.Component {
  render() {
    return (
      <Header as="h1" textAlign="center">
        <br/><br/>
        <p style={{ color: '#4F583D' }}>Page not found</p>
      </Header>
    );
  }
}

export default NotFound;
