// context/SocketContext.tsx (updated)
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
  subscription: {
    canSend: boolean;
    freeMessagesUsed: number;
    maxFreeMessages: number;
    isSubscribed: boolean;
    isLoading: boolean;
  };
  checkSubscriptionStatus: () => void;
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
  
  // Add subscription state
  const [subscription, setSubscription] = useState({
    canSend: true,
    freeMessagesUsed: 0,
    maxFreeMessages: 5,
    isSubscribed: false,
    isLoading: true
  });

  // Check subscription status
  const checkSubscriptionStatus = () => {
    if (user?._id && socketRef.current?.connected) {
      socketRef.current.emit("check_message_limit", { userId: user._id });
    }
  };

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
      // Check subscription status when connected
      checkSubscriptionStatus();
    });

    socket.on(
      "receive_answer",
      (data: { 
        answer: string; 
        source?: string; 
        chatSessionId: string;
        freeMessagesUsed?: number;
        maxFreeMessages?: number;
        isSubscribed?: boolean;
        requiresPayment?: boolean;
      }) => {
        console.log("SocketContext: receive_answer event received:", data);

        // Handle payment required case
        if (data.requiresPayment) {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            { 
              sender: "bot", 
              text: data.answer,
              source: data.source 
            }
          ]);
          return;
        }

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

        // Update subscription info from response
        if (data.freeMessagesUsed !== undefined) {
          setSubscription(prev => ({
            ...prev,
            freeMessagesUsed: data.freeMessagesUsed || 0,
            maxFreeMessages: data.maxFreeMessages || 5,
            isSubscribed: data.isSubscribed || false,
            canSend: data.isSubscribed || (data.freeMessagesUsed || 0) < 5,
            isLoading: false
          }));
        }

        console.log("SocketContext: messages updated:", messages);
      }
    );

    // Listen for message limit info
    socket.on("message_limit_info", (data: any) => {
      console.log("SocketContext: message_limit_info received:", data);
      setSubscription({
        canSend: data.canSend,
        freeMessagesUsed: data.freeMessagesUsed,
        maxFreeMessages: data.maxFreeMessages,
        isSubscribed: data.isSubscribed,
        isLoading: false
      });
    });

    return () => {
      console.log("SocketContext: cleaning up socket listeners");
      socket.off("connect");
      socket.off("receive_answer");
      socket.off("message_limit_info");
      disconnectSocket();
    };
  }, [user, manualSession]);

  // Check subscription when user changes
  useEffect(() => {
    if (user?._id) {
      checkSubscriptionStatus();
    }
  }, [user?._id]);

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
            { sender: "bot", text: "Hi 👋 I'm TaxBot. How can I help you today?" },
          ]);
        }
      } catch (err) {
        console.error("SocketContext: Failed to fetch chat sessions:", err);
        setMessages([
          { sender: "bot", text: "Hi 👋 I'm TaxBot. How can I help you today?" },
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
        { sender: "bot", text: "Hi 👋 I'm TaxBot. How can I help you today?" },
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
        { sender: "bot", text: "Hi 👋 I'm TaxBot. How can I help you today?" },
      ]);
    }
  };

  const sendMessage = (text: string) => {
    console.log("SocketContext: sendMessage called with:", text);
    
    // Check subscription before sending
    if (!subscription.canSend && !subscription.isSubscribed) {
      console.log("SocketContext: Message limit reached, cannot send");
      // Add a message to chat about limit reached
      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: "Daily message limit reached. Please upgrade to continue chatting." 
        }
      ]);
      return;
    }
    
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
      value={{ 
        messages, 
        sendMessage, 
        isTyping, 
        chatSessionId, 
        loadSession,
        subscription,
        checkSubscriptionStatus
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};