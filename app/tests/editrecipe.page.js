import { Selector } from 'testcafe';

class EditRecipe {
  constructor() {
    this.pageId = '#edit-recipe-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async editRecipeForm(testController) {
    const name = 'Toast';
    const picture = 'https://www.collinsdictionary.com/images/full/toast_102709511.jpg';
    const prepTime = '2 minutes';
    const description = 'Put a piece of bread in the toaster. (Bonus: Have it with whatever you like!)';
    const ingredients = Selector('#ingredients');
    const avocadoOption = ingredients.find('#Avocado');
    await this.isDisplayed(testController);
    await testController.selectText('#name').pressKey('delete');
    await testController.typeText('#name', name);
    await testController.selectText('#imageURL').pressKey('delete');
    await testController.typeText('#imageURL', picture);
    await testController.selectText('#prepTime').pressKey('delete');
    await testController.typeText('#prepTime', prepTime);
    await testController.selectText('#description').pressKey('delete');
    await testController.typeText('#description', description);
    await testController.click(ingredients);
    await testController.click(avocadoOption);
    await testController.click('#submit');
  }

}

export const editRecipe = new EditRecipe();
