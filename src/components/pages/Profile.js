import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

const ProfileSection = () => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }

    setUploading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);

      // Upload file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log("Upload successful:", uploadResult);

      // Get download URL
      const photoURL = await getDownloadURL(storageRef);
      console.log("Photo URL:", photoURL);

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL });
      console.log("Profile updated successfully.");

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error during profile picture upload:", error);
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My Profile
      </h2>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={currentUser.photoURL || "https://via.placeholder.com/150"}
            alt=""
            className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover"
          />
          <label
            htmlFor="upload-profile-pic"
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
            title="Upload Profile Picture"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </label>
          <input
            id="upload-profile-pic"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureUpload}
          />
        </div>
        {uploading && (
          <p className="text-blue-600 mt-2 text-sm">Uploading...</p>
        )}
        <p className="text-gray-600 mt-4 text-sm italic">
          Click on the icon to update your profile picture
        </p>
      </div>

      {/* User Details */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-center">
          <label className="block text-gray-700 font-medium mb-1">
            <span className="font-bold">Username:</span>{" "}
            {currentUser.displayName || "User"}
          </label>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <label className="block text-gray-700 font-medium mb-1">
            <span className="font-bold">Email:</span> {currentUser.email}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
