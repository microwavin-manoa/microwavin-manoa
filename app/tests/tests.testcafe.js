import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { adminPage } from './adminpage.page';
import { recipePage } from './recipe.page';
import { editRecipe } from './editrecipe.page';
import { addVendorPage } from './addvendor.page';
import { editVendorPage } from './editvendor.page';
import { addRecipePage } from './addrecipe.page';
import { searchRecipePage } from './searchrecipe.page';
import { allVendorsPage } from './allvendors.page';
import { myRecipesPage } from './myrecipes.page';
import { vendorProfilePage } from './vendorprofile.page';
import { recipeCard } from './recipecard.component';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const addRecipe = { name: 'Egg', imageURL: '/egg.jpeg', prepTime: '2 minutes', serving: '5 servings', description: 'Boil egg.' };

fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  // await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that Admin Page shows up', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  // await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that Admin Page shows up', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
});

test('Test that Edit Recipe in Admin shows up', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.gotoEditRecipePage(testController);
  await editRecipe.isDisplayed(testController);
});

test('Test that Edit Recipe shows up for user', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoMyRecipesPage(testController);
  await myRecipesPage.isDisplayed(testController);
  await myRecipesPage.gotoEditRecipe(testController);
  await editRecipe.isDisplayed(testController);
});

test('Test that Add Vendor in Admin shows up', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.gotoAddVendorPage(testController);
  await addVendorPage.isDisplayed(testController);
});

test('Test that Edit Vendor in Admin shows up', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.gotoEditVendorPage(testController);
  await editVendorPage.isDisplayed(testController);
});

test('Test that Add Recipe shows up for users', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAddRecipePage(testController);
  await addRecipePage.isDisplayed(testController);
});

test('Test that Search Recipe shows up for users', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoSearchRecipePage(testController);
  await searchRecipePage.isDisplayed(testController);
});

test('Test that Vendors Page shows up for users', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoVendorsPage(testController);
  await allVendorsPage.isDisplayed(testController);
});

test('Test that Vendors Profile Page shows up for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoVendorsPage(testController);
  await allVendorsPage.isDisplayed(testController);
  await allVendorsPage.gotoIndivVendor(testController);
  await vendorProfilePage.isDisplayed(testController);
});

test('Test that Vendors Profile Page shows up for users', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoVendorsPage(testController);
  await allVendorsPage.isDisplayed(testController);
  await allVendorsPage.gotoIndivVendor(testController);
  await vendorProfilePage.isDisplayed(testController);
});

test('Test that MyRecipe Page shows up for users', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoMyRecipesPage(testController);
  await myRecipesPage.isDisplayed(testController);
});

test('Test that Add Recipe shows up for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAddRecipePage(testController);
  await addRecipePage.isDisplayed(testController);
});

test('Test that Search Recipe shows up for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoSearchRecipePage(testController);
  await searchRecipePage.isDisplayed(testController);
});

test('Test that Vendors Page shows up for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoVendorsPage(testController);
  await allVendorsPage.isDisplayed(testController);
});

test('Test that MyRecipe Page shows up for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoMyRecipesPage(testController);
  await myRecipesPage.isDisplayed(testController);
});

test('Test that Add Recipe works for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAddRecipePage(testController);
  await addRecipePage.enterRecipe(testController, addRecipe.name, addRecipe.imageURL, addRecipe.prepTime, addRecipe.ingredients, addRecipe.serving, addRecipe.tags, addRecipe.description );
});

test('Test that Individual Recipe Page shows up from Search Recipes for users', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoSearchRecipePage(testController);
  await recipeCard.gotoIndividualRecipePage(testController);
  await recipePage.isDisplayed(testController);
});

test('Test that Individual Recipe Page from Search Recipes shows up for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoSearchRecipePage(testController);
  await recipeCard.gotoIndividualRecipePage(testController);
  await recipePage.isDisplayed(testController);
});

// in progress
// test('Test that Add Vendor works', async (testController) => {
//   await navBar.gotoSigninPage(testController);
//   await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
//   await navBar.gotoAdminPage(testController);
//   await adminPage.isDisplayed(testController);
//   // await navBar.gotoAddRecipePage(testController);
//   // await addRecipePage.enterRecipe(testController, addRecipe.name, addRecipe.imageURL, addRecipe.prepTime, addRecipe.ingredients, addRecipe.serving, addRecipe.tags, addRecipe.description);
// });
