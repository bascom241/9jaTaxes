import express from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRoles } from "../middlewares/role.js";

import { createArticle, getAllArticles, getSingleArticle, updateArticle, fetchArticleByCategory, commentOnAnArticle, deleteComment, editComment} from "../controllers/article.js";
const router = express.Router();

router.get("/all", getAllArticles)
router.post("/create", verifyToken, verifyRoles(["admin"]), createArticle)
router.get("/single-article/:articleId",  getSingleArticle)
router.put("/update-article/:articleId", verifyToken, verifyRoles(["admin"]),updateArticle)
router.get("/get-article-category/:catId",fetchArticleByCategory )
router.post("/comment/:articleId", verifyToken,commentOnAnArticle)
router.put("/delete-comment/:articleId", verifyToken, deleteComment)
router.put("/update-comment/:articleId", verifyToken,editComment )
export default router
