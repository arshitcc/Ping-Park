import mongoose from "mongoose";

async function connectDB () {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log(`DB connected successfully `, connectionInstance.connections[0].host);
    } catch (err) {
        console.error(`Unable to connect Database : `, err);
        process.exit();
    }
}

export default connectDB;