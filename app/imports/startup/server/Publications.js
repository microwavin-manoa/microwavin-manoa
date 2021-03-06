import { Meteor } from 'meteor/meteor';
// import { Roles } from 'meteor/alanning:roles';
// import { Stuffs } from '../../api/stuff/Stuff';
// import { Contacts } from '../../api/contact/Contacts';
import { Ingredients } from '../../api/ingredient/Ingredient';
import { Recipes } from '../../api/recipe/Recipes';
import { Vendors } from '../../api/vendor/Vendors';
import { IngredientVendorPrice } from '../../api/ingredient/IngredientVendorPrice';
import { IngredientRecipe } from '../../api/ingredient/IngredientRecipe';
import { TagRecipe } from '../../api/tag/TagRecipe';
import { Tags } from '../../api/tag/Tags';

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise publish nothing.
// Meteor.publish(Stuffs.userPublicationName, function () {
//   if (this.userId) {
//     const username = Meteor.users.findOne(this.userId).username;
//     return Stuffs.collection.find({ owner: username });
//   }
//   return this.ready();
// });
//
// Meteor.publish(Contacts.userPublicationName, function () {
//   if (this.userId) {
//     const username = Meteor.users.findOne(this.userId).username;
//     return Contacts.collection.find({ owner: username });
//   }
//   return this.ready();// if users isnt logged in, publication does nothing
// });

Meteor.publish(Ingredients.userPublicationName, function () {
  if (this.userId) {
    return Ingredients.collection.find();
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

Meteor.publish(Tags.userPublicationName, function () {
  if (this.userId) {
    return Tags.collection.find();
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

// so users can only access their own recipes on myrecipes and editrecipe
Meteor.publish(Recipes.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Recipes.collection.find({ owner: username });
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

// for when all the recipes need to be seen (no admin needed)
Meteor.publish(Recipes.adminPublicationName, function () {
  if (this.userId) {
    return Recipes.collection.find();
  }
  return this.ready();
});

Meteor.publish(Vendors.userPublicationName, function () {
  if (this.userId) {
    return Vendors.collection.find();
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

Meteor.publish(IngredientVendorPrice.userPublicationName, function () {
  if (this.userId) {
    return IngredientVendorPrice.collection.find();
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

Meteor.publish(IngredientRecipe.userPublicationName, function () {
  if (this.userId) {
    return IngredientRecipe.collection.find();
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

Meteor.publish(TagRecipe.userPublicationName, function () {
  if (this.userId) {
    return TagRecipe.collection.find();
  }
  return this.ready();// if users isnt logged in, publication does nothing
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise publish nothing.
// Meteor.publish(Stuffs.adminPublicationName, function () {
//   if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
//     return Stuffs.collection.find();
//   }
//   return this.ready();
// });
//
// Meteor.publish(Contacts.adminPublicationName, function () {
//   if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
//     return Contacts.collection.find();
//   }
//   return this.ready();
// });

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
