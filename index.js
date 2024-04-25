import dotenv from 'dotenv';
dotenv.config();
import mongoDBConnector from './server/databaseConnector/mongoConnector/mongoConnector.js';
import { wait } from './utils/helperFunctions.js'

const dbURL = process.env.DATABASE_URL;
const credentials = process.env.CREDENTIALS_PATH;
const dbName = process.env.DB_NAME;

console.log(dbName)
console.log(credentials)
console.log(dbURL)


const db_connector = new mongoDBConnector(dbURL, credentials, dbName)
while(!db_connector.connected){
    console.log('Waiting for Database Connection')
    await wait(1000);
}

let ingredientName = "b"
const foundRecipes = await db_connector.searchIngredients(ingredientName);
console.log(foundRecipes);


db_connector.disconnect()
