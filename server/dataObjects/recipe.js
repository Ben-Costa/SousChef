import Ingredient  from "./ingredients.js"

export default class Recipe{
    constructor(name, ingredientsList, steps, servings, timeInfo){
        name = this.name
        ingredientsList = this.ingredientsList
        steps = this.steps
        servings = this.servings
        timeInfo = this.timeInfo
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
}