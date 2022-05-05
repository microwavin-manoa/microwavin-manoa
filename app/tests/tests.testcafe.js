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

test.only('Test that signin and signout work', async (testController) => {
  await landingPage.isDisplayed(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  // await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

// Testing pages for users
test('Test that All Pages shows up for users', async (testController) => {
  // Check if LandingPage is displayed
  await landingPage.isDisplayed(testController);
  // Check if SignInPage is displayed and able to sign in
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  // Check if AddRecipePage is displayed
  await navBar.gotoAddRecipePage(testController);
  await addRecipePage.isDisplayed(testController);
  // Check if SearchRecipePage is displayed
  await navBar.gotoSearchRecipePage(testController);
  await searchRecipePage.isDisplayed(testController);
  // Check if IndividualRecipePage is displayed
  await recipeCard.gotoIndividualRecipePage(testController);
  await recipePage.isDisplayed(testController);
  // Check if MyRecipesPage is displayed
  await navBar.gotoMyRecipesPage(testController);
  await myRecipesPage.isDisplayed(testController);
  // Check if EditRecipes is displayed
  await myRecipesPage.gotoEditRecipe(testController);
  await editRecipe.isDisplayed(testController);
  // Check if VendorsPage is displayed
  await navBar.gotoVendorsPage(testController);
  await allVendorsPage.isDisplayed(testController);
  // Check if VendorProfilePage is displayed
  await allVendorsPage.gotoIndivVendor(testController);
  await vendorProfilePage.isDisplayed(testController);
  // Check if Log out works
  await navBar.logout(testController);
});

// Testing pages for Admin
test('Test that all pages show up for Admin', async (testController) => {
  // Check if LandingPage is displayed
  await landingPage.isDisplayed(testController);
  await navBar.gotoSigninPage(testController);
  // Check if SignInPage is displayed and able to sign in
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  // Check if AdminPage is displayed
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  // Check if EditRecipe is displayed from Admin page
  await adminPage.gotoEditRecipePage(testController);
  await editRecipe.isDisplayed(testController);
  // Check if AddVendorPage is displayed from Admin page
  await navBar.gotoAdminPage(testController);
  await adminPage.gotoAddVendorPage(testController);
  await addVendorPage.isDisplayed(testController);
  // Check if EditVendorPage is displayed from Admin page
  await navBar.gotoAdminPage(testController);
  await adminPage.gotoEditVendorPage(testController);
  await editVendorPage.isDisplayed(testController);
  // Check if AllVendorsPage is displayed
  await navBar.gotoVendorsPage(testController);
  await allVendorsPage.isDisplayed(testController);
  await allVendorsPage.gotoIndivVendor(testController);
  await vendorProfilePage.isDisplayed(testController);
  // Check if AddRecipePage is displayed
  await navBar.gotoAddRecipePage(testController);
  await addRecipePage.isDisplayed(testController);
  // Check if SearchRecipePage is displayed
  await navBar.gotoSearchRecipePage(testController);
  await searchRecipePage.isDisplayed(testController);
  // Check if IndividualRecipePage is displayed
  await recipeCard.gotoIndividualRecipePage(testController);
  await recipePage.isDisplayed(testController);
  // Check if MyRecipePage is displayed
  await navBar.gotoMyRecipesPage(testController);
  await myRecipesPage.isDisplayed(testController);
  await navBar.logout(testController);
});

// Testing functionality of forms
test('Test that Add Vendor works for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAddRecipePage(testController);
  await addRecipePage.enterRecipe(testController, addRecipe.name, addRecipe.imageURL, addRecipe.prepTime, addRecipe.ingredients, addRecipe.serving, addRecipe.tags, addRecipe.description);
  await navBar.logout(testController);
});

test('Test that filter for Search Recipes form works for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoSearchRecipePage(testController);
  await searchRecipePage.isFiltering(testController);
  await navBar.logout(testController);
});

test('Test that Edit Recipes form works for admin', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoMyRecipesPage(testController);
  await myRecipesPage.gotoEditRecipe(testController);
  await editRecipe.editRecipeForm(testController);
  await navBar.logout(testController);
});
