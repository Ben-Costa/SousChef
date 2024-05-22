import dotenv from 'dotenv';
dotenv.config();
import mongoDBConnector from './server/databaseConnector/mongoConnector/mongoConnector.js';
import User from './server/dataObjects/user.js';
import Name from './server/dataObjects/name.js';
import Ingredient from './server/dataObjects/ingredients.js';
import Recipe from './server/dataObjects/recipe.js';
import { wait } from './utils/helperFunctions.js'

async function main() {

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
    
    let redChickenThighsName = 'Red Chicken Thighs'
    let redChickenThighs = new Recipe(redChickenThighsName,
    [],
    [],
    3,
    "3hr 10 min");
    await db_connector.createRecipe([redChickenThighs]);

    // search for the recipe
    let chickenRecipes = await db_connector.searchRecipes("Red Chicken", []);
    if (chickenRecipes.length < 1) {
        console.log("error: no recipes found");
    }
    else {
        for (const recipe of chickenRecipes) {
            console.log(recipe._id);
        }
    }

    // search for the chicken recipe
    let searchedChickenRecipes = await db_connector.searchRecipes(redChickenThighsName);
    if (searchedChickenRecipes.length < 1) console.log("error: failed to search for chicken recipe");

    // update the chicken recipe
    let modifiedChickenRecipe = searchedChickenRecipes[0];
    modifiedChickenRecipe.name = 'Fascinating Red Chicken Recipe';
    modifiedChickenRecipe.servings = 3;
    db_connector.updateRecipe(modifiedChickenRecipe);
    
    // delete the recipe
    let deleted = false;
    // deleted = await db_connector.deleteRecipe(redChickenThighsName);
    if (!deleted) {
        console.log("Failed to delete \"" + redChickenThighs + "\"");
    }

    // delete all recipes of the same name
    const deleteAllChickens = async () => {
        return await db_connector.deleteRecipe(redChickenThighsName);
    };
    while (await deleteAllChickens()) {
        // left intentionally empty
    }
        
    await db_connector.disconnect();
    
}

main();
