import { Selector } from 'testcafe';

class AddRecipePage {
  constructor() {
    this.pageId = '#add-recipe-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(60000).expect(this.pageSelector.exists).ok();
  }

  async enterRecipe(testController, name, imageURL, prepTime, serving, description) {
    await testController.typeText('#addrecipe-form-name', name);
    await testController.typeText('#addrecipe-form-imageURL', imageURL);
    await testController.typeText('#addrecipe-form-prep', prepTime);
    await testController.typeText('#addrecipe-form-serving', serving);

    const ingredientsSelector = Selector('#addrecipe-form-ingredients');
    const eggOption = ingredientsSelector.find('#Egg');
    await testController.click('#addrecipe-form-ingredients');
    await testController.click(eggOption);
    await testController.click('#addrecipe-form-serving');

    const tagsSelector = Selector('#addrecipe-form-tags');
    const mugOption = tagsSelector().find('#Mug');
    await testController.click('#addrecipe-form-tags');
    await testController.click(mugOption);
    await testController.click('#addrecipe-form-serving');

    await testController.typeText('#addrecipe-form-description', description);
    await testController.click('#addrecipe-form-submit');
  }
}

export const addRecipePage = new AddRecipePage();
