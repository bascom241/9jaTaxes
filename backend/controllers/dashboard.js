import Article from "../models/articleSchema.js"
import ArticleCategory from "../models/articleCategorySchema.js"
import User from "../models/userSchema.js";

export const getUserStats = async (req, res) => {
    try {
        const total = await User.countDocuments();
        
        // Get user growth by month
        const growth = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            total,
            growth: growth.map(item => ({
                month: item._id,
                users: item.count
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getArticleStats = async (req, res) => {
    try {
        const total = await Article.countDocuments();
        
        // Get recent articles
        const recent = await Article.find()
            .populate("articleCategory", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        // Get articles by month
        const byMonth = await Article.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            total,
            recent,
            byMonth: byMonth.map(item => ({
                month: item._id,
                count: item.count
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const total = await ArticleCategory.countDocuments();
        
        // Get popular categories with article count
        const popular = await ArticleCategory.aggregate([
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "articleCategory",
                    as: "articles"
                }
            },
            {
                $project: {
                    name: 1,
                    count: { $size: "$articles" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            total,
            popular
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCommentStats = async (req, res) => {
    try {
        const result = await Article.aggregate([
            { $unwind: "$comments" },
            { $count: "total" }
        ]);

        const total = result[0]?.total || 0;

        res.json({
            success: true,
            total
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};