import slugify from "slugify";
import ArticleCategory from "../models/articleCategorySchema.js"


export const createArticleCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(404).json({ success: false, message: "Cateogy name is required" })
        }


        const slug = slugify(name, { lower: true, strict: true });


        const category = await ArticleCategory.create({
            name,
            slug
        });


        res.status(201).json({ success: true, message: "Catgory Created", data: category })


    } catch (error) {
        console.log(error);


        if (error && error.code === 11000) {
            return res.status(400).json({ success: false, message: "Category already exits" })
        }

        res.status(500).json({ success: false, message: "Failed to create category" });
    }

}
