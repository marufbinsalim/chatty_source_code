import { SignInButton } from "@clerk/nextjs";
import { Globe, LogInIcon, Map, User } from "lucide-react";

export default function UnauthenticatedDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
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
          <SignInButton mode="modal" signUpForceRedirectUrl="/api/new-user">
            <button className="bg-indigo-50 text-indigo-600 cursor-pointer font-extrabold px-4 py-2 rounded-lg shadow-md transition duration-200 z-10 flex">
              <p>Sign In</p>
              <LogInIcon className="ml-2" fontWeight={4} />
            </button>
          </SignInButton>
        </div>
      </header>
      {/* Main Content */}
      <main className="relative flex items-center justify-center flex-1 flex-col">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold mb-4 text-indigo-600">
            Welcome to Chatty!
          </h2>
          <p className="text-lg text-gray-700 mb-6 flex gap-2 items-center">
            Please
            <span className="text-indigo-600 font-semibold cursor-pointer text-2xl underline decoration-black decoration-wavy decoration-1">
              sign in
            </span>
            to chat with others and
            <span className="text-indigo-600 font-semibold cursor-pointer text-2xl underline decoration-black decoration-wavy decoration-1">
              explore
            </span>
            <Globe className="text-indigo-600" size={30} />
            the app!
          </p>
        </div>
        <SignInButton mode="modal" signUpForceRedirectUrl="/api/new-user">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md flex z-10 gap-2 cursor-pointer">
            <p>Sign In</p>
            <LogInIcon />
          </button>
        </SignInButton>
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#4f39f6"
            fill-opacity="1"
            d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,240C1120,245,1280,203,1360,181.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </main>
    </div>
  );
}
