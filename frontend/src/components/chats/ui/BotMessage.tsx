import { Bot } from "lucide-react";

const BotMessage = ({ message }: any) => {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-full">
                <Bot className="w-5 h-5 text-green-700" />
            </div>

            <div className="bg-gray-100 p-3 rounded-xl max-w-[70%]">
                <p className="text-sm text-gray-800">{message}</p>
            </div>
        </div>
    );
};

export default BotMessage;
