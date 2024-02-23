export class Name{
    constructor(firstName, middleName= '', lastName){
        if (typeof firstName !== "string") {
            throw new Error("Value first name is type: " + typeof(firstName) + ". Expected type string.");
          }
        else{
            this.firstName = firstName
        }
        if (typeof middleName !== "string") {
            throw new Error("Value first name is type: " + typeof(middleName) + ". Expected type string.");
          }
        else{
            this.middleName = middleName
        }
        if (typeof lastName !== "string") {
            throw new Error("Value first name is type: " + typeof(lastName) + ". Expected type string.");
          }
        else{
            this.lastName = lastName
        }
    }

    getName(){
        return {
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName
        }
    }

    print(){
        return this.firstName + " " + this.middleName + " " + this.lastName
    }

}