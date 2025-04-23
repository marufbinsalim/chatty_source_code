import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useMessenger from "@/hooks/useMessenger";
import useMessageHistory from "@/hooks/useMessageHistory";
import { useEffect, useState, useMemo } from "react";

export default function ThreadId() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!params) {
      console.error("No thread_id parameter found");
      // router.push('/chat');
      return;
    }

    const { thread_id } = params as { thread_id: string };
    setThreadId(thread_id);
  }, [params, router]);

  const {
    messages,
    newMessage,
    setNewMessage,
    thread,
    sendMessage,
    isSending,
    error: messengerError,
    formatTime,
  } = useMessenger(threadId || "");

  const {
    history,
    isLoading: historyLoading,
    error: historyError,
  } = useMessageHistory();

  const filteredHistory = useMemo(() => {
    return history.filter((thread) => {
      if (!searchQuery.trim()) return true;

      const searchLower = searchQuery.toLowerCase();
      const username = thread.other_user?.username?.toLowerCase() || "";
      const email = thread.other_user?.email?.toLowerCase() || "";
      const lastMessage = thread.last_message?.toLowerCase() || "";

      return (
        username.includes(searchLower) ||
        email.includes(searchLower) ||
        lastMessage.includes(searchLower)
      );
    });
  }, [history, searchQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!threadId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center w-full px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Go back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
              >
                <path
                  fill="#FFFFFF"
                  d="M12 2C6.48 2 2 5.58 2 9.72c0 1.63.55 3.16 1.46 4.42L3 18l4.86-1.46c1.26.91 2.85 1.46 4.14 1.46 5.52 0 10-3.73 10-8.72C22 5.58 17.52 2 12 2zM12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                />
              </svg>
              <h1 className="text-2xl font-semibold">Chatty</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {user?.username?.charAt(0).toUpperCase() ||
                  user?.emailAddresses[0]?.emailAddress
                    ?.charAt(0)
                    .toUpperCase()}
              </span>
            </div>
            <span className="font-medium">
              {user?.username || user?.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-indigo-50 flex flex-1">
        {/* Left Side: History Section */}
        <div className="w-1/4 bg-indigo-50 p-10 border-r border-gray-300 overflow-auto">
          <h2 className="text-2xl font-semibold mb-6">Message History</h2>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {historyLoading && <div className="text-center py-4">Loading...</div>}
          {historyError && (
            <div className="text-red-500 text-sm">{historyError}</div>
          )}

          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery.trim()
                  ? "No conversations match your search"
                  : "No conversations found"}
              </div>
            ) : (
              filteredHistory.map((thread) => (
                <div
                  key={thread.thread_id}
                  className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/chat/${thread.thread_id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full w-12 h-12 min-w-12 min-h-12 bg-gray-300 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {thread.other_user?.username?.charAt(0).toUpperCase() ||
                          thread.other_user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {thread.other_user?.username ||
                          thread.other_user?.email}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {thread.last_message}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(thread.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Messenger Interface */}
        <div className="w-3/4 bg-indigo-50 p-6 flex flex-col">
          {/* Header */}
          {thread && (
            <div className="flex items-center space-x-4 mb-4 border-b pb-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {thread.other_user?.username?.charAt(0).toUpperCase() ||
                      thread.other_user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold">
                  {thread.other_user?.username || thread.other_user?.email}
                </h2>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === user?.id ? "justify-end" : "justify-start"
                } space-x-3`}
              >
                {msg.sender_id !== user?.id && (
                  <div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {msg.user?.username?.charAt(0).toUpperCase() ||
                        msg.user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div
                  className={`relative max-w-xs p-3 rounded-lg ${
                    msg.sender_id === user?.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`text-xs ${
                      msg.sender_id === user?.id
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center mt-6 border-t pt-4">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending}
            />
            <button
              className="bg-indigo-600 text-white p-3 rounded-full ml-4 flex items-center justify-center disabled:opacity-50"
              onClick={sendMessage}
              disabled={isSending || !newMessage.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 2L23 12L2 22V14L16 12L2 10V2Z"
                />
              </svg>
            </button>
          </div>
          {messengerError && (
            <div className="text-red-500 text-sm mt-2">{messengerError}</div>
          )}
        </div>
      </div>
    </div>
  );
}
