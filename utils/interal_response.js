export class InternalServerResponse{
    constructor(name, code, msg, data){
        //Name types: DBConnectorResponse, 
        this.name = name
        this.msg = msg || ""
        this.code = code || 201
        this.data = data || ""
    }
}