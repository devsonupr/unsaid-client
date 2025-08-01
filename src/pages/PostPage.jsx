import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Send,
  Home,
  Compass,
  Plus,
  MessageCircle,
} from "lucide-react";
import CustomLoader from "@/components/CustomLoader";
import { BASE_URL } from "../config.js";

export default function PostPage() {
  const [content, setContent] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);
      setShowFullScreenLoader(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Replace spaces with non-breaking spaces to preserve formatting
      const formattedContent = content.replace(/ /g, '\u00A0');
      
      const response = await axios.post(
        `${BASE_URL}/api/posts`,
        { content: formattedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/home", { replace: true });
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
      console.error("Posting error:", err);
    } finally {
      setPosting(false);
      setShowFullScreenLoader(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error loading data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/auth"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Full Screen Loader */}
      {showFullScreenLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <CustomLoader size={8} />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Create Post
              </h1>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              <Send className="h-4 w-4 mr-1" />
              Post
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Content Input */}
        <div className="mb-6 border-0 outline-none rounded-lg shadow-sm bg-white/70 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">What's on your mind?</h2>
          </div>
          <div className="p-4">
            <textarea
              placeholder="Express your thoughts..."
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setContent(e.target.value);
                }
              }}
              className="w-full min-h-32 text-lg leading-relaxed resize-none bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none whitespace-pre-wrap"
              style={{ fontFamily: "serif" }}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
              <span>{content.length}/500</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        {content && (
          <div className="mb-6 border-0 rounded-lg shadow-sm bg-white/70 backdrop-blur-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Preview</h2>
            </div>
            <div className="p-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <p
                  className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap break-words"
                  style={{ fontFamily: "serif" }}
                >
                  {content}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">Preview</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/home"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/explore"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs">Explore</span>
          </Link>
          <Link
            to="/post"
            className="flex flex-col items-center gap-1 p-2 text-rose-500"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Post</span>
          </Link>
          <Link
            to="/chat"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Link>
          <Link
            to="/profile/me"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <div className="h-5 w-5 rounded-full overflow-hidden">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
              )}
            </div>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}