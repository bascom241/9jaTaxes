import { Send } from 'lucide-react';
const ChatInput = () => {
    return (
        <div className="w-full flex items-center gap-4 py-8 px-8 ">
            <input
                type="text"
                placeholder="Type your message..."
                className="w-[90%] p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            />

            <Send size={38} color="green"/>

        </div>
    );
};

export default ChatInput;
