import { Send } from "lucide-react";
import { use, useState, useEffect } from "react";
import { useSocket } from "../../../hooks/useSocket"
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";
const ChatInput = () => {
    const [text, setText] = useState("");
    const { sendMessage } = useSocket();
    const { user, getUser } = useAuthStore()
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchUser = async () => {
            await getUser();
            setLoading(false);
        };
        fetchUser();
    }, [getUser]);

    const handleSend = () => {
        if (!user) {
            toast.error("You have to login to Chat")
            return
        }
        sendMessage(text);
        setText("");
    };

    return (
        <div className="w-full flex items-center gap-4 py-6 px-8">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                type="text"
                placeholder="Type your message..."
                className="w-[90%] p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            />

            <Send
                size={38}
                color="green"
                className="cursor-pointer"
                onClick={handleSend}
            />
        </div>
    );
};

export default ChatInput;
