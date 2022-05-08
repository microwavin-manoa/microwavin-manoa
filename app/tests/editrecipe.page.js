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
    const name = 'Avocado Sandwich';
    const picture = 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2009/4/5/1/BW2D10_28652_s4x3.jpg.rend.hgtvcom.406.305.suffix/1431856622401.jpeg';
    const prepTime = '10 minutes';
    const description = ' Boil an egg and slice it when done. Add the sliced egg and lettuce to the sandwich. Enjoy!';
    const ingredients = Selector('#ingredients');
    const saltOption = ingredients.find('#Salt');
    const lettuceOption = ingredients.find('#Lettuce');
    await this.isDisplayed(testController);
    await testController.selectText('#name').pressKey('delete');
    await testController.typeText('#name', name);
    await testController.selectText('#imageURL').pressKey('delete');
    await testController.typeText('#imageURL', picture);
    await testController.selectText('#prepTime').pressKey('delete');
    await testController.typeText('#prepTime', prepTime);
    await testController.typeText('#description', description);
    await testController.click('#ingredients');
    await testController.click(saltOption);
    await testController.click(lettuceOption);
    await testController.click('#ingredients');
    await testController.click('#submit');
  }

}

export const editRecipe = new EditRecipe();
