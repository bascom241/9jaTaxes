import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Chunk from "../models/Chunk.js";

dotenv.config();

// 🔹 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 MongoDB connection
const mongoUrl = process.env.mongo_url || "mongodb://localhost:27017/9jaTaxes";
await mongoose.connect(mongoUrl);
console.log("MongoDB connected");

// 🔹 Chunk helper
function chunkText(text, chunkSize = 2000) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        chunks.push(text.slice(start, start + chunkSize));
        start += chunkSize;
    }

    return chunks;
    
}

async function saveFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const fileName = path.basename(filePath);

    // 🔴 Remove old chunks for this file
    await Chunk.deleteMany({ fileName });

    const chunks = chunkText(content);

    const docs = chunks.map((chunk, index) => ({
        fileName,
        content: chunk,
        chunkIndex: index
    }));

    await Chunk.insertMany(docs);

    console.log(`${fileName} saved in ${chunks.length} chunks`);
}

async function run() {
    const basePath = path.join(__dirname, "../texts");

    await saveFile(path.join(basePath, "tax1.txt"));
    await saveFile(path.join(basePath, "tax2.txt"));

    console.log("All files chunked & saved");
    await mongoose.disconnect();
    process.exit(0);
}

run();
