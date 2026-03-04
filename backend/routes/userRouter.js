import express from "express";
import {
  registerationValidation,
  loginValidation,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  register,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserSubscription,
  resetUserMessages,
} from "../controllers/auth.js";

import { changePassword } from "../controllers/settings.js";
import { joinWaitlist } from "../controllers/waitlist.js";
import { verifyRoles } from "../middlewares/role.js";
const router = express.Router();

router.post("/register", registerationValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/user", verifyToken, getUser);
router.post("/waitlist", joinWaitlist);
router.get("/get-all-users", verifyToken, verifyRoles("admin"), getAllUsers);

router.put("/change-password", verifyToken, changePassword)
router.put("/:userId", verifyToken, verifyRoles(["admin"]), updateUser);
router.delete("/:userId", verifyToken, verifyRoles(["admin"]), deleteUser);
router.patch(
  "/:userId/role",
  verifyToken,
  verifyRoles(["admin"]),
  updateUserRole,
);
router.patch(
  "/:userId/subscription",
  verifyToken,
  verifyRoles(["admin"]),
  updateUserSubscription,
);
router.post(
  "/:userId/reset-messages",
  verifyToken,
  verifyRoles(["admin"]),
  resetUserMessages,
);
;
export default router;
