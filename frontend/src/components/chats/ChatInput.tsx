// components/ChatInput.tsx
import { useState } from "react"
import { useSocket } from "../../../hooks/useSocket"
import { Send, Lock } from "lucide-react"

const ChatInput = () => {
    const { sendMessage, subscription } = useSocket()
    const [input, setInput] = useState("")
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!input.trim()) return
        
        // Check if user can send message
        if (!subscription.canSend && !subscription.isSubscribed) {
            return
        }
        
        sendMessage(input)
        setInput("")
    }
    
    const isLimitReached = !subscription.canSend && !subscription.isSubscribed
    
    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        isLimitReached 
                            ? "Daily limit reached. Upgrade to continue..." 
                            : "Ask your tax question..."
                    }
                    disabled={isLimitReached}
                    className={`
                        w-full p-4 pr-12 rounded-xl border
                        focus:outline-none focus:ring-2 focus:ring-emerald-500
                        ${isLimitReached 
                            ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                            : 'bg-white border-emerald-200'
                        }
                    `}
                />
                
                <button
                    type="submit"
                    disabled={!input.trim() || isLimitReached}
                    className={`
                        absolute right-3 top-1/2 -translate-y-1/2
                        p-2 rounded-lg transition
                        ${isLimitReached
                            ? 'text-gray-400 cursor-not-allowed'
                            : input.trim()
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-gray-100 text-gray-400'
                        }
                    `}
                >
                    {isLimitReached ? (
                        <Lock size={20} />
                    ) : (
                        <Send size={20} />
                    )}
                </button>
            </div>
            
            {/* Message counter */}
            {!subscription.isSubscribed && (
                <div className="text-xs text-gray-500 mt-2 text-center">
                    {subscription.freeMessagesUsed} of {subscription.maxFreeMessages} free messages used today
                </div>
            )}
        </form>
    )
}

export default ChatInput