import ChatSession from "../models/chatSessionSchema.js";
import { Message } from "../models/messageSchema.js";
import { generateResponse } from "../services/responseGenration.js";
import User from "../models/userSchema.js";

export const handleChatEvents = (io, socket) => {
    socket.on("ask_question", async ({ question, userId, chatSessionId }) => {
        try {
            // Get user and check message limit
            const user = await User.findById(userId);
            if (!user) {
                socket.emit("receive_answer", {
                    source: "error",
                    answer: "User not found. Please login again."
                });
                return;
            }
            
            // Check if user can send message
            if (!user.canSendMessage()) {
                socket.emit("receive_answer", {
                    source: "limit_reached",
                    answer: `Daily free limit reached (5 messages). Please subscribe for unlimited access.`,
                    requiresPayment: true,
                    freeMessagesUsed: user.freeMessagesUsed,
                    maxFreeMessages: 5
                });
                return;
            }
            
            let sessionId = chatSessionId;
            
            // Create session if it doesn't exist
            if (!sessionId) {
                const newSession = await ChatSession.create({
                    userId,
                    title: question.slice(0, 30) || "New Chat",
                });
                sessionId = newSession._id;
            }
            
            // Save USER message
            await Message.create({
                chatSessionId: sessionId,
                role: "USER",
                content: question,
            });
            
            // Generate AI response
            const answer = await generateResponse(question);
            
            // Save AI message
            await Message.create({
                chatSessionId: sessionId,
                role: "AI",
                content: answer.answer,
            });
            
            // Record message usage
            await user.recordMessage();
            
            // Send to frontend with sessionId
            socket.emit("receive_answer", {
                ...answer,
                chatSessionId: sessionId,
                freeMessagesUsed: user.freeMessagesUsed,
                maxFreeMessages: 5,
                isSubscribed: user.hasActiveSubscription
            });
            
        } catch (error) {
            console.error("Chat error:", error);
            socket.emit("receive_answer", {
                source: "error",
                answer: "Something went wrong. Please try again.",
            });
        }
    });
    
    // Add a new event to check message status
    socket.on("check_message_limit", async ({ userId }) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                socket.emit("message_limit_info", {
                    canSend: false,
                    message: "User not found"
                });
                return;
            }
            
            const canSend = user.canSendMessage();
            socket.emit("message_limit_info", {
                canSend: canSend,
                freeMessagesUsed: user.freeMessagesUsed,
                maxFreeMessages: 5,
                isSubscribed: user.hasActiveSubscription,
                subscriptionExpiresAt: user.subscriptionExpiresAt,
                message: canSend ? 
                    `You have ${5 - user.freeMessagesUsed} free messages left today` :
                    "Daily limit reached. Subscribe for unlimited access."
            });
            
        } catch (error) {
            console.error("Check limit error:", error);
        }
    });
};