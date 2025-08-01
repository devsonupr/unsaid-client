import React, { useEffect, useState } from "react";
import { UserPlus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomLoader from "@/components/CustomLoader";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../config.js";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [currentUserRes, allUsersRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/users`),
      ]);

      if (allUsersRes.data?.success && currentUserRes.data) {
        const current = currentUserRes.data;

        // ✅ correct filtering based on `following`
        const filtered = allUsersRes.data.data.filter(user => {
          return (
            user._id !== current._id &&
            !current.following?.includes(user._id)
          );
        });

        setCurrentUser(current);
        setSuggestions(filtered);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login first");

      const response = await axios.put(
        `${BASE_URL}/api/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Re-fetch updated current user to get latest following list
      const updatedUser = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuggestions(prev => prev.filter(user => user._id !== userId));
      setCurrentUser(updatedUser.data);

      toast.success(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to follow user");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Suggestions for you</h2>

      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          {currentUser?.following?.length > 0 
            ? "No more suggestions right now" 
            : "Follow users to see their posts in your feed"}
        </p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
            >
              <Link 
                to={`/profile/${user.username}`}
                className="flex items-center gap-4 flex-1"
              >
                <div className="w-12 h-12 rounded-full border-2 border-rose-100 overflow-hidden">
                  <img
                    src={user.profileImage || "https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {user.location || "Unknown location"}
                  </p>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleFollow(user._id);
                }}
                className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-full transition-colors ml-4"
              >
                <UserPlus className="w-4 h-4" />
                Follow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;