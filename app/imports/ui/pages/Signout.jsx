import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Image } from 'semantic-ui-react';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
      <div id="signout-page">
        <br/><br/>
        <Header as="h2" textAlign="center">
          <p>You are signed out</p>
        </Header>
        <Image centered size={'medium'} src={'images/leaf-break.png'} style={{ marginTop: '-5px', marginBottom: '-10px' }}/>
        <Header as="h2" textAlign="center">
          <p>Thanks for visiting!</p>
        </Header>
      </div>
    );
  }
}
