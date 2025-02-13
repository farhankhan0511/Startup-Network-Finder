
import { statuscodes } from "../constants"

export class ApiError extends Error{
    statuscode:statuscodes;
    message:string;
    errors:any[];

    constructor(statuscode:statuscodes,message="something went wrong",errors:any[]=[],stack=""){
        super(message)
        this.statuscode=statuscode
        this.message=message
        this.errors=errors
        if(stack){

            this.stack=stack
        }
        else{Error.captureStackTrace(this,this.constructor)}
    }
}