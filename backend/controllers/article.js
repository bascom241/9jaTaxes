import { generateArticleSummary } from "../services/summmaryGenerationAiService.js";
import Article from "../models/articleSchema.js"
import ArticleCategory from "../models/articleCategorySchema.js"
import mongoose from "mongoose";

export const createArticle = async (req, res) => {
    try {
        const { content, articleCategory, ...rest } = req.body;


        const categoryExits = await ArticleCategory.findById(articleCategory);
        if (!categoryExits) {
            return res.status(401).json({ success: "false", message: "Category does not exits " })
        }
        const summary = await generateArticleSummary(content);


        if (summary.length < 1) {
            return res.status(404).json({ message: "Could not generate Article Summary" });
        }


        const article = await Article.create({
            ...rest,
            content,
            articleCategory,
            articleSummary: summary
        });
        res.status(201).json({ success: true, data: article })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to Create Article" })
    }
}

export const getAllArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search, catId } = req.query;


        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ]
        }

        if (catId) {
            if (mongoose.Types.ObjectId.isValid(catId)) {
                query.articleCategory = new mongoose.Types.ObjectId(catId)
            } else {
                return res.status(500).json({ success: false, message: "Catergory id is not valid" })
            }
        }

        const sortOrder = order === "asc" ? 1 : -1
        const skip = (page - 1) * limit;

        const articles = await Article.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate("articleCategory", "name");


        const total = await Article.countDocuments();
        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalArticles: total,
            data: articles
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getSingleArticle = async (req, res) => {
    try {
        const { articleId } = req.params

        if (articleId === null || !articleId) {
            return res.status(401).json({ success: false, message: "Article Id is required" })
        }


        const article = await Article.findById(articleId)
            .populate("articleCategory", "name")
            .populate("comments.userId", "name")
            ;

        if (!article) {
            return res.status(401).json({ success: false, message: "Article Cant be found" })
        }

        res.status(200).json({
            success: true,
            data: article
        })
    } catch (err) {
        return res.status(500).json({ success: "false", err })
    }
}

export const updateArticle = async (req, res) => {
    try {
        const { articleId } = req.params;

        const { content, articleCategory, ...rest } = req.body

        if (articleId === null || !articleId) {
            return res.status(401).json({ success: false, message: "Article Id is required" })
        }

        const categoryExits = await ArticleCategory.findById(articleCategory);

        if (!categoryExits) {
            return res.status(401).json({ success: "false", message: "Category does not exits " })
        }


        const updatedArticle = await Article.findByIdAndUpdate(articleId, { content, articleCategory, ...rest }, { new: true, runValidators: true });

        if (!updateArticle) {
            return res.status(401).json({ success: false, message: "Article Not found" })
        }

        res.status(200).json({
            success: true,
            message: "Article Updated",
            data: updatedArticle
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({ success: false, err })
    }

}

export const fetchArticleByCategory = async (req, res) => {

    try {

        const { catId } = req.params

        if (!catId) {
            return res.status(401).json({ success: false, message: "Category does not exists" })
        }

        const recommendedArticles = await ArticleCategory.findById(catId)
            .populate({ path: "articles", select: "title timeTaken", options: { limit: 5 } });

        if (!recommendedArticles) {
            return res.status(401).json({ success: "false", message: "Recommended articles not found" })
        }

        res.status(200).json({
            success: true,
            data: recommendedArticles
        })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

export const commentOnAnArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { id } = req.user
        const { comment } = req.body;

        console.log(id, comment)

        if (!articleId) {
            return res.status(401).json({ success: false, message: "Article Id is required" })
        }

        if (!id || !comment) {
            return res.status(401).json({ success: false, message: "UserId or comment is required" })
        }


        const article = await Article.findByIdAndUpdate(articleId, { $push: { comments: { userId: id, comment } } }, { new: true, runValidators: true }).populate()

        if (!article) {
            return res.status(401).json({ success: false, message: "Could not find article" })
        }

        res.status(200).json({ success: true, data: article, message: "comment added" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
}

export const deleteComment = async (req, res) => {
    try {

        const { articleId } = req.params
        const { id } = req.user;
        const { commentId } = req.body


        const article = await Article.findOneAndUpdate({ _id: articleId, "comments._id": commentId, "comments.userId": id }, { $pull: { comments: { _id: commentId } } }, { new: true, runValidators: true });

        if (!article) {
            return res.status(401).json({ success: false, message: "you are not authorized" })
        }


        res.status(200).json({ success: true, data: article, message: "Comment deleted" });


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
}


export const editComment = async (req, res) => {
    try {
        const { articleId } = req.params
        const { id } = req.user;
        const { commentId, comment } = req.body;

        if (!articleId) {
            return res.status(404).json({ success: false, message: "ArticleId is required" })
        }

        const article = await Article.findOneAndUpdate({ _id: articleId, "comments._id": commentId, "comments.userId": id }, { $set: { "comments.$.comment":  comment  } }, { new: true, runValidators: true });

        if (!article) {
            return res.status(401).json({ success: false, message: "You are not authorized" })
        }
        
        res.status(200).json({ success: true, data: article, message: "Comment deleted" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
}