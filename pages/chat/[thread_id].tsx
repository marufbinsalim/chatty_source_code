import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ThreadId() {
  const params = useParams();
  const [thread_id, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (!params) return;
    const { thread_id } = params as { thread_id: string };
    setThreadId(thread_id);
  }, [params]);

  const messages = [
    { sender: "John", message: "Hey, how are you?", time: "12:01 PM" },
    {
      sender: "You",
      message: "I'm good, thanks! How about you?",
      time: "12:05 PM",
    },
    {
      sender: "John",
      message: "I'm doing great! What’s up?",
      time: "12:10 PM",
    },
    { sender: "You", message: "Just wanted to check in.", time: "12:15 PM" },
  ];

  const history = [
    { username: "John", message: "Hey, how are you?", time: "12:01 PM" },
    { username: "Jane", message: "Let's meet up tomorrow!", time: "10:00 AM" },
    { username: "Mike", message: "How’s the project going?", time: "8:30 AM" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center w-full px-4">
          {/* Logo & Name (Fully Left) */}
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

          {/* User Avatar & Name (Fully Right) */}
          <div className="flex items-center space-x-2">
            <div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">A</span>{" "}
              {/* Initials of Demo User */}
            </div>
            <span className="font-medium">Ahmed</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className=" bg-indigo-50 flex flex-1">
        {/* Left Side: History Section */}
        <div className="w-1/4 bg-indigo-50 p-10 border-r border-gray-300 overflow-auto">
          <h2 className="text-2xl font-semibold mb-6">Message History</h2>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Your Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 18c4.418 0 8-3.582 8-8S14.418 2 10 2 2 5.582 2 10s3.582 8 8 8zm0 0l5 5M10 10h.01"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {history.map((chat, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar Image */}
                  <img
                    src="https://www.w3schools.com/w3images/avatar2.png"
                    alt="User Avatar"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{chat.username}</h3>
                    <p className="text-sm text-gray-600">{chat.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Messenger Interface */}
        <div className="w-2/3 bg-indigo-50 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-4 border-b pb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center">
                <img
                  src="https://www.w3schools.com/w3images/avatar2.png"
                  alt="User Avatar"
                  className="rounded-full w-12 h-12 object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold">John Doe</h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} space-x-3`}
              >
                {/* Avatar/Initials */}
                {msg.sender !== "You" && (
                  <div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">J</span>{" "}
                    {/* John's Initials */}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-xs p-3 rounded-lg ${msg.sender === "You" ? "bg-indigo-600 text-white" : "bg-gray-200 text-black"}`}
                >
                  {/* Message Content */}
                  <p>{msg.message}</p>

                  {/* Time */}
                  <span
                    className={`text-xs ${
                      msg.sender === "You" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {msg.time}
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
            />
            <button className="bg-indigo-600 text-white p-3 rounded-full ml-4 flex items-center justify-center">
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
        </div>
      </div>
    </div>
  );
}
