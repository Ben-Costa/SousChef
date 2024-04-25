//Export the class from file A, e.g. export class Employee {}.
//Import the class in file B as import {Employee} from './another-file.js'.

import  User  from "../dataObjects/user.js"
import  Recipe  from "../dataObjects/recipe.js"
import  Ingredient  from "../dataObjects/ingredients.js";

export default class databaseConnector {
    /* Parent class that defines the requirements of any database connector.
       Implementation of the DB Connector functions allows for interface with
       server allowing for lift and shift of different databases */
    constructor() {
      if (new.target === databaseConnector) {
        throw new Error("Cannot instantiate abstract class");
      }    
    }
 
    createUser(userToAdd) {
      throw new TypeError("Method no initialized");
    }
  
    readUser(userName) {
        /*allow for search for users by username, name, email using templated query that builds based on additions of optional args */
        throw new TypeError("Method no initialized");

    }
  
    searchUsers(userName, name) {
      throw new TypeError("Method no initialized");
    }

    updateUser(userName, userObject) {
      throw new TypeError("Method no initialized");
    }
  
    deleteUser(userName, name) {
      throw new TypeError("Method no initialized");
    }

    createRecipe(recipeObject) {
      throw new TypeError("Method no initialized");
    }

    searchRecipe(name, ingredients) {
      if (typeof userName !== "string") {
        throw new Error("Subclasses must implement requiredMethod with valid parameters");
      }
      throw new TypeError("Method no initialized");
    }

    updateRecipe(name, recipeObject) {
      throw new TypeError("Method no initialized");
    }

    deleteRecipe(name) {
      throw new TypeError("Method no initialized");
    }

    createIngredient(ingredientObject) {
      throw new TypeError("Method no initialized");
    }

    searchIngredient(ingredientName, test) {
      if (typeof ingredientName !== "int") {
        throw new Error("Subclasses must implement requiredMethod with valid parameters");
      }
      if(test == NaN){
        throw new Error("Subclasses must implement requiredMethod with valid parameters");
      }
      throw new TypeError("Method no initialized");
    }

    updateIngredient(name, ingredientObject) {
      throw new TypeError("Method no initialized");
    }

    deleteIngredient(name) {
      throw new TypeError("Method no initialized");
    }

    override(test){
      throw new TypeError("Method no initialized");
    }

  }
  