import React from 'react';
import { Grid, Segment, Container } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    const hstyle = { textAlign: 'center', color: 'white', fontSize: '50px', padding: '50px' };
    const fontSize = { fontSize: '17px' };
    return (
      <div id="landing-page">
        <Segment id="landingimage">
          <h1 style={hstyle}>Microwavin Manoa</h1>
          <h2 style={hstyle}>Are you a busy, broke college student with no time, no cooking skills, and no energy to cook?</h2>
        </Segment>
        <div>
          <Container>
            <Grid columns='three' divided centered >
              <Grid.Row>
                <Grid.Column style={fontSize}>
                  <h1>About Us</h1>
                  <p>Microwavin Manoa creates a way for students
                    (on-campus or off) to learn and share recipes that can be made using minimal kitchen
                    facilities, can be made out of ingredients that are available within walking distance of
                    UH, and can be filtered via dietary restrictions.</p>
                </Grid.Column>
                <Grid.Column style={fontSize}>
                  <h1>Learn and Share Recipes</h1>
                  <p>Users can upload and search through recipes. Filter or search by tags to find a recipe you like.
                    Each recipe will come with detailed instructions, as well as locations to buy the
                    ingredients and how much it will cost overall. </p>
                </Grid.Column>
                {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
                  <Grid.Column style={fontSize}>
                    <h1>Edit Recipes and Vendors</h1>
                    <p>Admin are able to edit and delete recipes, as well as edit vendor profiles from a list of all
                      available recipes and vendors. Admin are able to view the owner of each recipe.</p>
                  </Grid.Column>
                ) : ''}
                {!Roles.userIsInRole(Meteor.userId(), 'admin') ? (
                  <Grid.Column style={fontSize}>
                    <h1>Get to Microwavin</h1>
                    <p>After finding a recipe, users are able to view vendors nearby that sell that recipe&apos;s ingredients, as well as the price of each ingredient.
                      These recipes can be made with simple equipment that most have on-hand.</p>
                  </Grid.Column>
                ) : ''}
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}
// Declare the types of all properties.
Landing.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const LandingContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(Landing);
export default withRouter(LandingContainer);
