import mongoose, { mongo } from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully")
        })

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = "resume-builder";


        if (!mongodbURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        if (mongodbURI.endsWith("/")) {
            mongodbURI = mongodbURI.slice(0, -1);
        }

        await (mongoose.connect(`${mongodbURI}/${projectName}`))

    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}


export default connectDB;
