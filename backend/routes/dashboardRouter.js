// routes/dashboardRoutes.js
import express from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRoles } from "../middlewares/role.js";
import { 
    getUserStats, 
    getArticleStats, 
    getCategoryStats, 
    getCommentStats 
} from "../controllers/dashboard.js";

const router = express.Router();

// All dashboard routes are protected and only accessible by admin
router.get("/users/stats", verifyToken, verifyRoles(["admin"]), getUserStats);
router.get("/articles/stats", verifyToken, verifyRoles(["admin"]), getArticleStats);
router.get("/categories/stats", verifyToken, verifyRoles(["admin"]), getCategoryStats);
router.get("/comments/stats", verifyToken, verifyRoles(["admin"]), getCommentStats);

export default router;