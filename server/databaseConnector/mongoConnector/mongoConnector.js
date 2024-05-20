import Ingredient from '../../dataObjects/ingredients.js';
import  User  from '../../dataObjects/user.js';
import databaseConnector from '../databaseConnector.js';
import { MongoClient, ServerApiVersion } from 'mongodb';

export default class mongoDBConnector extends databaseConnector{
  constructor(dbURL, credentials, dbName){
    //Recipe collection map
    super()
    
    //TODO: Move to env variables + figure out a way to align with data objects
    this.collectionMap = {
      'Users': 'Users',
      'Ingredients': 'Ingredients',
      'Recipes': 'recipeCollection'
    }

    //set the url, login credentials
    this.dbURL = dbURL
    this.credentials = credentials
    this.dbName = dbName
    this.connected = false
    //attempt to connect to client
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
    let documentJSON = {ingredientList : []}

    for (let index = 0; index < ingredienToAdd.length; index++) {
      documentJSON.ingredientList.push(ingredienToAdd[index].toJSON())
    }
    
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      await collection.insertMany(documentJSON.ingredientList)
      return true
    }catch(err){
      if(err.errmsg.includes('E11000')){
        console.error("Ingredient already exists");        
        console.error(err.errmsg);
      }
      console.error(err);
    }
  }

  async readIngredient(ingredientNameToFind) {
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let cursor = await collection.find({ingredientName: ingredientNameToFind})
      let foundIngredient = Ingredient.fromJSON(await cursor.next())
      return foundIngredient
    }catch(err){
      //TODO: catch if error is TypeError: Cannot read properties of null -> ingredient not found
      console.error(err);
    }
  }
 
  async searchIngredients(ingredientName) {
    //build search query
    const query = {
      $or: [
        { ingredientName: { $regex: ingredientName, $options: "i" } } // Case-insensitive
      ],
    };
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let foundIngredientsCursor = await collection.find(query)
      let returnIngredientsList = []
      for await (const returnDoc of foundIngredientsCursor) {
        returnIngredientsList.push(Ingredient.fromJSON(returnDoc))
      }
      return returnIngredientsList
    }catch(err){
      console.error(err);
    }
  }

  async updateIngredient(ingredientName, ingredientObject) {
    let updateDoc = { $set: ingredientObject.toJSON() }
    let filter = {'ingredientName': ingredientName};
    let options = { upsert: true };
    
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let result = await collection.updateOne(filter, updateDoc, options)
      return result
    }catch(err){
      console.error(err)
    }
  }
  
  async deleteIngredient(ingredientName) {
    let query = {'ingredientName': ingredientName};
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted ingredient:" + ingredientName)
      }
      else{
        console.log("No documents matched. 0 ingredients deleted")
      }
    }catch(err){
      console.error(err)
    }
  }

}