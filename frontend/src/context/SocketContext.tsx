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
  const [manualSession, setManualSession] = useState(false);

  // Connect socket only when user exists
  useEffect(() => {
    console.log("SocketContext: useEffect for socket connection triggered");
    if (!user) {
      console.log("SocketContext: no user yet, not connecting socket");
      return;
    }

    const socket = connectSocket();
    socketRef.current = socket;

    console.log("SocketContext: socket initialized, connecting...");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on(
      "receive_answer",
      (data: { answer: string; source?: string; chatSessionId: string }) => {
        console.log("SocketContext: receive_answer event received:", data);

        setIsTyping(false);

        setChatSessionId((currentSessionId) => {
          const newSession = manualSession ? currentSessionId : data.chatSessionId;
          console.log(
            "SocketContext: chatSessionId updated:",
            currentSessionId,
            "->",
            newSession
          );
          return newSession;
        });

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.answer, source: data.source },
        ]);

        console.log("SocketContext: messages updated:", messages);
      }
    );

    return () => {
      console.log("SocketContext: cleaning up socket listeners");
      socket.off("connect");
      socket.off("receive_answer");
      disconnectSocket();
    };
  }, [user, manualSession]);

  // Fetch last chat session on mount
  useEffect(() => {
    console.log("SocketContext: useEffect for fetching last session triggered");
    if (!user) {
      console.log("SocketContext: no user yet, skipping fetchLastSession");
      return;
    }

    const fetchLastSession = async () => {
      try {
        console.log("SocketContext: fetching last session for user", user._id);
        const res = await axiosInstance.get(`/chat/sessions/${user._id}`);
        const sessions = res.data;
        console.log("SocketContext: sessions fetched:", sessions);

        if (sessions.length > 0) {
          const lastSession = sessions[0];
          setChatSessionId(lastSession._id);
          console.log("SocketContext: lastSession set:", lastSession._id);

          const msgRes = await axiosInstance.get(
            `/chat/sessions/${lastSession._id}/messages`
          );
          const msgs: Message[] = msgRes.data.map((m: any) => ({
            sender: m.role === "USER" ? "user" : "bot",
            text: m.content,
            source: m.source,
          }));
          setMessages(msgs);
          console.log("SocketContext: messages loaded from session:", msgs);
        } else {
          console.log("SocketContext: no previous session, adding welcome message");
          setMessages([
            { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
          ]);
        }
      } catch (err) {
        console.error("SocketContext: Failed to fetch chat sessions:", err);
        setMessages([
          { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
        ]);
      }
    };

    fetchLastSession();
  }, [user]);

  // Load a session manually
  const loadSession = async (sessionId: string | null) => {
    console.log("SocketContext: loadSession called with:", sessionId);
    if (!user) return;

    setManualSession(true);
    setChatSessionId(sessionId);
    setIsTyping(false);

    if (!sessionId) {
      console.log("SocketContext: clearing messages for new session");
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
      console.log("SocketContext: messages loaded for session:", msgs);
    } catch (err) {
      console.error("SocketContext: Failed to load session messages:", err);
      setMessages([
        { sender: "bot", text: "Hi 👋 I’m TaxBot. How can I help you today?" },
      ]);
    }
  };

  const sendMessage = (text: string) => {
    console.log("SocketContext: sendMessage called with:", text);
    if (!text.trim() || !socketRef.current || !user) {
      console.log("SocketContext: sendMessage aborted, missing data or socket not connected");
      return;
    }

    // Add user message locally
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    console.log("SocketContext: emitting ask_question:", {
      question: text,
      userId: user._id,
      chatSessionId,
    });

    socketRef.current.emit("ask_question", {
      question: text,
      userId: user._id,
      chatSessionId,
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
