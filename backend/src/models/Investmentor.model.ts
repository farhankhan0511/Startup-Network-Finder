import mongoose from "mongoose";


enum Type{
    Investor="Investor",
    Mentor="Mentor"
}
interface InvestmentorI{
    email:string,
    password:string,
    credits:number,
    refreshtoken?:string
}
const UserSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        trim:true,
    },
    Category:{
        type:String,
        required:true,
    },
    Type:{
        type:"String",
        enum:Object.values(Type)
        
    }
},{timestamps:true})

export const Investmentor=mongoose.model<InvestmentorI>("Investmentor",UserSchema);