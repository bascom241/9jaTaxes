import express from "express"

import http from "http";
import dotenv from "dotenv"
import { connectDb } from "./utils/connectDb.js";
import userRouter from "./routes/userRouter.js"
import articleRouter from "./routes/articleRouter.js"
import categoryRouter from "./routes/articleCategoryRouter.js"
import cors from "cors"
import app from "./app.js"
import { setupSocket } from "./lib/socket.js";
import chatRouter from "./routes/chat.js"
dotenv.config();
app.use(express.json());

app.options("*", cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://9ja-taxes-9c4e.vercel.app","https://9ja-taxes-9c4e.vercel.app/", "https://www.9jataxes.com", "https://www.9jataxes.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Optional: parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRouter)
app.use("/api/article", articleRouter)
app.use("/api/category", categoryRouter)
app.use("/api/chat", chatRouter)

const server = http.createServer(app);

setupSocket(server);

const port = process.env.PORT || 3000
connectDb();
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})  