import BotMessage from "./ui/BotMessage";
import UserMessage from "./ui/UserMessage";

const ChatBody = () => {
    return (
        <div className="flex-1 w-full p-6 space-y-4 overflow-y-auto">
            <BotMessage message="Hi 👋 I’m TaxBot. How can I help you today?" />
            <UserMessage message="Explain VAT in Nigeria" />
            <BotMessage message="VAT in Nigeria is currently 7.5% applied to goods and services." />
        </div>
    );
};

export default ChatBody;
