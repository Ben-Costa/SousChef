import  Name  from "./name.js"

export default class User{
    constructor(userName, password, email, bDay, name, profilePic){
        this.userName = userName
        this.password = password
        this.email = email
        this.bDay = bDay
        this.nameObj = nameObj
        this.profilePic = profilePic
    }

    getName(){
        return nameObj
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
}