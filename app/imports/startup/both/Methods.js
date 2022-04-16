import { Meteor } from 'meteor/meteor';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';

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
    if (vendor && price) {
      Ingredients.collection.insert({ name });
      const ingredientID = Ingredients.collection.findOne({ name: name })._id;
      IngredientVendorPrice.collection.insert({ ingredient: name, ingredientId: ingredientID, vendor: vendor, price: price });
    } else {
      throw new Meteor.Error('A vendor and price must be entered!');
    }
  },
});

export { addIngredientMethod };
