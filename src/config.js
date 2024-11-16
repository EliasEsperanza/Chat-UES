import { config } from "dotenv";
config();

export const URI = process.env.MONGO_URI; 