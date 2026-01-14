import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSideBar";
import { useSocket } from "../../../hooks/useSocket";
import Header from "./ui/header";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Chat = () => {
  const { loadSession, chatSessionId } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex flex-col md:flex-row w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative">
      
      {/* Overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
        />
      )}

      {/* Sidebar Overlay on mobile, normal on desktop */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full z-20 bg-gradient-to-b from-emerald-50/90 to-white border-r border-emerald-100 shadow-xl transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-80 lg:w-96
        `}
      >
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 bg-emerald-100 rounded-full shadow-md"
          >
            <X size={20} className="text-emerald-600" />
          </button>
        </div>

        <ChatSidebar
          onSelectSession={(sessionId) => {
            loadSession(sessionId);
            setSidebarOpen(false); // close on mobile after selecting
          }}
          currentSessionId={chatSessionId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Mobile toggle button */}
        <button
          className="md:hidden absolute top-4 left-4 z-30 p-2 bg-emerald-100 rounded-full shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} className="text-emerald-600" />
        </button>

        <Header />

        {/* ChatBody */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChatBody />
        </div>

        {/* Chat Input */}
        <div className="border-t border-slate-200">
          <ChatInput />
        </div>
      </div>
    </main>
  );
};

export default Chat;
