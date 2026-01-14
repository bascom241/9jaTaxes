import express from "express";
import ChatSession from "../models/chatSessionSchema.js";
import { Message } from "../models/messageSchema.js";

const router = express.Router();


router.get("/sessions/:userId", async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.params.userId }).sort({
      updatedAt: -1,
    });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

router.get("/sessions/:sessionId/messages", async (req, res) => {
  try {
    const messages = await Message.find({ chatSessionId: req.params.sessionId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
