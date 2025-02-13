import mongoose from "mongoose"
import { DB_NAME } from "../constants";
export const DBConnect=async()=>{
try {
      console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
        const Connection=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`${Connection.connection.host}`)
    }
 catch (error) {
   console.error("Error Connecting to the mogodb server",error);
   process.exit(1);
}
}

