// import { Selector } from 'testcafe';

class RecipeCard {
  async gotoIndividualRecipePage(testController) {
    await testController.click('#individual-recipe-page-button');
  }
}

export const recipeCard = new RecipeCard();
