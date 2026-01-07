import mongoose from "mongoose"


const chunkSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:[true, "file name is required"]
    },
    content: {
        type:String,
        required:[true, "file content is required"]
    }
})


export default mongoose.model("Chunk", chunkSchema)