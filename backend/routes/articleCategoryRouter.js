import express from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import { createArticleCategory } from "../controllers/articleCategory.js";
import { verifyRoles } from "../middlewares/role.js";

const router = express.Router();

router.post("/create", verifyToken, verifyRoles(["admin"]), createArticleCategory )

export default router