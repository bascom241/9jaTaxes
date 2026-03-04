// routes/settingsRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { 
  getSettings, 
  updateNotificationSettings, 
  updateTheme,
  changePassword 
} from "../controllers/settings.js";

const router = express.Router();

router.get("/", verifyToken, getSettings);
router.put("/notifications", verifyToken, updateNotificationSettings);
router.put("/theme", verifyToken, updateTheme);


export default router;