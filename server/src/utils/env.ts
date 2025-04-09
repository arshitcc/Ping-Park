import dotenv from "dotenv";

dotenv.config();

export const { 
    MONGODB_URL, 
    PORT, DB_NAME, 
    NODE_ENV, 
    CORS_ORIGIN,

    ACCESS_TOKEN_SECRE,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    
    CLOUDINARY_CLOUD_NAME, 
    CLOUDINARY_API_KEY, 
    CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER_NAME

} = process.env;
