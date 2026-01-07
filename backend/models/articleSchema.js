import mongoose from "mongoose";
import { generateArticleSummary } from "../services/summmaryGenerationAiService.js";

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Article Title is Required"],
    },
    description: {
        type: String,
        required: [true, "Article Description is Required"]
    },
    content: {
        type: String,
        required: [true, "Article Content is Required"]
    },

    timeTaken: {
        type: Number
    },
    articleCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Arcticle Category is required"]
    },
    articleSummary: {
        main: {
            type: String,
            required: true
        },
        length: {
            type: Number,
            required: true
        }
    },
    comments: [
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User", 
                required:[true, "commentator userId is required"]
            },
            comment: {
                type:String ,
                required:[true,"comment content is required"]
            }
        }
    ]

    


}, { timestamps: true })

articleSchema.pre("save", async function (next) {

    try {


        if (!this.isModified("content")) return next();

        const wordsPerMinute = 200;
        const wordCount = this.content.trim().split(/\s+/).length;
        this.timeTaken = Math.ceil(wordCount / wordsPerMinute)

        
    } catch (error) {
        console.log(error);
    }

})


export default mongoose.model("Article", articleSchema)