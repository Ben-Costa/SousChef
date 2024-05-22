import Recipe from '../../dataObjects/recipe.js';
import  User  from '../../dataObjects/user.js';
import databaseConnector from '../databaseConnector.js';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

export default class mongoDBConnector extends databaseConnector{
  constructor(dbURL, credentials, dbName){
    //Recipe collection map
    super()
    
    //TODO: Move to env variables + figure out a way to align with data objects
    this.collectionMap = {
      'Users': 'Users',
      'Ingredients': 'Ingredients',
      'Recipes': 'Recipes'
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
      throw err
    }
  }

  // Disconnect from the database
  async disconnect() {
    try {
      // Close the client connection
      await this.client.close();
      this.connected = false
      // Log a success message
      console.log("Disconnected from the database");
    } catch (err) {
      // Log an error message
      console.error(err);
    }
  }

  async createUser(userToAdds) {
    let documentJSON = {userList : []}
    
    for (let index = 0; index < userToAdds.length; index++) {
      documentJSON.userList.push(userToAdds[index].toJSON())
    }
    
    try{
      //use let for all collection creations
      let collection = this.db.collection(this.collectionMap['Users']) 
      await collection.insertMany(documentJSON.userList)
      return true
    }catch(err){
      //todo: make recursive to remove duplicate user and pass in list of remaining users
      //      will need to search through json list for usernames that match that found in error msg
      if(err.errmsg.includes('E11000')){
        console.error(err.errmsg);
      }
    }
  }


  async readUser(userNameToFind) {
      try{
        let collection = this.db.collection(this.collectionMap['Users']) 
        let cursor = await collection.find({userName: userNameToFind})
        let foundUser = User.fromJSON(await cursor.next())
        return foundUser
      }catch(err){
        console.error(err);
      }
  }

  //may need to llook at text search operator
  async searchUsers(userName) {
    //build search query
    //TODO: Add in name search
    //TODO: make it so search of "" does not add that item to query
    //TODO: if not items provided, search by username and return to limit
    //TODO: add limit amount
    const query = {
      $or: [
        { userName: { $regex: userName, $options: "i" } }
      ],
    };
    try{
      let collection = this.db.collection(this.collectionMap['Users']) 
      let foundUsersCursor = await collection.find(query)
      let returnUserList = []
      for await (const returnDoc of foundUsersCursor) {
        returnUserList.push(User.fromJSON(returnDoc))
      }
      return returnUserList
    }catch(err){
      console.error(err);
    }    
  }

  async updateUser(userName, userObject) {
    let updateDoc = { $set: userObject.toJSON() }
    let filter = {'userName': userName};
    let options = { upsert: true };
    try{
      let collection = this.db.collection(this.collectionMap['Users']) 
      let result = await collection.updateOne(filter, updateDoc, options)
      return result
    }catch(err){
      console.error(err)
    }
  }

  async deleteUser(userName) {
    let query = {'userName': userName};
    try{
      let collection = this.db.collection(this.collectionMap['Users']) 
      let result = await collection.deleteOne(query)
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

  /**
   * Create a new recipe in the database
   * @param {[string]} recipeToAdd recipes to add 
   */
  async createRecipe(recipeToAdd) {

    let recipes = [];
    
    for (const recipe of recipeToAdd) {

      let jsonObj = recipe.toJSON();
      jsonObj.creationTime = new Date();
      recipes.push(jsonObj);
    }
    
    let promises = []
    try{
      let collection = this.db.collection(this.collectionMap['Recipes']);
      console.log(recipes);
      let f = await collection.insertMany(recipes);
      console.log(f);
    }catch(err){

      console.error(err);
    }

    console.log("Done creating the recipe!");
  }

  /**
   * Search for a recipe by its name
   * @param {Array[String]} recipeName name of recipe 
   * @param {*} ingredients potential ingredients
   * @returns 
   */
  async searchRecipes(recipeName, ingredients) {

    // search criteria for the category is all if no argument is passed for that parameter

    if (typeof(recipeName) === 'undefined')  recipeName = "";
    if (typeof(ingredients) === 'undefined') ingredients = [];
    
    let recipes = [];
    
    //build search query
    const query = {
      $or: [
        { name: { $regex: recipeName, $options: "i" } }, // Case-insensitive
        { ingredients: { $in: ingredients } },
      ],
    };
    try{
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      let foundRecipes = await collection.find(query).toArray()
      for (const recipe of foundRecipes) {
        let currentRecipe = Recipe.placeholderCreate(recipe);
        currentRecipe._id = recipe._id;
        recipes.push(currentRecipe);
      }
      
      
    }catch(err){
      console.error(err);
    }
    return recipes;
  }

  /**
   * Updates a recipe with updated contents
   * @param {Recipe} recipeObject recipe with updated contents
   * @returns {boolean} true if update succeeded
   */
  async updateRecipe(recipeObject) {

    let updateDoc = recipeObject.toJSON()
    let filter = recipeObject._id instanceof ObjectId
               ? { '_id': new ObjectId(recipeObject._id) }
               : { 'name': recipeObject.name };
    let options = { upsert: true };

    let success = false;
    try {
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      let result = await collection.updateOne(filter, { "$set": updateDoc }, options)
      success = result.acknowledged;
    } catch(err){
      console.error(err)
    }

    return success;
  }

  /**
   * Deletes a recipe from the database
   * 
   * @param {string} recipeName Name of recipe 
   * @returns {boolean} true if the recipe succesfully deleted
   */
  async deleteRecipe(recipeName) {

    let deleted = false;
    let query = {'name': recipeName};
    
    try{

      let collection = this.db.collection(this.collectionMap.Recipes) 
      let result = await collection.deleteOne(query)
      deleted = result.deletedCount == 1;

    }catch(err){
      console.error(err)
    }

    if (deleted){
      console.log("Successfully deleted recipe: " + recipeName)
    }
    else{
      console.log("No documents matched. 0 recipes deleted")
    }

    return deleted;
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