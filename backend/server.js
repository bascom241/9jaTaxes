import express from "express"
import app from "./app.js";
import dotenv from "dotenv"
import { connectDb } from "./utils/connectDb.js";
import userRouter from "./routes/userRouter.js"
import articleRouter from "./routes/articleRouter.js"
import categoryRouter from "./routes/articleCategoryRouter.js"
import cors from "cors"
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Optional: parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRouter)
app.use("/api/article", articleRouter)
app.use("/api/category", categoryRouter)



const port = process.env.PORT || 3000
connectDb();
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})