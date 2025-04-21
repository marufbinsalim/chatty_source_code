import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';


// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const ProfilePage = () => {
    const { user: clerkUser, isLoaded } = useUser();
    const [userData, setUserData] = useState({
        username: "",
        location: "Unknown",
        bio: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);

    const router = useRouter();


    useEffect(() => {
        const fetchUserData = async () => {
            if (!clerkUser || !isLoaded) return;

            try {
                setLoading(true);

                // Get the email from Clerk user
                const email = clerkUser.emailAddresses[0]?.emailAddress;

                // Fetch user data from Supabase using the email
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (error) throw error;

                if (data) {
                    setUserData({
                        username: data.username || clerkUser.fullName || "User",
                        location: data.location || "Add Location",
                        bio: data.bio || "Add Bio",
                        email: data.email || email,
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [clerkUser, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="bg-indigo-50 min-h-screen font-sans flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-indigo-50 min-h-screen font-sans">
            <header className="bg-indigo-600 text-white p-6 shadow-lg">
                <div className="flex justify-between items-center max-w-6xl px-6">
                    {/* Logo & App Name */}
                    <div  className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                            <path fill="#FFFFFF" d="M12 2C6.48 2 2 5.58 2 9.72c0 1.63.55 3.16 1.46 4.42L3 18l4.86-1.46c1.26.91 2.85 1.46 4.14 1.46 5.52 0 10-3.73 10-8.72C22 5.58 17.52 2 12 2zM12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        </svg>
                        <h1 className="text-2xl font-semibold">Chatty</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto p-8 bg-white border border-gray-300 shadow-sm rounded-3xl mt-8">
                {/* Profile Title and Back Button */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 text-indigo-600 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-300"
                        aria-label="Go to home page"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-3xl font-semibold text-gray-800">Profile</h2>
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-8 mb-10">
                    <img
                        src={clerkUser?.imageUrl || "https://www.w3schools.com/w3images/avatar2.png"}
                        alt="User Avatar"
                        className="w-28 h-28 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-4xl font-semibold text-gray-800">{userData.username}</h2>
                        <p className="text-gray-500 text-lg">{userData.location}</p>
                    </div>
                </div>

                {/* Bio Section */}
                <p className="text-gray-700 text-lg mb-6">{userData.bio}</p>

                {/* Email Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-600 text-lg">Email: {userData.email}</span>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => window.location.href = "/editProfile"}
                        className="flex items-center px-6 py-2 text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;