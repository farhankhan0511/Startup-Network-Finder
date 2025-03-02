import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.models";
import { asynchandler } from "../utils/asynchandler";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

declare module "express-serve-static-core"{
    interface Request{
        user?:any;
    }
    }

export const authenticateOAuth=asynchandler(async(req: Request, res: Response, next: NextFunction) =>{
   
    if (req.isAuthenticated()) {
      return next();
    }   
    res.status(401).json({ message: "Not authenticated" });
  
})
