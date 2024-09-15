import Ingredient from '../../dataObjects/ingredients.js';
import  User  from '../../dataObjects/user.js';
import databaseConnector from '../databaseConnector.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import {NotFoundError, DatabaseError, ObjectAlreadyExistsError} from '../../../utils/custom_exceptions.js'
import {InternalServerResponse} from '../../../utils/interal_response.js'

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
      console.log("Disconnected from the database" + this.connected);
    } catch (err) {
      // Log an error message
      console.error(err);
    }
  }

  async _create(objectsToAdd, collectionMapName, objectType){
    if(!Array.isArray(objectsToAdd)){
      objectsToAdd = [objectsToAdd]
    }

    let documentJSON = {userList : []}
    
    for (let index = 0; index < objectsToAdd.length; index++) {
      documentJSON.userList.push(objectsToAdd[index].toJSON())
    }
    
    try{
      //use let for all collection creations
      let collection = this.db.collection(this.collectionMap[collectionMapName]) 
      await collection.insertMany(documentJSON)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      `Successfully created ${objectType}. Count: ` + objectsToAdd.length,
      "")
    }catch(err){
      //todo: make recursive to remove duplicate user and pass in list of remaining users
      //      will need to search through json list for usernames that match that found in error msg
      if(err.errmsg.includes('E11000')){
        console.error(err.errmsg);
        let error = ObjectAlreadyExistsError(err.errmsg)
        return error
      }
      console.error(err);
      return new DatabaseError(err.errmsg)
    }
  }

  async createUser(userToAdds) {
    if(!Array.isArray(userToAdds)){
      userToAdds = [userToAdds]
    }

    let documentJSON = {userList : []}
    
    for (let index = 0; index < userToAdds.length; index++) {
      documentJSON.userList.push(userToAdds[index].toJSON())
    }
    
    try{
      //use let for all collection creations
      let collection = this.db.collection(this.collectionMap['Users']) 
      await collection.insertMany(documentJSON)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      "Successfully created users. Count: " + userToAdds.length,
      "")
    }catch(err){
      //todo: make recursive to remove duplicate user and pass in list of remaining users
      //      will need to search through json list for usernames that match that found in error msg
      if(err.errmsg.includes('E11000')){
        console.error(err.errmsg);
        let error = ObjectAlreadyExistsError(err.errmsg)
        return error
      }
      console.error(err);
      return new DatabaseError(err.errmsg)
    }
  }

  async readUser(userNameToFind) {
      try{
        let collection = this.db.collection(this.collectionMap['Users']) 
        let cursor = await collection.find({userName: userNameToFind})
        let foundUser = User.fromJSON(await cursor.next())
        let response = new InternalServerResponse("DBConnectorResponse", 200, 
                                               "Successfully found user with name: "+ userNameToFind, 
                                               foundUser)
        return response
      }catch(err){
      console.error(err);
      return new DatabaseError(err.errmsg)
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
      let foundUsers = await collection.find(query).toArray()
      if(foundUsers.length == 0){
        return NotFoundError("No users found with query: "+ query)
      }
      return new InternalServerResponse("DBConnectorResponse", 200, 
      "Successfully found users with query: "+ query, 
      returnUserList)
    }catch(err){
      console.error(err);
      return new DatabaseError(err.errmsg)
    }    
  }

  async updateUser(userObject) {
    let updateDoc = { $set: userObject.toJSON() }
    let filter = {'userName': userObject.getUserName()};
    let options = { upsert: true };
    try{
      let collection = this.db.collection(this.collectionMap['Users']) 
      let result = await collection.updateOne(filter, updateDoc, options)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      "Successfully updated user with User Name: "+ userObject.getUserName(), 
      "")
    }catch(err){
      console.error(err);
      return DatabaseError(err.errmsg)
    }
  }

  async deleteUser(userName) {
    let query = {'userName': userName};
    try{
      let collection = this.db.collection(this.collectionMap['Users']) 
      let result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted user:" + userName)
        let response = new InternalServerResponse("DBConnectorResponse", 201, 
        "Successfully deleted user with User Name: "+ userName, 
        "")
      }
      else{
        console.log("No documents matched. 0 users deleted")
        return NotFoundError("No documents matched. 0 users deleted")
      }
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async createRecipe(recipeToAdd) {
    if(!Array.isArray(recipeToAdd)){
      recipeToAdd = [recipeToAdd]
      }
    
    let documentJSON = {recipeList : []}

    for (let index = 0; index < recipeToAdd.length; index++) {
      documentJSON.recipeList.push(recipeToAdd[index].toJSON())
    }  
    try{
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      await collection.insertMany(documentJSON)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      "Successfully created recipes. Count: " + recipeToAdd.length, "")
    }catch(err){
      if(err.errmsg.includes('E11000')){
        console.error(err.errmsg);
        let error = ObjectAlreadyExistsError(err.errmsg)
        return error
      }
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async readRecipe(recipeNameToFind) {
    try{
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      let cursor = await collection.find({recipeName: recipeNameToFind})
      let foundRecipe = User.fromJSON(await cursor.next())
      return new InternalServerResponse("DBConnectorResponse", 200, 
                                        "Successfully found recipe with name: "+ userNameToFind, 
                                        foundRecipe)
    }catch(err){
    console.error(err);
    return new DatabaseError(err.errmsg)
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
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      let foundRecipes = await collection.find(query).toArray()
      if(foundRecipes.length == 0){
        return NotFoundError("No recipes found with query: "+ query)
      }
      return new InternalServerResponse("DBConnectorResponse", 200, 
      "Successfully found recipes with query: "+ query, 
      returnUserList)
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async updateRecipe(recipeObject) {
    let updateDoc = recipeObject.toJSON()
    let filter = {'name': recipeObject.getRecipeName()};
    let options = { upsert: true };
    try{
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      let result = await collection.updateOne(filter, updateDoc, options)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      "Successfully updated user with Recipe Name: "+ recipeObject.getRecipeName(), 
      "")
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async deleteRecipe(recipeName) {
    let query = {'name': recipeName};
    try{
      let collection = this.db.collection(this.collectionMap['Recipes']) 
      let result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted recipe:" + recipeName)
        let response = new InternalServerResponse("DBConnectorResponse", 201, 
        "Successfully deleted recipe with recipe Name: "+ recipeName, 
        "")
      }
      else{
        console.log("No documents matched. 0 recipes deleted")
        return NotFoundError("No documents matched. 0 recipes deleted")
      }
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async createIngredient(ingredienToAdd) {
    if(!Array.isArray(ingredienToAdd)){
      ingredienToAdd = [ingredienToAdd]
    }

    let documentJSON = {ingredientList : []}

    for (let index = 0; index < ingredienToAdd.length; index++) {
      documentJSON.ingredientList.push(ingredienToAdd[index].toJSON())
    }
    
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      await collection.insertMany(documentJSON.ingredientList)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      "Successfully created ingredients. Count: " + ingredienToAdd.length,
      "")    
    }catch(err){
      if(err.errmsg.includes('E11000')){
        console.error("Ingredient already exists");        
        console.error(err.errmsg);
        return Object
      }
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async readIngredient(ingredientNameToFind) {
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let cursor = await collection.find({ingredientName: ingredientNameToFind})
      let foundIngredient = Ingredient.fromJSON(await cursor.next())
      return new InternalServerResponse("DBConnectorResponse", 200, 
      "Successfully found Ingredient with name: "+ ingredientNameToFind, 
      foundIngredient)
    }catch(err){
      //TODO: catch if error is TypeError: Cannot read properties of null -> ingredient not found
      console.error(err)
      return new DatabaseError(err.errmsg)
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
      let foundIngredients = await collection.find(query).toArray()
      if(foundUsers.length == 0){
        return NotFoundError("No users found with query: "+ query)
      }
      return new InternalServerResponse("DBConnectorResponse", 200, 
      "Successfully found ingredients with query: "+ query, 
      foundIngredients)
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async updateIngredient(ingredientObject) {
    let updateDoc = { $set: ingredientObject.toJSON() }
    let filter = {'ingredientName': ingredientObject.getName()};
    let options = { upsert: true };
    
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let result = await collection.updateOne(filter, updateDoc, options)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      "Successfully updated Ingredient with name: "+ ingredientObject.getName(), 
      "")
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }
  
  async deleteIngredient(ingredientName) {
    let query = {'ingredientName': ingredientName};
    try{
      let collection = this.db.collection(this.collectionMap['Ingredients']) 
      let result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log("Successfully deleted user:" + ingredientName)
        let response = new InternalServerResponse("DBConnectorResponse", 201, 
        "Successfully deleted ingredient with name: "+ ingredientName, 
        "")
      }
      else{
        console.log("No documents matched. 0 ingredients deleted")
        return NotFoundError("No documents matched. 0 ingredients deleted")
      }
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

}