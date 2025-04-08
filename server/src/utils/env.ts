import dotenv from "dotenv";

dotenv.config();

export const { 
    MONGODB_URL, 
    PORT, DB_NAME, 
    NODE_ENV, 
    CORS_ORIGIN,
    
   

} = process.env;
