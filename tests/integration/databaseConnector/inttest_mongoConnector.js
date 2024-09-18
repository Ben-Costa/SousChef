import dotenv from 'dotenv';
dotenv.config();
import mongoDBConnector from '../../../server/databaseConnector/mongoConnector/mongoConnector.js';
import User from '../../../server/dataObjects/user.js';
import Name from '../../../server/dataObjects/name.js';
import Ingredient from '../../../server/dataObjects/ingredients.js';
import Recipe from '../../../server/dataObjects/recipe.js';
import { wait } from '../../../utils/helperFunctions.js';
import { expect } from 'chai';



describe('MongoDB Connector', function() {
    
    const dbURL = process.env.DATABASE_URL;
    const credentials = process.env.CREDENTIALS_PATH;
    const dbName = process.env.DB_NAME;

    let db_connector = new mongoDBConnector(dbURL, credentials, dbName)
    
    //Users
    const name1 = new Name('John', 'Doe')
    const user1 = new User('JMan', 'testpass', 'jdoe@Gman.com', '12/12/12', name1, '')
    const name2 = new Name('John', 'Salcedo')
    const user2 = new User('BigJMan', 'smoolpp', 'bigj@Gman.com', '12/12/12', name2, '')
    const name3 = new Name('Willy', 'Wonga')
    const user3 = new User('sillywilly', 'bigpp', 'littlej@Gman.com', '12/12/12', name2, '')

    const testIngredient = new Ingredient("test", "testsdf", "sdfsdf", "sdfsd", "sdfsdf")
    const testIngredient2 = new Ingredient("tomato", "testsdf", "sdfsdf", "sdfsd", "sdfsdf")
    const testIngredient3 = new Ingredient("botato", "testsdf", "sdfsdf", "sdfsd", "sdfsdf")

    const recipe1 = new Recipe("recipe1", "recipe1", ["ingredient1", "ingredient2"], ["step1", "step2"], "recipe1", "recipe1")
    const recipe2 = new Recipe("recipe2", "recipe2", ["ingredient1", "ingredient2"], ["step1", "step2"], "recipe2", "recipe2")
    const recipe3 = new Recipe("recipe3", "recipe3", ["ingredient1", "ingredient2"], ["step1", "step2"], "recipe3", "recipe3")


    after(async function() {
        // clean up the database
        await db_connector.disconnect()
    });
  
    it('should connect to the database', async function() {
      await db_connector.connect()
      expect(db_connector.connected).to.be.true
    });

    it('should create a single user', async function() {
        let singleUser = await db_connector.createUser(user1);
        expect(singleUser.code).to.equal(201)
        expect(singleUser.msg).to.equal("Successfully created Users. Count: 1")
    });

    it('should create multiple users', async function() {
        let multipleUserCreate = await db_connector.createUser([user2, user3]);
        expect(multipleUserCreate.code).to.equal(201)
        expect(multipleUserCreate.msg).to.equal("Successfully created Users. Count: 2")
    });

    it('should not create duplicate users', async function() {
        let multipleUserCreateDuplicate = await db_connector.createUser([user2, user3]);
        expect(multipleUserCreateDuplicate.statusCode).to.equal(500)
    });

    it('should read a single user', async function() {
        let readUser = await db_connector.readUser('JMan')
        console.log("Read user: ")
        console.log(readUser)
        expect(readUser.code).to.equal(200)
        expect(readUser.data.userName).to.equal('JMan')
    });

    it('should not read a user that does not exist', async function() {
        let readUser2 = await db_connector.readUser('s435t4rfrreat54a')
        expect(readUser2.statusCode).to.equal(404)
    });

    it('should search for users', async function() {
        let searchUser = await db_connector.searchUsers("")
        expect(searchUser.code).to.equal(200)
    });

    it('should delete a single user', async function() {
        let delUser = await db_connector.deleteUser("BigJMan")
        expect(delUser.code).to.equal(201)
    });

    it('should not delete a user that does not exist', async function() {
        let delUserRepeat = await db_connector.deleteUser("BigJMan")
        expect(delUserRepeat.statusCode).to.equal(404)
    });

    it('should delete all remaining users', async function() {
        let delUserRepeat = await db_connector.deleteUser("sillywilly")
        let delUserRepeat2 = await db_connector.deleteUser("JMan")
        expect(delUserRepeat.code).to.equal(201)
    });

    //Ingredients
    it('should create a single ingredient', async function() {
        let singleIngredient =  await db_connector.createIngredient(testIngredient);
        expect(singleIngredient.code).to.equal(201)
        expect(singleIngredient.msg).to.equal("Successfully created Ingredients. Count: 1")
    });

    it('should create multiple ingredients', async function() {
        let multipleIngredientCreate = await db_connector.createIngredient([testIngredient2, testIngredient3]);
        expect(multipleIngredientCreate.code).to.equal(201)
        expect(multipleIngredientCreate.msg).to.equal("Successfully created Ingredients. Count: 2")
    });

    it('should not create duplicate ingredients', async function() {
        let multipleIngredientCreateDuplicate = await db_connector.createIngredient([testIngredient2, testIngredient3]);
        expect(multipleIngredientCreateDuplicate.statusCode).to.equal(500)
    });

    it('should read a single ingredient', async function() {
        let readIngredient = await db_connector.readIngredient('tomato')
        expect(readIngredient.code).to.equal(200)
        expect(readIngredient.data.ingredientName).to.equal('tomato')
    });

    it('should not read an ingredient that does not exist', async function() {
        let readIngredient2 = await db_connector.readIngredient('s435t4rfrreat54a')
        expect(readIngredient2.statusCode).to.equal(404)
    });

    it('should search for ingredients', async function() {
        let ingredientName = "b"
        const foundRecipes = await db_connector.searchIngredients(ingredientName);
        console.log("Found recipes: ")
        console.log(foundRecipes)
        expect(foundRecipes.code).to.equal(200)
    });

    it('should delete a single ingredient', async function() {
        let delIngredient = await db_connector.deleteIngredient("tomato")
        expect(delIngredient.code).to.equal(201)
    });

    it('should not delete an ingredient that does not exist', async function() {
        let delIngredientRepeat = await db_connector.deleteIngredient("tomato")
        expect(delIngredientRepeat.statusCode).to.equal(404)
    });

    it('should delete all remaining ingredients', async function() {
        let delIngredientRepeat = await db_connector.deleteIngredient("botato")
        let delIngredientRepeat2 = await db_connector.deleteIngredient("test")
        expect(delIngredientRepeat.code).to.equal(201)
    });

    //Recipes

    it('should create a single recipe', async function() {
        let singleRecipe = await db_connector.createRecipe(recipe1);
        expect(singleRecipe.code).to.equal(201)
        expect(singleRecipe.msg).to.equal("Successfully created Recipes. Count: 1")
    });

    it('should create multiple recipes', async function() {
        let multipleRecipeCreate = await db_connector.createRecipe([recipe2, recipe3]);
        expect(multipleRecipeCreate.code).to.equal(201)
        expect(multipleRecipeCreate.msg).to.equal("Successfully created Recipes. Count: 2")
    });

    it('should not create duplicate recipes', async function() {
        let multipleRecipeCreateDuplicate = await db_connector.createRecipe([recipe2, recipe3]);
        expect(multipleRecipeCreateDuplicate.statusCode).to.equal(500)
    });

    it('should read a single recipe', async function() {
        let readRecipe = await db_connector.readRecipe('recipe1')
        expect(readRecipe.code).to.equal(200)
        expect(readRecipe.data.recipeName).to.equal('recipe1')
    });

    it('should not read a recipe that does not exist', async function() {
        let readRecipe2 = await db_connector.readRecipe('s435t4rfrreat54a')
        expect(readRecipe2.statusCode).to.equal(404)
    });

    it('should search for recipes', async function() {
        let recipeName = "r"
        const foundRecipes = await db_connector.searchRecipes(recipeName);
        console.log("Found recipes: ")
        console.log(foundRecipes)
        expect(foundRecipes.code).to.equal(200)
    });

    it('should delete a single recipe', async function() {
        let delRecipe = await db_connector.deleteRecipe("recipe2")
        expect(delRecipe.code).to.equal(201)
    });

    it('should not delete a recipe that does not exist', async function() {
        let delRecipeRepeat = await db_connector.deleteRecipe("recipe2")
        expect(delRecipeRepeat.statusCode).to.equal(404)
    });

    it('should delete all remaining recipes', async function() {
        let delRecipeRepeat = await db_connector.deleteRecipe("recipe3")
        let delRecipeRepeat2 = await db_connector.deleteRecipe("recipe1")
        expect(delRecipeRepeat.code).to.equal(201)
    });

    it('should close the database connection', async function() {
      await db_connector.disconnect()
      expect(db_connector.connected).to.be.false
    });
  });
  