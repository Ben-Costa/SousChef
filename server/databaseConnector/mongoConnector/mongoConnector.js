import { User } from '../../dataObjects/user';
import { databaseConnector } from '../databaseConnector';

const { MongoClient } = require("mongodb");

class mongoDBConnector extends databaseConnector{
  constructor(dbURL, credentials, dbName){
    //Recipe collection map
    this.collectionMap = {
      'Users': 'userCollection',
      'Ingredients': 'ingredientsCollection',
      'Recipes': 'recipeCollection'
    }

    //set the url, login credentials
    this.dbURL = dbURL
    this.credentials = credentials
    this.dbName = dbName
    //attempt to connect to client
    this.client = this.connect()
  }

  // Connect to the database
  async connect(){
    try {
      // Create a new MongoClient instance
      this.client = new MongoClient(this.uri, {
        tlsCertificateKeyFile: this.credentials,
        serverApi: ServerApiVersion.v1
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
      // Log a success message
      console.log("Disconnected from the database");
    } catch (err) {
      // Log an error message
      console.error(err);
    }
  }

  async createUser(userToAdd) {
    let documentJSON = []
    
    for (let index = 0; index < userToAdd.length; index++) {
      documentJSON.append(userToAdd[index].toJSON())
    }
    
    try{
      collection = this.dbName.collection(this.collectionMap['Users']) 
      await collection.insertMany(documentJSON)
    }catch(err){
      console.error(err);
    }
  }

  async readUser(userNameToFind) {
      try{
        collection = this.dbName.collection(this.collectionMap['Users']) 
        user = await collection.find({userName: userNameToFind})
      }catch(err){
        console.error(err);
      }
      return User(user)
  }

  //may need to llook at text search operator
  async searchUsers(userName, name) {
    //build search query
    const query = {
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive
        { username: { $regex: query, $options: "i" } },
      ],
    };
    try{
      collection = this.dbName.collection(this.collectionMap['Users']) 
      foundUsersCursor = await collection.find({})
    }catch(err){
      console.error(err);
    }
    //iterate through cursor and create list of user objects 
    
    return User(user)
  }

  async updateUser(userObject) {
    updateDoc = userObject.toJSON()
    filter = {'userName': userObject.getUserName()};
    options = { upsert: true };
    try{
      collection = this.dbName.collection(this.collectionMap['Users']) 
      result = await collection.updateOne(filter, updateDoc, options)
    }catch(err){
      console.error(err)
    }
  }

  async deleteUser(userName) {
    query = {'userName': userName};
    try{
      collection = this.dbName.collection(this.collectionMap['Users']) 
      result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted user:" + userName)
      }
      else{
        console.log("No documents matched. 0 users deleted")
      }
    }catch(err){
      console.error(err)
    }
  }

  async createRecipe(recipeToAdd) {
    let documentJSON = []
    
    for (let index = 0; index < recipeToAdd.length; index++) {
      documentJSON.append(recipeToAdd[index].toJSON())
    }
    
    try{
      collection = this.dbName.collection(this.collectionMap['Recipes']) 
      await collection.insertMany(documentJSON)
    }catch(err){
      console.error(err);
    }
  }

  //todo
  async searchRecipes(recipeName, ingredients) {
    //build search query
    const query = {
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive
        { username: { $regex: query, $options: "i" } },
      ],
    };
    try{
      collection = this.dbName.collection(this.collectionMap['Users']) 
      foundUsersCursor = await collection.find({})
    }catch(err){
      console.error(err);
    }
    //iterate through cursor and create list of user objects 
    
    return User(user)
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