import bot from "../../../assets/bot.png";
import { Shield, Zap, Clock } from "lucide-react";

const Header = () => {
    return (
        <header className="px-6 py-6 border-b border-emerald-100 bg-linear-to-r from-emerald-50/40 to-white">
            <div className="max-w-4xl mx-auto">
                {/* Main Title Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4">
                    {/* Bot Image - Larger and prominent */}
                    <div className="relative">
                        <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-white border border-emerald-200 rounded-2xl p-3 shadow-sm">
                            <img
                                src={bot}
                                className="w-full h-full object-contain"
                                alt="TaxBot"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-2">
                            Chat with <span className="text-emerald-600">TaxBot</span>
                        </h1>
                        <p className="text-lg text-emerald-700/80">
                            Your AI tax assistant for Nigerian regulations
                        </p>
                    </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-100 rounded-full">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Accurate</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-100 rounded-full">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Fast Responses</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-100 rounded-full">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">24/7 Available</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;