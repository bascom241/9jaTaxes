import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { useAuthStore } from "../../../store/authStore";

import {
  MessageSquarePlus,
  Clock,
  Calendar,
  ChevronRight,
  MoreVertical,
  X,
  Search,
  RefreshCw,
} from "lucide-react";

type ChatSession = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  onSelectSession: (sessionId: string | null, title?: string) => void;
  currentSessionId: string | null;
};

const ChatSidebar = ({ onSelectSession, currentSessionId }: Props) => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const res = await axiosInstance.get(`/chat/sessions/${user._id}`);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };



  useEffect(() => {
    fetchSessions();
  }, [user]);

  const filteredSessions = sessions.filter((session) =>
    session.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-96 bg-linear-to-b from-emerald-50/30 to-white border-r border-emerald-100 transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-emerald-100">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-emerald-900">
              Conversations
            </h2>
            <p className="text-xs md:text-sm text-emerald-600/80 mt-1">
              Your chat history
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-emerald-100/50 transition-colors md:hidden"
            >
              <Search size={18} className="text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Search input */}
        {(showSearch || window.innerWidth >= 768) && (
          <div className="mb-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X size={16} className="text-emerald-500 hover:text-emerald-700" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* New Conversation */}
        <button
          onClick={() => onSelectSession(null)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group text-sm md:text-base"
        >
          <MessageSquarePlus
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          New Conversation
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="space-y-2">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session._id}
                onClick={() => onSelectSession(session._id, session.title)}
                className={`group relative p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  currentSessionId === session._id
                    ? "bg-linear-to-r from-emerald-50/80 to-emerald-100/30 border border-emerald-200 shadow-sm"
                    : "hover:bg-emerald-50/30 border border-transparent hover:border-emerald-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          currentSessionId === session._id
                            ? "bg-emerald-600 animate-pulse"
                            : "bg-emerald-400 group-hover:bg-emerald-500"
                        }`}
                      />
                      <h3 className="font-medium text-emerald-900 truncate text-sm md:text-base">
                        {session.title || "Untitled Conversation"}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs md:text-sm text-emerald-700/70">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatDate(session.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2 md:ml-3">
                    <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-emerald-100 rounded-lg transition-all">
                      <MoreVertical size={16} className="text-emerald-600" />
                    </button>
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${
                        currentSessionId === session._id
                          ? "text-emerald-600 translate-x-1"
                          : "text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>

                {currentSessionId === session._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-emerald-500 to-emerald-600 rounded-l-full" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                <MessageSquarePlus size={20} className="text-emerald-600" />
              </div>
              <p className="text-emerald-800 mb-1">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              <p className="text-xs md:text-sm text-emerald-700/70">
                {searchQuery
                  ? "Try a different search term"
                  : "Start your first conversation"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => onSelectSession(null)}
                  className="mt-3 text-sm md:text-base text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
                >
                  Create new conversation
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-emerald-100 flex items-center justify-between text-xs md:text-sm">
        <span className="text-emerald-700/80">
          {filteredSessions.length} {filteredSessions.length === 1 ? "conversation" : "conversations"}
        </span>
        <button
          onClick={fetchSessions}
          disabled={refreshing}
          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium disabled:opacity-50"
        >
          <RefreshCw size={14} className={`${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
