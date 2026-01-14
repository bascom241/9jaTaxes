import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "userId is required"]
    },
    title:{
        type:String,
        required: [true, "chat session is required"],
        default:"New Chat"
    }

},{timestamps:true})


export default  mongoose.model("ChatSession", chatSessionSchema)