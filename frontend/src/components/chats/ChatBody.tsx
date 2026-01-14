import BotMessage from "./ui/BotMessage";
import UserMessage from "./ui/UserMessage";
import { useSocket } from "../../../hooks/useSocket";
import { useEffect, useRef } from "react";
import type { Message } from "../../context/SocketContext";

const ChatBody = () => {
    const { messages, isTyping } = useSocket();
   

    return (
        <div className="flex flex-col p-4 space-y-4 min-h-0">
            {messages.map((msg: Message, index: number) =>
                msg.sender === "bot" ? (
                    <BotMessage key={index} message={msg.text} />
                ) : (
                    <UserMessage key={index} message={msg.text} />
                )
            )}

            {isTyping && <BotMessage message="Typing..." />}
            
        </div>
    );
};

export default ChatBody;
