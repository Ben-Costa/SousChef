import  Name  from "./name.js"

export default class User{
    constructor(userName, password, email, bDay, nameObj, profilePic){
        this.userName = userName
        this.password = password
        this.email = email
        this.bDay = bDay
        this.nameObj = nameObj
        this.profilePic = profilePic
    }

    getName(){
        return this.nameObj
    }

    getUserName(){
        return this.userName
    }

    getPassword(){
        return this.password
    }

    getEmail(){
        return this.email
    }

    getBDay(){
        return this.bDay
    }

    getProfilePic(){
        return this.profilePic
    }

    static fromJSON(jsonObj){
        return new User(jsonObj.userName, jsonObj.password, jsonObj.email, jsonObj.bDay, jsonObj.nameObj, jsonObj.profilePic)
    }

    toJSON(){
        return {
            'userName': this.userName,
            'password': this.password,
            'email': this.email,
            'bDay': this.bDay,
            'nameObj': this.nameObj,
            'profilePic': this.profilePic
        }
    }
}