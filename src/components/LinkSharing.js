import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth, db } from "../../src/firebase";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const LinkSharing = () => {
  const [links, setLinks] = useState([]);
  const [newLinks, setNewLinks] = useState([""]);
  const { currentUser } = useAuth();

  // Fetch links for the current user
  useEffect(() => {
    const fetchLinks = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "links"),
        where("userId", "==", auth.currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userLinks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLinks(userLinks);
      });

      return () => unsubscribe(); // Clean up subscription
    };

    fetchLinks();
  }, []);

  // Add a new input field
  const addInputField = () => {
    setNewLinks([...newLinks, ""]);
  };

  // Remove input field
  const removeInput = (indexToRemove) => {
    if (indexToRemove > -1 && indexToRemove < newLinks.length) {
      newLinks.splice(indexToRemove, 1);
    }
    setNewLinks([...newLinks]);
  };

  // Update the value of a specific input field
  const updateLinkValue = (index, value) => {
    const updatedLinks = [...newLinks];
    updatedLinks[index] = value;
    setNewLinks(updatedLinks);
  };

  const togglePublicStatus = async (id, currentStatus) => {
    try {
      const linkRef = doc(db, "links", id);
      await updateDoc(linkRef, {
        isPublic: !currentStatus,
      });
      console.log("Public status updated!");
    } catch (error) {
      console.error("Error updating public status:", error);
    }
  };

  // Save all links
  const saveAllLinks = async () => {
    if (!auth.currentUser) {
      return alert("Please log in to save links!");
    }

    try {
      const batch = newLinks.filter((link) => {
        if (!link.trim()) {
          alert("Link cannot be empty!");
          return false;
        }
        if (!link.startsWith("http") && !link.startsWith("https")) {
          alert("Invalid link format!");
          return false;
        }
        return true;
      });

      const promises = batch.map((link) =>
        addDoc(collection(db, "links"), {
          userId: auth.currentUser.uid,
          link: link.trim(),
          dateAdded: new Date(),
        })
      );

      await Promise.all(promises);
      setNewLinks([""]); // Clear input fields
      console.log("Links added successfully!");
    } catch (error) {
      console.error("Error saving links:", error);
      alert("Failed to save links. Please try again.");
    }
  };

  // Remove a link
  const removeLink = async (id) => {
    try {
      await deleteDoc(doc(db, "links", id));
      console.log("Link removed successfully!");
    } catch (error) {
      console.error("Error removing link:", error);
      alert("Failed to remove the link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Manage Your Links
        </h1>

        {/* Input Fields */}
        {newLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder={`Enter link #${index + 1}`}
              value={link}
              onChange={(e) => updateLinkValue(index, e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeInput(index)}
              className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition"
              aria-label="Remove field"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={addInputField}
            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-purple-700 transition"
          >
            Add Field
          </button>
          <button
            onClick={saveAllLinks}
            className="px-4 py-2 text-sm bg-yellow-400 text-gray-800 rounded-md shadow-sm hover:bg-yellow-500 transition"
          >
            Save
          </button>
        </div>

        {/* Saved Links */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Saved Links:
        </h2>
        <ul className="list-disc list-inside space-y-4 mb-4">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md shadow-sm"
            >
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
                style={{ maxWidth: "60%" }}
              >
                {link.link}
              </a>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePublicStatus(link.id, link.isPublic)}
                  className={`px-2 py-1 text-sm ${
                    link.isPublic ? "bg-green-200" : "bg-red-200"
                  } rounded-md`}
                >
                  {link.isPublic ? "Public" : "Private"}
                </button>
                <button
                  onClick={() => removeLink(link.id)}
                  className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition"
                  aria-label="Remove saved link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center">
          <Link
            className="px-4 py-2 text-sm bg-yellow-400 text-gray-800 rounded-md shadow-sm hover:bg-yellow-500 transition"
            to={`/shared-links/${currentUser.uid}/${currentUser.displayName}`}
          >
            Share Your Links
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkSharing;
