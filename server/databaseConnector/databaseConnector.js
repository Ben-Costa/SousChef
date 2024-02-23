//Export the class from file A, e.g. export class Employee {}.
//Import the class in file B as import {Employee} from './another-file.js'.

import { User } from "../dataObjects/user"
import { Recipe } from "../dataObjects/recipe"
import { Ingredient } from "../dataObjects/ingredients";

export class databaseConnector {
    /* Parent class that defines the requirements of any database connector.
       Implementation of the DB Connector functions allows for interface with
       server allowing for lift and shift of different databases */
    constructor() {
      if (new.target === Parent) {
        throw new Error("Cannot instantiate abstract class");
      }    
    }
 
    createUser(userToAdd) {
      if (typeof userToAdd !== User) {
        throw new Error("Subclasses must implement requiredMethod with valid parameters");
      }
    }
  
    readUser(userName) {
        /*allow for search for users by username, name, email using templated query that builds based on additions of optional args */
        if (typeof userName !== "string") {
          throw new Error("Subclasses must implement requiredMethod with valid parameters");
        }
    }
  
    searchUsers(userName, name) {

    }

    updateUser(userName, userObject) {

    }
  
    deleteUser(userName, name) {

    }

    createRecipe(recipeObject) {

    }

    readRecipe(name, ingredients) {

    }

    updateRecipe(name, recipeObject) {

    }

    deleteRecipe(name) {

    }

    createIngredient(ingredientObject) {

    }

    readIngredient(name, typeInfo) {

    }

    updateIngredient(name, ingredientObject) {

    }

    deleteIngredient(name) {

    }

  }
  