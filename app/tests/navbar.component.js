import { Selector } from 'testcafe';

class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#logout-button').exists;
    if (loggedInUser) {
      await testController.click('#logout-button');
      await testController.click('#logout-button');
    }
  }

  async gotoSigninPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-button');
    await testController.click('#login-button');
  }

  async gotoAdminPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#admin-button');
  }

  async gotoAddRecipePage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#add-recipe-button');
  }

  async gotoSearchRecipePage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#search-recipe-button');
  }

  async gotoVendorsPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#vendors-page-button');
  }

  async gotoMyRecipesPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#my-recipes-page-button');
  }

  /** Check that the specified user is currently logged in.
  async isLoggedIn(testController, username) {
    const loggedInUser = Selector('#navbar-current-user').innerText;
    await testController.expect(loggedInUser).eql(username);
  } */

  /** Check that someone is logged in, then click items to logout. */
  async logout(testController) {
    await testController.expect(Selector('#logout-button').exists).ok();
    await testController.click('#logout-button');
    await testController.click('#logout-button');
  }

  /** Pull down login menu, go to sign up page. */
  async gotoSignupPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
  }
}

export const navBar = new NavBar();
