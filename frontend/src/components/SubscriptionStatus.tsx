// components/SubscriptionStatus.tsx
import { useSocket } from "../../hooks/useSocket"
import { useState } from "react"
import PaymentModal from "./PaymentModal"

const SubscriptionStatus = () => {
    const { subscription, checkSubscriptionStatus } = useSocket();
    console.log(checkSubscriptionStatus)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    
    if (subscription.isLoading || subscription.isSubscribed) return null
    
    const messagesLeft = subscription.maxFreeMessages - subscription.freeMessagesUsed
    
    return (
        <>
            <div className={`
                mx-4 mt-4 p-4 rounded-xl border
                ${messagesLeft <= 0 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }
            `}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${
                            messagesLeft <= 0 ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                            {messagesLeft <= 0 ? 'Daily Limit Reached!' : 'Free Messages'}
                        </h3>
                        <p className={`text-sm mt-1 ${
                            messagesLeft <= 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                            {messagesLeft <= 0 
                                ? `You've used all ${subscription.maxFreeMessages} free messages for today.`
                                : `${messagesLeft} free message${messagesLeft !== 1 ? 's' : ''} left today.`
                            }
                        </p>
                    </div>
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm"
                    >
                        Upgrade
                    </button>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${
                                messagesLeft <= 0 ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                            style={{ 
                                width: `${Math.min(
                                    (subscription.freeMessagesUsed / subscription.maxFreeMessages) * 100, 
                                    100
                                )}%` 
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{subscription.freeMessagesUsed} used</span>
                        <span>{subscription.maxFreeMessages} total</span>
                    </div>
                </div>
            </div>
            
            <PaymentModal 
                open={showPaymentModal} 
                onClose={() => setShowPaymentModal(false)} 
            />
        </>
    )
}

export default SubscriptionStatus