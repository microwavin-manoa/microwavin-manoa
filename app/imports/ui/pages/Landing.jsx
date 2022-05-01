import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    const textStyle1 = { color: 'white', fontFamily: 'Merienda', fontSize: 'revert' };
    return (
      <div id="landing-page" style={{ marginBottom: '-50px', marginTop: '-14px' }}>
        <div className='green-background'></div>
        <div id='landing-image'>
          <Grid container centered stackable columns={2} verticalAlign='middle' className='landing-content1'>
            <Grid.Column textAlign='center' style={{ paddingTop: '120px' }}>
              <Header as='h1'>Microwavin<br/>Manoa</Header>
            </Grid.Column>
            <Grid.Column textAlign='center' style={{ paddingTop: '120px' }}>
              <Header as='h1' style={textStyle1}>About Us</Header>
              <Header as='h2'>
                Create and discover recipes made tailor-made for UH Manoa students (on-campus or off)! We focus on recipes that can be made using minimal kitchen facilities (like a microwave!), and ingredients available within walking distance of UH
              </Header>
            </Grid.Column>
          </Grid>
        </div>
        <div className='green-background'></div>
        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
          <div className='plain-background'>
            <Grid container centered stackable columns={2} verticalAlign='middle' className='landing-content2'>
              <Grid.Column textAlign='center'>
                <Image src='images/register.png'/>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h2' style={{ fontSize: '40px' }}>Admins!</Header>
                <Header as='h3'>Edit all recipes and ingredients in the system</Header>
                <Header as='h3'>Add and edit vendors</Header>
                <br/>
                <Image src='images/leafy-divide.png' size='medium' floated='right'/>
              </Grid.Column>
            </Grid>
          </div>
        ) : ''}
        {Meteor.userId() === null ? (
          <div className='plain-background'>
            <Grid container centered stackable columns={2} verticalAlign='middle' className='landing-content2'>
              <Grid.Column textAlign='center'>
                <Image src='images/register.png'/>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h2' style={{ fontSize: '40px' }}>Create an account<br/>and log in</Header>
                <br/>
                <Image src='images/leafy-divide.png' size='medium' floated='right'/>
              </Grid.Column>
            </Grid>
          </div>
        ) : ''}
        <div className='green-background'></div>
        <div className='plain-background' style={{ height: '460px' }}>
          <Grid container centered stackable columns='equal' verticalAlign='middle' className='landing-content2'>
            <Grid.Row>
              <Header as='h2' style={{ paddingTop: '10px' }}>Create recipes, view and edit your own recipes</Header>
            </Grid.Row>
            <Grid.Column textAlign='center'>
              <Image src='images/register.png'/>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Image src='images/register.png'/>
            </Grid.Column>
          </Grid>
        </div>
        <div className='green-background'></div>
        <div id='landing-image2'>
          <Grid container centered stackable columns={2} verticalAlign='middle' className='landing-content1'>
            <Grid.Column textAlign='center'>
              <Header as='h1' style={{ fontSize: '45px' }}>Search and<br/>filter recipes</Header>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Image src='images/register.png'/>
            </Grid.Column>
          </Grid>
        </div>
        <div className='green-background'></div>
        <div className='plain-background' style={{ height: '500px' }}>
          <Grid container centered stackable columns='equal' verticalAlign='middle' className='landing-content2'>
            <Grid.Row>
              <Header as='h2' style={{ paddingTop: '10px' }}>View recipes and vendor information</Header>
            </Grid.Row>
            <Grid.Row>
              <Header as='h2' style={{ fontSize: '15px' }}>Update price data and add new ingredients</Header>
            </Grid.Row>
            <Grid.Column textAlign='center'>
              <Image src='images/register.png'/>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Image src='images/register.png'/>
            </Grid.Column>
          </Grid>
        </div>
        <div className='green-background'></div>
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
