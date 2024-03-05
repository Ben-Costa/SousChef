export default class Ingredient {
    constructor(ingredientName, integrientTypeInfo, measurementInfo, nutrientsInfo, costInfo){
        ingredientName = this.name
        integrientTypeInfo = this.integrientTypeInfo
        measurementInfo = this.measurementInfo
        nutrientsInfo = this.nutrientsInfo
        costInfo = this.costInfo
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

}