import { Request, Response } from "express";
import { asynchandler } from "../utils/asynchandler";
import { Investmentor } from "../models/Investmentor.model";
import { ApiResponse } from "../utils/ApiResponse";
import { statuscodes } from "../constants";
import {GoogleGenerativeAI} from "@google/generative-ai"
import { User } from "../models/User.models";
import { SendMail } from "../utils/SendMail";
import { creditExhaustTemplate } from "../Emailtemplates/CreditExhausted.mail";





export const Searchcontrol=asynchandler(async(req:Request,res:Response)=>{
    // take data from database
    // take prompt from user by req.body
    // make call to gemini
    // deduct the coin
    // if error raise
    // return the response
    // reason to call the gemini is that if there is an error in updating the credit the response will not be shown to the user however if we use frontend then there is a chance of response to user without credit deduction

    const {prompt}=req.body;
    try {
        const user=req.user;
        if(!user){
            
            return res.status(statuscodes.BADREQUEST).json(new ApiResponse(statuscodes.BADREQUEST,{},"Unauthorized Request"));
        }
        if(user.credits<=0){
            await SendMail(user.email,"Low Credit Warning",creditExhaustTemplate(user.email))
            return res.status(statuscodes.BADREQUEST).json(new ApiResponse(statuscodes.BADREQUEST,{},"Your credits are exhausted. Please check your email to recharge"));
        }
        const data=await Investmentor.find({});
        //taking all the data from the database
        if (!data){
            return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while fetching data from database"));
        }
        const gprompt = `Act as a data insighter and give the appropriate response to the following query based on the data provided below.
    Example:
    Input: We are a video OTT platform, currently seeking an investor to fuel company growth.
    Output: Honia.
    Here's how you will generate the response:
    Query: ${prompt}
    Data: ${JSON.stringify(data, null, 2)}`;

            const genAi=new GoogleGenerativeAI(process.env.GPTKEY!)
            const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(gprompt);
            if(!result){
                return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while generating response"));
            }            
            console.log(result.response.text());
        
        const updateduser=await User.findByIdAndUpdate(user._id,{
            $inc:{
                "credits":-1
            }},{ new: true})
        if(!updateduser){
            return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while handling credits"));
        }
        res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,result,"Response generated Successfully"))

            

    } catch (err:any) {
        return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Internal Server Error"));
    }
})

