import Ingredient  from "./ingredients.js"

export default class Recipe{
    constructor(name, ingredientsList, steps, servings, timeInfo){
        this.name = name;
        this.ingredientsList = ingredientsList;
        this.steps = steps;
        this.servings = servings;
        this.timeInfo = timeInfo;
    }

    getName(){
        return this.name
    }

    getIngredients(){
        return this.ingredientsList
    }

    getSteps(){
        return this.steps
    }

    getServingss(){
        return this.servings
    }
    
    getTimeInfo(){
        return this.timeInfo
    }

    static fromJSON(jsonObj) {
        let recipe = new Recipe(jsonObj.name,
                          jsonObj.ingredientsList,
                          jsonObj.steps,
                          jsonObj.servings,
                          jsonObj.timeInfo
        );
        Object.assign(recipe, jsonObj);
        return recipe;
    }
    
    toJSON(){
        return {
            'name': this.name,
            'ingredientsList': this.ingredientsList,
            'steps': this.steps,
            'servings': this.servings,
            'timeInfo': this.timeInfo
        };
    }
}