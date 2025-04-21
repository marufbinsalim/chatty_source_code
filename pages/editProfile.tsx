import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const EditProfilePage = () => {
    const router = useRouter();
    const { user: clerkUser, isLoaded } = useUser();
    const [user, setUser] = useState({
        name: "",
        location: "",
        bio: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!clerkUser || !isLoaded) return;

            try {
                setLoading(true);

                // Get the email from Clerk user
                const email = clerkUser.emailAddresses[0]?.emailAddress;

                // Fetch user data from Supabase
                const { data, error: fetchError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (fetchError) throw fetchError;

                if (data) {
                    setUser({
                        name: data.username || clerkUser.fullName || "",
                        location: data.location || "",
                        bio: data.bio || "",
                        email: data.email || email,
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [clerkUser, isLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clerkUser) return;

        try {
            setSaving(true);
            setError("");

            const email = clerkUser.emailAddresses[0]?.emailAddress;
            if (!email) throw new Error("No email found");

            // First check if user exists
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            let dbError = null;

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
                throw fetchError;
            }

            if (existingUser) {
                // Update existing user
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        username: user.name,
                        location: user.location,
                        bio: user.bio,
                    })
                    .eq('email', email);

                dbError = updateError;
            } else {
                // Create new user with all required fields
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        email: email,
                        username: user.name,
                        location: user.location,
                        bio: user.bio,
                        created_at: new Date().toISOString(),
                        id: clerkUser.id // Using Clerk's user ID as the primary key
                    });

                dbError = insertError;
            }

            if (dbError) throw dbError;

            router.push("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to save profile changes");
        } finally {
            setSaving(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="bg-indigo-50 min-h-screen font-sans flex items-center justify-center">
               <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="bg-indigo-50 min-h-screen font-sans">
            <header className="bg-indigo-600 text-white p-6 shadow-lg">
                <div className="flex justify-between items-center max-w-6xl px-6">
                    {/* Logo & App Name */}
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                            <path fill="#FFFFFF" d="M12 2C6.48 2 2 5.58 2 9.72c0 1.63.55 3.16 1.46 4.42L3 18l4.86-1.46c1.26.91 2.85 1.46 4.14 1.46 5.52 0 10-3.73 10-8.72C22 5.58 17.52 2 12 2zM12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        </svg>
                        <h1 className="text-2xl font-semibold">Chatty</h1>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-white border border-gray-300 shadow-sm rounded-3xl mt-8">
                {/* Profile Title and Back Button */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-indigo-600 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-300"
                    >
                        &larr; Back
                    </button>
                    <h2 className="text-3xl font-semibold text-gray-800">Edit Profile</h2>
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-8 mb-10">
                    <img
                        src={clerkUser?.imageUrl || "https://www.w3schools.com/w3images/avatar2.png"}
                        alt="User Avatar"
                        className="w-28 h-28 rounded-full object-cover"
                    />
                 
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-gray-600 font-semibold mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                className="w-full p-2 text-gray-800 text-lg border-b border-gray-300 focus:border-indigo-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 font-semibold mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={user.location}
                                onChange={handleChange}
                                className="w-full p-2 text-gray-800 text-lg border-b border-gray-300 focus:border-indigo-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6">
                    <label className="block text-gray-600 font-semibold mb-2">Bio</label>
                    <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        className="w-full p-3 text-gray-700 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                    />
                </div>

                {/* Email Section */}
                <div className="mb-6">
                    <label className="block text-gray-600 font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full p-2 text-gray-700 text-lg border-b border-gray-300 focus:border-indigo-600 focus:outline-none"
                        disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-2 text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
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
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;