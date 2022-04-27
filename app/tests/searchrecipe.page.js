import { Selector } from 'testcafe';

class SearchRecipePage {
  constructor() {
    this.pageId = '#search-recipe-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(30000).expect(this.pageSelector.exists).ok();
  }

  async isFiltering(testController) {
    await this.isDisplayed(testController);
    const tagsSelection = Selector('#tags');
    const glutenfreeOption = tagsSelection.find('#Gluten-Free');
    await testController.click('#tags');
    await testController.click(glutenfreeOption);
    await testController.click('#tags');
    await testController.click('#submit');
  }
}

export const searchRecipePage = new SearchRecipePage();
