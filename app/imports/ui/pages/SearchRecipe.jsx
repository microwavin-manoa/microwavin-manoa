import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Contact from '../components/Contact';
import { Contacts } from '../../api/contact/Contacts';

const options = [
  { key: 'Vegan', text: 'Vegan', value: 'Vegan' },
  { key: 'Gluten-Free', text: 'Gluten-Free', value: 'Gluten-Free' },
  { key: 'No Peanuts', text: 'No Peanuts', value: 'No Peanuts' },
  { key: '10 Minute Recipe', text: '10 Minute Recipe', value: '10 Minute Recipe' },
];

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class SearchRecipe extends React.Component {
  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the page once subscriptions have been received.
  renderPage() {
    return (
      <Container>
        <Dropdown placeholder='Skills' fluid multiple selection options={options} />
        <Header as="h2" textAlign="center" inverted>List Contacts</Header>
        <Card.Group centered>
          {this.props.contacts.map((contact, index) => <Contact key={index} contact={contact}/>)}
        </Card.Group>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
SearchRecipe.propTypes = {
  contacts: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Contacts.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const contacts = Contacts.collection.find({}).fetch();
  return {
    contacts,
    ready,
  };
})(SearchRecipe);
