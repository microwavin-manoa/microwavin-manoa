import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Recipes } from '../../api/recipe/Recipes';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { Tags } from '../../api/tag/Tags';
import { Vendors } from '../../api/vendor/Vendors';

/**
 * In Bowfolios, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Note that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

const addIngredientMethod = 'Ingredients.add';

/** Creates a new ingredient in the Ingredients collection, and also updates IngredientVendorPrice. */
Meteor.methods({
  'Ingredients.add'({ name, vendor, price }) {
    // check if ingredient exists
    if (Ingredients.collection.find({ name }).count() > 0) {
      const ingredientID = Ingredients.collection.findOne({ name })._id;
      // get all existing vendors tied to this ingredient
      const ingVendor = _.pluck(IngredientVendorPrice.collection.find({ ingredientId: ingredientID }).fetch(), 'vendor');
      // if the vendor you want to add is not there, you can add it
      if (!ingVendor.includes(vendor)) {
        IngredientVendorPrice.collection.insert({ ingredient: name, ingredientId: ingredientID, vendor: vendor, price: price });
      } else {
        // otherwise, can't add
        throw new Meteor.Error('Ingredient already exists for this vendor!');
      }
    } else {
      // insert new ingredient to Ingredients collection
      Ingredients.collection.insert({ name });
      const ingredientID = Ingredients.collection.findOne({ name: name })._id;
      // insert to IngredientVendorPrice
      IngredientVendorPrice.collection.insert({ ingredient: name, ingredientId: ingredientID, vendor: vendor, price: price });
    }
  },
});

const updateIngredientMethod = 'Ingredients.update';

/** Creates a new ingredient in the Ingredients collection, and also updates IngredientVendorPrice. */
Meteor.methods({
  'Ingredients.update'({ name, vendor, price }) {
    const ingredientId = Ingredients.collection.findOne({ name })._id;
    IngredientVendorPrice.collection.update({ ingredient: name, vendor }, { $set: { name, vendor, price, ingredientId } });
  },
});

const addRecipeMethod = 'Recipes.add';

/** Creates a new recipe in the Recipes collection, and also updates IngredientRecipe and TagRecipe. */
Meteor.methods({
  'Recipes.add'({ name, imageURL, prepTime, servingSize, ingredients, tags, description }) {
    if (ingredients && ingredients.length > 0) {
      const owner = Meteor.user().username;
      // insert to Recipes Collection
      Recipes.collection.insert({ name: name, imageURL: imageURL, prepTime: prepTime, servingSize: servingSize, owner: owner, description: description });
      const recipeID = Recipes.collection.findOne({ name: name })._id;
      // insert to IngredientRecipe Collection
      ingredients.map(ingredient => IngredientRecipe.collection.insert({ ingredientID: Ingredients.collection.findOne({ name: ingredient })._id, recipeID: recipeID }));
      if (tags && tags.length > 0) {
        // insert to TagRecipe Collection
        tags.map(tag => TagRecipe.collection.insert({ tagID: Tags.collection.findOne({ name: tag })._id, recipeID: recipeID }));
      }
    } else {
      throw new Meteor.Error('Must enter at least one ingredient!');
    }
  },
});

const updateRecipeMethod = 'Recipes.update';

/** Updates Recipe data in Recipes collection along with IngredientRecipe and TagRecipe. */
Meteor.methods({
  'Recipes.update'({ name, imageURL, prepTime, servingSize, ingredients, tags, description, owner, oldName }) {
    if (ingredients && ingredients.length > 0) {
      // update Recipe Collection
      Recipes.collection.update({ name: oldName }, { $set: { name, imageURL, prepTime, servingSize, description, owner } });
      const recipeID = Recipes.collection.findOne({ name })._id;
      // remove all associated ingredients and insert new ingredients to IngredientRecipe
      IngredientRecipe.collection.remove({ recipeID });
      ingredients.map(ingredient => IngredientRecipe.collection.insert({ ingredientID: Ingredients.collection.findOne({ name: ingredient })._id, recipeID }));
      // remove tags now in case we update to zero tags
      TagRecipe.collection.remove({ recipeID });
      if (tags && tags.length > 0) {
        // insert new tags to TagRecipe
        tags.map(tag => TagRecipe.collection.insert({ tagID: Tags.collection.findOne({ name: tag })._id, recipeID }));
      }
    } else {
      throw new Meteor.Error('Must enter at least one ingredient!');
    }
  },
});

const updateVendorMethod = 'Vendors.update';

/** Updates Recipe data in Recipes collection along with IngredientRecipe and TagRecipe. */
Meteor.methods({
  'Vendors.update'({ name, oldName, address, hours, imageURL }) {
    // update Vendors collection
    Vendors.collection.update({ name: oldName }, { $set: { name, address, hours, imageURL } });
    // update IngredientVendorPrice collection if vendor name changed
    if (name !== oldName) {
      const allIVP = IngredientVendorPrice.collection.find({ vendor: oldName }).fetch();
      for (let i = 0; i < allIVP.length; i++) {
        const { ingredient, ingredientId, price } = allIVP[i];
        console.log(ingredient, ingredientId, price);
        IngredientVendorPrice.collection.update({ vendor: oldName }, { $set: { ingredient, ingredientId, vendor: name, price } });
      }
    }
  },
});

export { addIngredientMethod, addRecipeMethod, updateRecipeMethod, updateIngredientMethod, updateVendorMethod };
