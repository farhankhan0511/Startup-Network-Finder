import { Request,Response,NextFunction } from "express"

export const asynchandler=(requesthandler:any)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(requesthandler(req,res,next))
        .catch((err)=>next(err))
    }
}