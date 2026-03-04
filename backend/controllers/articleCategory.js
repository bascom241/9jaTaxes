import slugify from "slugify";
import ArticleCategory from "../models/articleCategorySchema.js"
import Article from "../models/articleSchema.js"
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


export const getAllCategories = async (req, res) => {
    try {
        const categories = await ArticleCategory.find()
            .select("name slug createdAt")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch categories" 
        });
    }
};

// Get single category by ID
export const getSingleCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({ 
                success: false, 
                message: "Category ID is required" 
            });
        }

        const category = await ArticleCategory.findById(categoryId);

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch category" 
        });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: "Category name is required" 
            });
        }

        const slug = slugify(name, { lower: true, strict: true });

        const category = await ArticleCategory.findByIdAndUpdate(
            categoryId,
            { name, slug },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        console.log(error);

        if (error && error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Category already exists" 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Failed to update category" 
        });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Check if category has articles
        const articlesCount = await Article.countDocuments({ 
            articleCategory: categoryId 
        });

        if (articlesCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot delete category. It has ${articlesCount} articles associated with it.` 
            });
        }

        const category = await ArticleCategory.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete category" 
        });
    }
};