import { useAuth } from "../../contexts/AuthContext";
import Login from "./Login";
import { useState, useEffect } from "react";
import Profile from "./Profile";
import LinkSharing from "../LinkSharing";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  const [profileContent, setProfileContent] = useState(() => {
    // Retrieve from localStorage or default to false
    return JSON.parse(localStorage.getItem("profileContent")) || false;
  });

  useEffect(() => {
    // Save to localStorage whenever profileContent changes
    localStorage.setItem("profileContent", JSON.stringify(profileContent));
  }, [profileContent]);

  return (
    <>
      {currentUser ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
          {/* Navigation Bar */}
          <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md text-white">
            <div className="mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">SnapLink</h1>
              <div>
                <span className="mr-4">
                  Hello,{" "}
                  <span className="font-semibold">
                    {currentUser.displayName || "User"}
                  </span>
                  !
                </span>
                <button
                  onClick={() => logout()}
                  className="bg-yellow-400 text-gray-800 py-2 px-4 rounded-md hover:bg-yellow-500 shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>

          <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-6">Menu</h2>
              <ul>
                <li className="mb-4">
                  <button
                    onClick={() => setProfileContent(false)}
                    className="w-full text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100 block px-4 py-2 rounded-md"
                  >
                    Dashboard
                  </button>
                </li>
                <li className="mb-4">
                  <button
                    onClick={() => setProfileContent(true)}
                    className="w-full text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100 block px-4 py-2 rounded-md"
                  >
                    Profile
                  </button>
                </li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
              {profileContent ? (
                <Profile />
              ) : (
                <>
                  <div className="bg-white shadow-lg p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                      Welcome to Your Dashboard!
                    </h2>
                    <p className="text-gray-600">
                      This is your personalized dashboard. Explore and manage
                      your link-sharing activities effortlessly!
                    </p>
                  </div>
                  <LinkSharing />
                </>
              )}
            </main>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}
