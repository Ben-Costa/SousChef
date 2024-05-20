export default class Ingredient {
    constructor(ingredientName, integrientTypeInfo, measurementInfo, nutrientsInfo, costInfo){
        this.ingredientName = ingredientName
        this.integrientTypeInfo = integrientTypeInfo
        this.measurementInfo = measurementInfo
        this.nutrientsInfo = nutrientsInfo
        this.costInfo = costInfo
    }

    getName(){
        return this.ingredientName
    }

    getType(){
        return this.integrientTypeInfo
    }

    getMeasurementInfo(){
        return this.ingredientName
    }

    getnutrientsInfo(){
        return this.nutrientsInfo
    }

    getCostInfo(){
        return this.costInfo
    }

    static fromJSON(jsonObj){
        return new Ingredient(jsonObj.ingredientName, jsonObj.integrientTypeInfo, jsonObj.measurementInfo, jsonObj.nutrientsInfo, jsonObj.costInfo)
    }

    toJSON(){
        return {
            'ingredientName': this.ingredientName,
            'integrientTypeInfo': this.integrientTypeInfo,
            'measurementInfo': this.measurementInfo,
            'nutrientsInfo': this.nutrientsInfo,
            'costInfo': this.costInfo
        }
    }

}