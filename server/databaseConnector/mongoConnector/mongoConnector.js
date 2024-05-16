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