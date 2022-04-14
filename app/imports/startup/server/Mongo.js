import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Contacts } from '../../api/contact/Contacts';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { Recipes } from '../../api/recipe/Recipes';
import { Vendors } from '../../api/vendor/Vendors';

/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
}

function addContact(data) {
  console.log(`  Adding: ${data.lastName} (${data.owner})`);
  Contacts.collection.insert(data);
}

// to be changed
function addIngredient({ name, vendor, price }) {
  console.log(`  Defining ingredient: ${name}`);
  Ingredients.collection.insert({ name: name });
  const nameId = Ingredients.collection.findOne({ name: name })._id;
  IngredientVendorPrice.collection.insert({ ingredient: name, ingredientId: nameId, vendor: vendor, price: price });
}

// to be changed
function addRecipe({ name, imageURL, prepTime, servingSize, ingredients, description }) {
  console.log(`  Adding: ${name}`);
  Recipes.collection.insert({ name: name, imageURL: imageURL, prepTime: prepTime, servingSize: servingSize, description: description });
  const recipeId = Recipes.collection.findOne({ name: name })._id;
  ingredients.map(ingredient => IngredientRecipe.collection.insert({ ingredientID: ingredient._id, recipeID: recipeId }));
}

function addVendor(data) {
  console.log(`  Adding: ${data.name}`);
  Vendors.collection.insert(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}
// Initialize the ContactCollection if empty.
if (Contacts.collection.find().count() === 0) {
  if (Meteor.settings.defaultContacts) {
    console.log('Creating default contact.');
    Meteor.settings.defaultContacts.map(data => addContact(data));
  }
}

if (Ingredients.collection.find().count() === 0) {
  if (Meteor.settings.defaultIngredients) {
    console.log('Creating default Ingredients.');
    Meteor.settings.defaultIngredients.map(data => addIngredient(data));
  }
}
if (Recipes.collection.find().count() === 0) {
  if (Meteor.settings.defaultRecipes) {
    console.log('Creating default Recipes.');
    Meteor.settings.defaultRecipes.map(data => addRecipe(data));
  }
}
if (Vendors.collection.find().count() === 0) {
  if (Meteor.settings.defaultVendors) {
    console.log('Creating default Vendors.');
    Meteor.settings.defaultVendors.map(data => addVendor(data));
  }
}
