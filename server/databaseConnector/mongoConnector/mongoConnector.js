import { databaseConnector } from '../databaseConnector';

const { MongoClient } = require("mongodb");

class mongoDBConnector extends databaseConnector{

    

// Define the database connector class
class DbConnector {
  // Constructor
  constructor(uri, dbName) {
    // Store the URI and database name as instance fields
    this.uri = uri;
    this.dbName = dbName;
    // Initialize the client and database as null
    this.client = null;
    this.db = null;
  }

  // Connect to the database
  async connect() {
    try {
      // Create a new MongoClient instance
      this.client = new MongoClient(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      // Connect to the server
      await this.client.connect();
      // Get the database instance
      this.db = this.client.db(this.dbName);
      // Log a success message
      console.log("Connected to the database");
    } catch (err) {
      // Log an error message
      console.error(err);
    }
  }

  // Disconnect from the database
  async disconnect() {
    try {
      // Close the client connection
      await this.client.close();
      // Set the client and database to null
      this.client = null;
      this.db = null;
      // Log a success message
      console.log("Disconnected from the database");
    } catch (err) {
      // Log an error message
      console.error(err);
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



