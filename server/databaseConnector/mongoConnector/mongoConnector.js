import Ingredient from '../../dataObjects/ingredients.js';
import  User  from '../../dataObjects/user.js';
import databaseConnector from '../databaseConnector.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import {NotFoundError, DatabaseError, ObjectAlreadyExistsError} from '../../../utils/custom_exceptions.js'
import {InternalServerResponse} from '../../../utils/interal_response.js'
import Recipe from '../../dataObjects/recipe.js';

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
      console.log(`dbName: ${this.dbName}`);
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
      await collection.insertMany(documentJSON.userList)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      `Successfully created ${objectType}. Count: ` + objectsToAdd.length,
      "")
    }catch(err){
      //todo: make recursive to remove duplicate user and pass in list of remaining users
      //      will need to search through json list for usernames that match that found in error msg
      if(err.errmsg.includes('E11000')){
        console.error(err.errmsg);
        let error = new ObjectAlreadyExistsError(err.errmsg)
        return error
      }
      console.error(err);
      return new DatabaseError(err.errmsg)
    }
  }

  async _read(findDict, collectionMapName, dataObjectTypes, objectName){
    try{
      console.log(findDict)
      console.log(collectionMapName)
      let collection = this.db.collection(this.collectionMap[collectionMapName]) 
      let foundObject = await collection.find(findDict).toArray()

      if(foundObject.length == 0){
        console.log(`No ${objectName} found with query: `+ findDict)
        return new NotFoundError(`No ${objectName} found with query: `+ findDict)
      }
      console.log(foundObject[0])
      let response = new InternalServerResponse("DBConnectorResponse", 200, 
                                             `Successfully found ${objectName}`, 
                                             dataObjectTypes.fromJSON(foundObject[0]))
      //check if type of datsa is yser class
      return response
    
    }catch(err){
    console.error(err);
    return new DatabaseError(err.errmsg)
    }
  }

  //may need to llook at text search operator
  async _search(query, collectionMapName, dataObjectTypes, objectName, pageSize = 20, page = 1){
    //build search query
    //TODO: Add in name search
    //TODO: make it so search of "" does not add that item to query
    //TODO: if not items provided, search by username and return to limit
    try{
      //return pageSize + 1 to see if there are more pages
      let limit = pageSize + 1;
      let skip = (page - 1) * pageSize;
  
      let collection = this.db.collection(this.collectionMap[collectionMapName]) 
      let foundObjects = await collection.find(query)
                                          .skip(skip)
                                          .limit(limit)
                                          .toArray()
      console.log(foundObjects.length)
      const hasMore = foundObjects.length > pageSize;
      if (hasMore) {
        foundObjects.pop();
      }

      if(foundObjects.length === 0){
        return new NotFoundError(`No ${objectName} found with query: `+ query)
      }
      let returnList = []
      for(let i = 0; i < foundObjects.length; i++){
        returnList.push(dataObjectTypes.fromJSON(foundObjects[i]))
      } 
      let responseData = {'data': returnList, 'pagination': {'hasMore': hasMore, 'currentPage': page, 'pageSize': pageSize}}
      return new InternalServerResponse("DBConnectorResponse", 200, 
      `Successfully found ${objectName} with query: `+ query, responseData)
    }catch(err){
      console.error(err);
      return new DatabaseError(err.errmsg)
    }    
  }

  async _update(updateDoc, filter, collectionMapName, objectName) {
    let options = { upsert: true };
    try{
      let collection = this.db.collection(this.collectionMap[collectionMapName]) 
      let result = await collection.updateOne(filter, updateDoc, options)
      return new InternalServerResponse("DBConnectorResponse", 201, 
      `Successfully updated ${objectName}`, 
      "")
    }catch(err){
      console.error(err);
      return DatabaseError(err.errmsg)
    }
  }

  async _delete(query, collectionMapName, objectName){
    try{
      let collection = this.db.collection(this.collectionMap[collectionMapName]) 
      let result = await collection.deleteOne(query)
      if ( result.deletedCount == 1){
        console.log(`Successfully deleted ${objectName}:` + query)
        return new InternalServerResponse("DBConnectorResponse", 201, 
        `Successfully deleted ${objectName}:` + query, 
        "")
      }
      else{
        console.log(`No documents matched. 0 ${objectName} deleted`)
        return new NotFoundError(`No documents matched. 0 ${objectName} deleted`)
      }
    }catch(err){
      console.error(err)
      return new DatabaseError(err.errmsg)
    }
  }

  async createUser(userToAdds) {
    return this._create(userToAdds, 'Users', 'Users')
  }

  async readUser(userNameToFind) {
    console.log("readUser")
    return this._read({'userName': userNameToFind}, 'Users', User, "User")  
  }

  async searchUsers(userName = "", pageSize = 20, page = 1, query = {}) {
    let usersQuery = {};
  
    if (userName) {
      usersQuery = {
        $or: [
          { userName: { $regex: userName, $options: "i" } }
        ],
      };
    }
    console
    return this._search(usersQuery, 'Users', User, 'Users', pageSize, page);
  }
  
  async updateUser(userObject) {
    let updateDoc = { $set: userObject.toJSON() }
    let filter = {'userName': userObject.getUserName()};
    return this._update(updateDoc, filter, "Users", "User")
  }

  async deleteUser(userName) {
    let query = {'userName': userName};
    return this._delete(query, 'Users', 'Users')
  }

  async createRecipe(recipeToAdd) {
    return this._create(recipeToAdd, 'Recipes', 'Recipes')
  }
  
  async readRecipe(recipeNameToFind) {
    return this._read({name: recipeNameToFind}, 'Recipes', Recipe, "Recipe")  
  }

  async searchRecipes(recipeName, ingredients) {
    // Ensure ingredients is an array
    if (!Array.isArray(ingredients)) {
        ingredients = [ingredients];
    }

    const query = {
        $or: [
            { name: { $regex: recipeName, $options: "i" } }, // Case-insensitive
            { ingredients: { $in: ingredients } },
        ],
    };

    return this._search(query, 'Recipes', Recipe, 'Recipes');
  }

  async updateRecipe(recipeObject) {
    let updateDoc = recipeObject.toJSON()
    let filter = {'name': recipeObject.getRecipeName()};
    return this._update(updateDoc, filter, "Recipes", "Recipes")
  }

  async deleteRecipe(recipeName) {
    let query = {'name': recipeName};
    return this._delete(query, 'Recipes', 'Recipes')
  }

  async createIngredient(ingredienToAdd) {
    return this._create(ingredienToAdd, 'Ingredients', 'Ingredients')
  }

  async readIngredient(ingredientNameToFind) {
    return this._read({ingredientName: ingredientNameToFind}, 'Ingredients', Ingredient, "Ingredient")  
  }

  async searchIngredients(ingredientName) {
    //build search query
    const query = {
      $or: [
        { ingredientName: { $regex: ingredientName, $options: "i" } } // Case-insensitive
      ],
    };
    return this._search(query, 'Ingredients', Ingredient, 'Ingredients') 
  }

  async updateIngredient(ingredientObject) {
    let updateDoc = { $set: ingredientObject.toJSON() }
    let filter = {'ingredientName': ingredientObject.getName()};
    return this._update(updateDoc, filter, "Ingredients", "Ingredient")
  }

  async deleteIngredient(ingredientName) {
    let query = {'ingredientName': ingredientName};
    return this._delete(query, 'Ingredients', 'Ingredients')
  }
}