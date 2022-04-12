import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
      <div id='landing-page' container>
        <Grid verticalAlign='middle' textAlign='center'>
          <Grid.Column width={5}>
            <Image size='huge' rounded src="/images/food.jpg" alt="Picture of food on table"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Microwavin Manoa</h1>
            <p><b>Are you a busy, broke college student with no time, no cooking skills, and no energy to cook?</b></p>
            <p>Microwavin Manoa has got you covered! Microwavin Manoa creates a way for students
              (on-campus or off) to learn and share recipes that can be made using minimal kitchen
              facilities, can be made out of ingredients that are available within walking distance of
              UH, and can be filtered via dietary restrictions.</p>
            <p>Each recipe will come with detailed instructions, as well as locations to buy the
              ingredients and how much it will cost overall.</p>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Landing;
