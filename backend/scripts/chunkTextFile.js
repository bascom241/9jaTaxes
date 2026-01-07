import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Chunk from "../models/Chunk.js"; // you can rename this model later

dotenv.config();

// 🔹 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 MongoDB connection
const mongoUrl = process.env.mongo_url || "mongodb://localhost:27017/9jaTaxes";
await mongoose.connect(mongoUrl);
console.log("MongoDB connected");

async function saveFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const fileName = path.basename(filePath);

    // Remove old version if it exists
    await Chunk.deleteMany({ fileName });

    await Chunk.create({
        fileName,
        content
    });

    console.log(`${fileName} saved successfully`);
}

async function run() {
    const basePath = path.join(__dirname, "../texts");

    await saveFile(path.join(basePath, "tax1.txt"));
    await saveFile(path.join(basePath, "tax2.txt"));

    console.log("All files saved");
    await mongoose.disconnect();
    process.exit(0);
}

run();
