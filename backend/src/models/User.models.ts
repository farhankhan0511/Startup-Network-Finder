import mongoose from "mongoose";

interface UserI{
    email:string,
    credits:number,
    refreshtoken:string |null
}
const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true,
    },
    
    credits:{
        type:Number,
        min:0,
        max:5,
        required:true,
        default:5

    },
    refreshtoken:{
        type:String,
        default:null
    }
},{timestamps:true})

export const User=mongoose.model<UserI>("User",UserSchema);