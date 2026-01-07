import express from "express"
import { registerationValidation, loginValidation} from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { register, login, getUser  } from "../controllers/auth.js";
const router = express.Router();


router.post("/register", registerationValidation, validate, register)
router.post("/login", loginValidation, validate,login )
router.get("/user",verifyToken, getUser )
export default router