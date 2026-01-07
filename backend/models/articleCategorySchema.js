import mongoose from "mongoose";

const articleCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, lowercase: true, unique: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual field
articleCategorySchema.virtual("articles", {
    ref: "Article",                // The model to populate
    localField: "_id",             // Field in Category
    foreignField: "articleCategory", // Field in Article
    justOne: false                 // Return an array
});

export default mongoose.model("Category", articleCategorySchema);
