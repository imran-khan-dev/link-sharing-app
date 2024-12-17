import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const SharedLink = () => {
  const { userId, userName } = useParams();
  const [links, setLinks] = useState([]);
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [copied, setCopied] = useState(false);

  // Share Url by Copy in Clipboard
  const shareUrl = `${window.location.origin}/shared-links/${userId}/${userName}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Get the Profile Image
  (async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${userId}`);
      const photoURL = await getDownloadURL(storageRef);
      console.log("Photo URL:", photoURL);
      return setProfilePicURL(photoURL);
    } catch (error) {
      console.error("Error getting profile picture:", error);
    }
  })();

  useEffect(() => {
    const fetchLinks = async () => {
      const q = query(
        collection(db, "links"),
        where("userId", "==", userId),
        where("isPublic", "==", true)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userLinks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLinks(userLinks);
      });

      return () => unsubscribe();
    };

    fetchLinks();
  }, [userId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center mb-2">
        <div className="relative">
          <img
            src={profilePicURL || "https://via.placeholder.com/150"}
            alt=""
            className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover"
          />
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center max-w-7xl mx-auto">
        <h1 className="text-xl text-center font-semibold text-gray-800 mb-4">
          Hello! This is
          <span className=" ml-1 text-indigo-600">{userName + "."}</span>
          <div>Here is my shared links</div>
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          {links.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {links.map((link) => (
                <li key={link.id} className="py-4">
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    {link.link}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No shared links available.</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">
        <p className="mb-2">Share This Page:</p>
        <div className="flex items-center">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-2 py-1 border rounded-l-md"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-1 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
        {copied && (
          <p className="text-green-500 mt-2">Link copied to clipboard!</p>
        )}
      </div>
    </div>
  );
};

export default SharedLink;
