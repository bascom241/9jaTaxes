// src/context/SocketContext.tsx
import { createContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { connectSocket, disconnectSocket } from "../lib/socket";
import type { Socket } from "socket.io-client";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "../../store/authStore";

export type Message = {
  sender: "user" | "bot";
  text: string;
  source?: string;
};

export type SocketContextType = {
  messages: Message[];
  sendMessage: (text: string) => void;
  isTyping: boolean;
  chatSessionId: string | null;
  loadSession: (sessionId: string | null) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [manualSession, setManualSession] = useState(false); // tracks manual selection

  // Initialize socket once
  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on(
      "receive_answer",
      (data: { answer: string; source?: string; chatSessionId: string }) => {
        setIsTyping(false);

        setChatSessionId((currentSessionId) => {
          // Only auto-update session if user hasn't selected manually
          return manualSession ? currentSessionId : data.chatSessionId;
        });

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.answer, source: data.source },
        ]);
      }
    );

    return () => {
      socket.off("connect");
      socket.off("receive_answer");
      disconnectSocket();
    };
  }, [user, manualSession]);

  // Fetch last session on mount (only once)
  useEffect(() => {
    if (!user) return;

    const fetchLastSession = async () => {
      try {
        const res = await axiosInstance.get(`/chat/sessions/${user._id}`);
        const sessions = res.data;

        if (sessions.length > 0) {
          const lastSession = sessions[0];
          setChatSessionId(lastSession._id);

          const msgRes = await axiosInstance.get(
            `/chat/sessions/${lastSession._id}/messages`
          );
          const msgs: Message[] = msgRes.data.map((m: any) => ({
            sender: m.role === "USER" ? "user" : "bot",
            text: m.content,
            source: m.source,
          }));
          setMessages(msgs);
        } else {
          setMessages([
            { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch chat sessions:", err);
        setMessages([
          { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
        ]);
      }
    };

    fetchLastSession();
  }, [user]);

  // Load a session manually
  const loadSession = async (sessionId: string | null) => {
    if (!user) return;

    setManualSession(true); // mark that user selected manually
    setChatSessionId(sessionId);
    setIsTyping(false);

    if (!sessionId) {
      setMessages([
        { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
      ]);
      return;
    }

    try {
      const res = await axiosInstance.get(`/chat/sessions/${sessionId}/messages`);
      const msgs: Message[] = res.data.map((m: any) => ({
        sender: m.role === "USER" ? "user" : "bot",
        text: m.content,
        source: m.source,
      }));
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load session messages:", err);
      setMessages([
        { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
      ]);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !socketRef.current || !user) return;

    // Add user message locally
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    // Send to server
    socketRef.current.emit("ask_question", {
      question: text,
      userId: user._id,
      chatSessionId, // null if first message
    });
  };

  return (
    <SocketContext.Provider
      value={{ messages, sendMessage, isTyping, chatSessionId, loadSession }}
    >
      {children}
    </SocketContext.Provider>
  );
};
