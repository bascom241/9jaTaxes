import express from "express";
import {
  createNews,
  getAllNews,
  approveNews,
} from "../controllers/news.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRoles } from "../middlewares/role.js";

const router = express.Router();

router.post("/", verifyToken, verifyRoles("admin"), createNews);
router.get("/", getAllNews);
router.put("/approve/:id", verifyToken, verifyRoles("admin"), approveNews);

export default router;