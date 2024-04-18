import  User  from '../../dataObjects/user.js';
import databaseConnector from '../databaseConnector.js';
import { MongoClient, ServerApiVersion } from 'mongodb';

export default class mongoDBConnector extends databaseConnector{
  constructor(dbURL, credentials, dbName){
    //Recipe collection map
    super()
    this.collectionMap = {
      'Users': 'userCollection',
      'Ingredients': 'Ingredients',
      'Recipes': 'recipeCollection'
    }

    //set the url, login credentials
    this.dbURL = dbURL
    this.credentials = credentials
    this.dbName = dbName
    this.connected = false
    //attempt to connect to client
    this.connect()
  }

  // Connect to the database
  async connect(){
    try {
      // Create a new MongoClient instance
      this.client = new MongoClient(this.dbURL, {
        tlsCertificateKeyFile: this.credentials,
        serverApi: ServerApiVersion.v1
      });
      // Connect to the server
      await this.client.connect();
      // Get the database instance
      this.db = this.client.db(this.dbName);
      // Log a success message
      console.log("Connected to the database");
      this.connected = true
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
      collection = this.db.collection(this.collectionMap['Users']) 
      await collection.insertMany(documentJSON)
    }catch(err){
      console.error(err);
    }
  }

  async readUser(userNameToFind) {
      try{
        collection = this.db.collection(this.collectionMap['Users']) 
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
        { name: { $regex: name, $options: "i" } }, // Case-insensitive
        { username: { $regex: userName, $options: "i" } },
      ],
    };
    try{
      collection = this.db.collection(this.collectionMap['Users']) 
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
      collection = this.db.collection(this.collectionMap['Users']) 
      result = await collection.updateOne(filter, updateDoc, options)
    }catch(err){
      console.error(err)
    }
  }

  async deleteUser(userName) {
    query = {'userName': userName};
    try{
      collection = this.db.collection(this.collectionMap['Users']) 
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
      collection = this.db.collection(this.collectionMap['Recipes']) 
      await collection.insertMany(documentJSON)
    }catch(err){
      console.error(err);
    }
  }

  async searchRecipes(recipeName, ingredients) {
    //build search query
    const query = {
      $or: [
        { recipeName: { $regex: recipeName, $options: "i" } }, // Case-insensitive
        { ingredients: { $in: ingredients } },
      ],
    };
    try{
      collection = this.db.collection(this.collectionMap['Recipes']) 
      foundRecipes = await collection.find(query).toArray()
    }catch(err){
      console.error(err);
    }
    return foundRecipes
  }

  async updateRecipe(recipeObject) {
    updateDoc = recipeObject.toJSON()
    filter = {'name': recipeObject.getRecipeName()};
    options = { upsert: true };
    try{
      collection = this.db.collection(this.collectionMap['Recipes']) 
      result = await collection.updateOne(filter, updateDoc, options)
    }catch(err){
      console.error(err)
    }
  }

  async deleteRecipe(recipeName) {
    query = {'name': recipeName};
    try{
      collection = this.db.collection(this.collectionMap['Recipes']) 
      result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted recipe:" + recipeName)
      }
      else{
        console.log("No documents matched. 0 recipes deleted")
      }
    }catch(err){
      console.error(err)
    }
  }

  async createIngredient(ingredienToAdd) {
    let documentJSON = []
    
    for (let index = 0; index < ingredienToAdd.length; index++) {
      documentJSON.append(ingredienToAdd[index].toJSON())
    }
    
    try{
      collection = this.db.collection(this.collectionMap['Ingredients']) 
      await collection.insertMany(documentJSON)
    }catch(err){
      console.error(err);
    }
  }

  async searchIngredients(name) {
    //build search query
    const query = {
      $or: [
        { name: { $regex: name, $options: "i" } } // Case-insensitive
      ],
    };
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let foundRecipes = await collection.find(query).toArray()
      console.log(foundRecipes)
      return foundRecipes
    }catch(err){
      console.error(err);
    }

  }

  async updateIngredient(ingredientObject) {
    updateDoc = ingredientObject.toJSON()
    filter = {'name': ingredientObject.getRecipeName()};
    options = { upsert: true };
    try{
      collection = this.db.collection(this.collectionMap['Ingredients']) 
      result = await collection.updateOne(filter, updateDoc, options)
    }catch(err){
      console.error(err)
    }
  }

  async deleteIngredient(ingredientName) {
    query = {'name': ingredientName};
    try{
      collection = this.db.collection(this.collectionMap['Ingredients']) 
      result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted recipe:" + ingredientName)
      }
      else{
        console.log("No documents matched. 0 ingredients deleted")
      }
    }catch(err){
      console.error(err)
    }
  }

}