// routes/categoryRoutes.js (update your existing file)
import express from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import { createArticleCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } from "../controllers/articleCategory.js";
import { verifyRoles } from "../middlewares/role.js";

const router = express.Router();

// Get all categories (for frontend dropdown and listing)
router.get("/all", getAllCategories);

// Get single category
router.get("/:categoryId", getSingleCategory);

// Create category (admin only)
router.post("/create", verifyToken, verifyRoles(["admin"]), createArticleCategory);

// Update category (admin only)
router.put("/:categoryId", verifyToken, verifyRoles(["admin"]), updateCategory);

// Delete category (admin only)
router.delete("/:categoryId", verifyToken, verifyRoles(["admin"]), deleteCategory);

export default router;