import React from 'react';
import { Container } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    // const divStyle = { paddingTop: '15px', position: 'relative', fontSize: '16px', color: '#f5f0e6', minHeight: '25vh' };
    // const footerStyle = { position: 'absolute', width: '100%', backgroundColor: '#ceb793', bottom: '0' };
    return (
      <div>
        <footer className={'footer'}>
          <Container className="center aligned">
            Department of Information and Computer Sciences <br />
            University of Hawaii<br />
            Honolulu, HI 96822 <br />
            <a href="https://microwavin-manoa.github.io/">GitHub Project Page</a>
          </Container>
        </footer>
      </div>
    );
  }
}

export default Footer;
