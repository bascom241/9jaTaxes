import ChatSession from "../models/chatSessionSchema.js";
import { Message}  from "../models/messageSchema.js";
import { generateResponse } from "../services/responseGenration.js";

export const handleChatEvents = (io, socket) => {
  socket.on("ask_question", async ({ question, userId, chatSessionId }) => {
    try {
      let sessionId = chatSessionId;

      // create session if it doesn't exist
      if (!sessionId) {
        const newSession = await ChatSession.create({
          userId,
          title: question.slice(0, 30) || "New Chat",
        });
        sessionId = newSession._id;
      }

      // save USER message
      await Message.create({
        chatSessionId: sessionId,
        role: "USER",
        content: question,
      });

      // generate AI response
      const answer = await generateResponse(question);

      // save AI message
      await Message.create({
        chatSessionId: sessionId,
        role: "AI",
        content: answer.answer,
      });

      // send to frontend with sessionId
      socket.emit("receive_answer", {
        ...answer,
        chatSessionId: sessionId,
      });
    } catch (error) {
      console.error(error);
      socket.emit("receive_answer", {
        source: "general",
        answer: "Something went wrong.",
      });
    }
  });
};
