import express from "express";
import bodyParser from "body-parser";
import { 
  initializePayment, 
  verifyPayment, 
  verifyPaymentCallback 
} from "../controllers/payment.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router(); 

// --- Protected route for payment initialization ---
router.post("/initialize", verifyToken, initializePayment);

// --- Webhook route (no auth, raw body) ---
router.post("/webhook", bodyParser.raw({ type: "application/json" }), verifyPayment);

// --- Callback URL route ---
router.get("/verify", verifyPaymentCallback);

export default router;
