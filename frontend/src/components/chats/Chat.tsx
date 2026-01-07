import Header from './ui/header'

import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
const Chat = () => {
    return (
        <main className="flex flex-col items-center w-[70%] h-full bg-white border-2 shadow-xl border-gray-300 rounded-2xl">
            <Header />
            <ChatBody />
            <ChatInput />
        </main>
    )
}

export default Chat
