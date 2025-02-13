import { statuscodes } from "../constants";

export class ApiResponse {
    statusCode:statuscodes;
    data:any;
    message:string;
    constructor(statusCode:statuscodes, data:any, message:string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}