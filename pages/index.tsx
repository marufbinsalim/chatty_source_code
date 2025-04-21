import LoadingSpinner from "@/components/LoadingSpinner";
import useUsers from "@/hooks/useUsers";
import { goToThread } from "@/utils/functions/goToThread";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { CircleDashed, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const MainPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isLoaded } = useUser();
  const { users, isLoaded: isUsersLoaded } = useUsers(searchTerm, user?.id);

  if (!isLoaded || !isUsersLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
       <LoadingSpinner/>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen h-screen font-sans flex flex-col overflow-hidden">
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
            <img
              src={
                user?.imageUrl ||
                "https://www.w3schools.com/w3images/avatar2.png"
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
              onClick={() => router.push("/profile")}
            />
            <span className="font-medium">{user?.fullName}</span>
            <SignOutButton>
              <LogOutIcon className="text-white cursor-pointer" size={30} />
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="bg-indigo-50 pt-8 pb-16 flex-1 flex flex-col w-full h-full">
        <div className="max-w-screen-xl mx-auto px-6 w-full overflow-hidden flex flex-col">
          {/* Search Bar with Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-2xl py-2">
              <input
                type="text"
                placeholder="Search users by email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-full border border-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {/* Search Icon as SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
          </div>

          {/* User Cards */}
          {users.length > 0 && (
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto flex-1 md:p-4 pb-8">
              {users.map((currentUser, index) => (
                <div
                  key={index}
                  className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg relative max-h-max"
                >
                  <div className="flex items-center mb-10 space-x-4">
                    {/* User Avatar with Image */}
                    <div className="rounded-full w-14 h-14 bg-gray-300 flex items-center justify-center">
                      <img
                        src="https://www.w3schools.com/w3images/avatar2.png"
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold truncate max-w-[50vw] md:max-w-[8vw]">
                        {currentUser.username}
                      </h2>
                      <p className="text-sm text-gray-500 truncate max-w-[50vw] md:max-w-[8vw]">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      const thread_id = await goToThread(
                        user?.id || "",
                        currentUser.id,
                      );
                      router.push(`/chat/${thread_id}`);
                    }}
                    className="absolute bottom-4  right-4 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                      />
                      <circle cx="9" cy="11" r="1" />
                      <circle cx="12" cy="11" r="1" />
                      <circle cx="15" cy="11" r="1" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {users.length === 0 && (
          <div className="text-center flex flex-col h-full justify-center items-center flex-1">
            <img
              src="no_data.png"
              alt="No Data"
              className="w-[70vw] md:w-[15vw] mb-4"
            />
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
