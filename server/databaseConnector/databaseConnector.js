//Export the class from file A, e.g. export class Employee {}.
//Import the class in file B as import {Employee} from './another-file.js'.

class databaseConnector {
    /* Parent class that defines the requirements of any database connector.
       Implementation of the DB Connector functions allows for interface with
       server allowing for lift and shift of different databases */
    constructor() {
      // Initialization code left to the children as setup is different
    }

    /**
     * Creates a new user in the db
     * @param {Number} a
     * @param {Number} b
     * @param {Boolean} retArr If set to true, the function will return an array
     * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
     */    
    createUser() {

    }

        /**
     * Creates a new user in the db
     * @param {Number} a
     * @param {Number} b
     * @param {Boolean} retArr If set to true, the function will return an array
     * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
     */    
    readUser() {
        /*allow for search for users by username, name, email using templated query that builds based on additions of optional args */
    }

        /**
     * Creates a new user in the db
     * @param {Number} a
     * @param {Number} b
     * @param {Boolean} retArr If set to true, the function will return an array
     * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
     */    
    updateUser() {

    }

            /**
     * Creates a new user in the db
     * @param {Number} a
     * @param {Number} b
     * @param {Boolean} retArr If set to true, the function will return an array
     * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
     */    
    deleteUser() {

    }

    createRecipe() {

    }

    readRecipe() {

    }

    updateRecipe() {

    }

    deleteRecipe() {

    }


    createIngredient() {

    }

    readIngredient() {

    }

    updateIngredient() {

    }

    deleteIngredient() {

    }

  }
  