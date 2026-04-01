import News from "../models/newSchema.js"

// CREATE NEWS
export const createNews = async (req, res) => {
  try {
    const news = await News.create({
      ...req.body,
      author: req.user.id, // from auth middleware
    });

    res.status(201).json({
      success: true,
      news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL NEWS (only approved)
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: APPROVE NEWS
export const approveNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};