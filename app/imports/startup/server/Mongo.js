import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Contacts } from '../../api/contact/Contacts';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { Recipes } from '../../api/recipe/Recipes';

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

function addIngredient(data) {
  console.log(`  Adding: ${data.name}`);
  Ingredients.collection.insert(data);
}

function addRecipe(data) {
  console.log(`  Adding: ${data.name}`);
  Recipes.collection.insert(data);
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
    console.log('Creating default Ingredient.');
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
