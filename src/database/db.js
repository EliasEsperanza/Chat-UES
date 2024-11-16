import { connect } from "mongoose";
import { URI } from "../config.js";

export const connectDB = async () => {
    try {
        await connect(URI)
        console.log("MongoDB connected")
    }catch(err){
        console.error(err)
    }
}