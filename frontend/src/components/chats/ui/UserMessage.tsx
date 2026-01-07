import { User } from "lucide-react";

const UserMessage = ({ message }: any) => {
    return (
        <div className="flex items-start justify-end gap-3">
            <div className="bg-green-600 p-3 rounded-xl max-w-[70%] text-white">
                <p className="text-sm">{message}</p>
            </div>

            <div className="p-2 bg-gray-200 rounded-full">
                <User className="w-5 h-5 text-gray-700" />
            </div>
        </div>
    );
};

export default UserMessage;
