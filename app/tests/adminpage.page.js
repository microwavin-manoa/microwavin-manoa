import { Selector } from 'testcafe';

class AdminPage {
  constructor() {
    this.pageId = '#admin-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  /** Goes to Edit Recipe Page */
  async gotoEditRecipePage(testController) {
    await testController.click('#edit-recipe-button-admin');
  }

  /** Goes to Add Vendor Page */
  async gotoAddVendorPage(testController) {
    await testController.click('#add-vendor-button');
  }

  /** Goes to Edit Vendor Page */
  async gotoEditVendorPage(testController) {
    await testController.click('#edit-vendor-button');
  }
}

export const adminPage = new AdminPage();
