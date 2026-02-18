import { useState } from "react";
import { usePayment } from "../../store/usePaymentStore";

interface Props {
    open: boolean;
    onClose: () => void;
}

const PaymentModal = ({ open, onClose }: Props) => {
    const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
    const { initializePayment, isLoading } = usePayment();
    
    if (!open) return null;

    const isMonthly = plan === "monthly";

    const handlePayment = async () => {
        await initializePayment(plan);
        // Modal will close when redirecting to Paystack
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative p-6">

                {/* Close */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl disabled:opacity-50"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Upgrade to Premium</h2>
                    <p className="text-gray-500 mt-2">
                        Unlock unlimited access and premium features
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => setPlan("monthly")}
                        disabled={isLoading}
                        className={`flex-1 rounded-full py-2 font-semibold transition ${
                            isMonthly ? "bg-white shadow" : "text-gray-500"
                        } disabled:opacity-50`}
                    >
                        Monthly
                    </button>

                    <button
                        onClick={() => setPlan("annual")}
                        disabled={isLoading}
                        className={`flex-1 rounded-full py-2 font-semibold relative transition ${
                            !isMonthly ? "bg-white shadow" : "text-gray-500"
                        } disabled:opacity-50`}
                    >
                        Annual
                        <span className="absolute -top-3 right-6 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                            Save 17%
                        </span>
                    </button>
                </div>

                {/* Price Box */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
                    {isMonthly ? (
                        <>
                            <h3 className="text-4xl font-bold text-gray-800">
                                ₦3,000<span className="text-lg font-medium"> /month</span>
                            </h3>
                            <p className="text-green-700 mt-2 font-medium">
                                Flexible monthly billing
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-4xl font-bold text-gray-800">
                                ₦30,000<span className="text-lg font-medium"> /year</span>
                            </h3>
                            <p className="text-green-700 mt-2 font-medium">
                                Just ₦2,500/month • Save ₦6,000 annually
                            </p>
                        </>
                    )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                    {[
                        "Unlimited AI chat questions",
                        "Complete tax library access",
                        "Personalized tax calculations",
                        "Priority support & early access",
                    ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                            <span className="bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                                ✓
                            </span>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Pay Button */}
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-semibold transition flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "Proceed to Payment"
                    )}
                </button>
                
                {/* Security note */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    Secure payment powered by Paystack
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;