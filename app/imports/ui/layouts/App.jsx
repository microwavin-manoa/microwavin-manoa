import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import SearchRecipe from '../pages/SearchRecipe';
import AdminPage from '../pages/AdminPage';
import EditRecipe from '../pages/EditRecipe';
import EditVendor from '../pages/EditVendor';
import EditIngredient from '../pages/EditIngredient';
import MyRecipes from '../pages/MyRecipes';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import AddRecipe from '../pages/AddRecipe';
import AllVendors from '../pages/AllVendors';
import AddVendor from '../pages/AddVendor';
import VendorProfile from '../pages/VendorProfile';
import Recipe from '../pages/Recipe';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <NavBar/>
          <div style={{ flex: '1' }}>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route path="/signout" component={Signout}/>
              <ProtectedRoute path="/search" component={SearchRecipe}/>
              <ProtectedRoute path="/vendors" component={AllVendors}/>
              <ProtectedRoute path="/add" component={AddRecipe}/>
              <ProtectedRoute path="/myrecipes" component={MyRecipes}/>
              <ProtectedRoute path="/editrecipe/:_id" component={EditRecipe}/>
              <ProtectedRoute path="/editvendor/:_id" component={EditVendor}/>
              <ProtectedRoute path="/editingredient/:_id" component={EditIngredient}/>
              <ProtectedRoute path="/recipe/:_id" component={Recipe}/>
              <ProtectedRoute path="/vendor/:_id" component={VendorProfile}/>
              <AdminProtectedRoute path="/admin" component={AdminPage}/>
              <AdminProtectedRoute path="/addvendor" component={AddVendor}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
          <Footer/>
        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;
