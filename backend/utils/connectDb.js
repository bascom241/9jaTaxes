import dotenv from "dotenv"
import mongoose from "mongoose"
export const connectDb = async () => {
    const url = process.env.mongo_url;
    if (!url) {
        console.log("Url could not be found")
        return
    }
    try {
        await mongoose.connect(url);
        console.log("Connected to Database")
    } catch (error) {
        console.log(error)
    }
}