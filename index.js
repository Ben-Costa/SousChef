import dotenv from 'dotenv';
dotenv.config();
import mongoDBConnector from './server/databaseConnector/mongoConnector/mongoConnector.js';
import User from './server/dataObjects/user.js';
import Name from './server/dataObjects/name.js';
import Ingredient from './server/dataObjects/ingredients.js';
import Recipe from './server/dataObjects/recipe.js';
import { wait } from './utils/helperFunctions.js'


const dbURL = process.env.DATABASE_URL;
const credentials = process.env.CREDENTIALS_PATH;
const dbName = process.env.DB_NAME;


const db_connector = new mongoDBConnector(dbURL, credentials, dbName)
while(!db_connector.connected){
    console.log('Waiting for Database Connection')
    await wait(1000);
}

//User CRUD Integration Tests
const name1 = new Name('John', 'Doe')
const user1 = new User('JMan', 'testpass', 'jdoe@Gman.com', '12/12/12', name1, '')
console.log(name1.print())


const name2 = new Name('John', 'Salcedo')
const user2 = new User('BigJMan', 'smoolpp', 'bigj@Gman.com', '12/12/12', name2, '')

const name3 = new Name('Willy', 'Wonga')
const user3 = new User('sillywilly', 'bigpp', 'littlej@Gman.com', '12/12/12', name2, '')

//Create User- single and multiple, and duplicate
let singleUser=  await db_connector.createUser([user1]);
let multipleUserCreate = await db_connector.createUser([user2, user3]);
let multipleUserCreateDuplicate = await db_connector.createUser([user2, user3]);

//Read User- single
let readUser = await db_connector.readUser('sillywilly')
console.log("Read user: ")
console.log(readUser)

let readUser2 = await db_connector.readUser('s')
console.log("Read user2: ")
console.log(readUser2)

//searchUsers- try with no name, no user, and both
let searchUser = await db_connector.searchUsers("")
let searchUser1 = await db_connector.searchUsers("BigJMan")
//updateUser- single
const nameupdate = new Name('Willy', 'Wanga')
const userupdate = new User('sillybilly', 'xxbigpp', 'xxlittlej@Gman.com', '12/12/12', nameupdate, '')
let updateUser = await db_connector.updateUser("sillywilly", userupdate)
console.log(updateUser)

//deleteUser- single, multiple, user not exist
let delUser = await db_connector.deleteUser("BigJMan")
let delUserRepeat = await db_connector.deleteUser("BigJMan")

//Ingredients CRUD Integration Tests
let testIngredient = new Ingredient("test", "testsdf", "sdfsdf", "sdfsd", "sdfsdf")
let testIngredient2 = new Ingredient("tomato", "testsdf", "sdfsdf", "sdfsd", "sdfsdf")
let testIngredient3 = new Ingredient("potato", "testsdf", "sdfsdf", "sdfsd", "sdfsdf")

//Create Ingredients- single and multiple, and duplicate
console.log("***************Ingredients Tests**********")

let singleIngredient =  await db_connector.createIngredient([testIngredient]);
let multipleIngredientCreate = await db_connector.createIngredient([testIngredient2, testIngredient3]);
let multipleIngredientCreateDuplicate = await db_connector.createIngredient([testIngredient2, testIngredient3]);

console.log(singleIngredient)
console.log(multipleIngredientCreate)
console.log(multipleIngredientCreateDuplicate)

//Read Ingredients- single
let readIngredient = await db_connector.readIngredient('tomato')
console.log("Read ingredient: ")
console.log(readIngredient)

let readIngredient2 = await db_connector.readIngredient('s')
console.log("Read ingredient2: ")
console.log(readIngredient2)

//search Ingredients- try with no name, no user, and both
console.log("search ingredients")
let ingredientName = "b"
const foundRecipes = await db_connector.searchIngredients(ingredientName);
console.log(foundRecipes);

let ingredientName2 = "ato"
const foundRecipes2 = await db_connector.searchIngredients(ingredientName2);
console.log(foundRecipes2);

let ingredientName3 = "tomato"
const foundRecipes3 = await db_connector.searchIngredients(ingredientName3);
console.log(foundRecipes3);

//update Ingredients- single
const ingredientUpdate = new Ingredient('tomatoes', 'xxbigpp', 'there', 'are', 'asdas')
let updateIngredient = await db_connector.updateUser("tomato", ingredientUpdate)
console.log(updateIngredient)

//delete Ingredients- single, multiple, user not exist
let delIng = await db_connector.deleteUser("tomato")
let delIngRepeat = await db_connector.deleteUser("tomatoe")

db_connector.disconnect()
