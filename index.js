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

const test=  await db_connector.createUser([user1]);

//Create User- single and multiple


//Read User- single

//searchUsers- try with no name, no user, and both

//updateUser- single

//deleteUser- single



let ingredientName = "b"
const foundRecipes = await db_connector.searchIngredients(ingredientName);
console.log(foundRecipes);

db_connector.disconnect()
