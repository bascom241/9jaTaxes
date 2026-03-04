import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/connectDb.js";
import userRouter from "./routes/userRouter.js";
import articleRouter from "./routes/articleRouter.js";
import categoryRouter from "./routes/articleCategoryRouter.js";
import chatRouter from "./routes/chat.js";
import paymentRouter from "./routes/paymentRouter.js";
import { setupSocket } from "./lib/socket.js";
import bodyParser from "body-parser";
import { verifyPayment } from "./controllers/payment.js"; // webhook handler
import dashboardRouter from "./routes/dashboardRouter.js"
import settingRouter from "./routes/settingsRouter.js"
dotenv.config();

const app = express();

// --- Normal JSON parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5000",
      "https://9ja-taxes-9c4e.vercel.app",
      "https://www.9jataxes.com",
      "https://9jataxesadmin.pxxl.click"
    ],

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --- Routers ---
app.use("/api", userRouter);
app.use("/api/article", articleRouter);
app.use("/api/category", categoryRouter);
app.use("/api/chat", chatRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", dashboardRouter)
app.use("/api/settings", settingRouter)
// --- Webhook route (raw body required for Paystack) ---
app.post(
  "/api/payments/webhook",
  bodyParser.raw({ type: "application/json" }),
  verifyPayment
);


// --- HTTP server + sockets ---
const server = http.createServer(app);
setupSocket(server);

// --- Connect DB and start server ---
connectDb();
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
