import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Filter,
  Plus,
  Search,
  Home,
  Compass,
  ArrowLeft,
  LogOut,
  MoreHorizontal,
  Bell,
  Lightbulb,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";
import CustomLoader from "@/components/CustomLoader";
import { formatDistanceToNow } from "date-fns";
import { BASE_URL } from "../config.js";

const emotions = [
  { name: "All", color: "bg-gray-100 text-gray-800" },
  { name: "Love", color: "bg-red-100 text-red-800" },
  { name: "Pain", color: "bg-blue-100 text-blue-800" },
  { name: "Friendship", color: "bg-green-100 text-green-800" },
  { name: "Life", color: "bg-purple-100 text-purple-800" },
  { name: "Hope", color: "bg-yellow-100 text-yellow-800" },
];

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState("All");
  const [activeTab, setActiveTab] = useState("trending");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const userResponse = await axios.get(
          `${BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const postsResponse = await axios.get(
          `${BASE_URL}/api/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(userResponse.data);
        setPosts(postsResponse.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/auth";
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const defaultImage =
    "https://i.pinimg.com/1200x/85/3a/5a/853a5a0102da872e193a3743c2450ac4.jpg";

  const formatTime = (createdAt) => {
    if (!createdAt) return "Just now";
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const filteredPosts = posts.filter((post) => {
    if (!post) return false;
    if (selectedEmotion === "All") return true;
    return post.emotion === selectedEmotion;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === "trending") {
      const engagementA = (a.likes?.length || 0) + (a.comments?.length || 0);
      const engagementB = (b.likes?.length || 0) + (b.comments?.length || 0);
      return engagementB - engagementA;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex overflow-x-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-gray-200 bg-white/80 backdrop-blur-md fixed h-screen z-40">
        <div className="p-4 h-full flex flex-col">
          <h1
            className="text-2xl font-bold text-gray-900 mb-8 mt-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Unsaid.
          </h1>

          <div className="space-y-1 flex-1">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 text-rose-600"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              to="/post"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create Post</span>
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Chat</span>
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">Notifications</span>
            </Link>
            <Link
              to="/suggestions"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">Suggestions</span>
            </Link>
          </div>

          <div className="mt-auto">
            <Link to="/profile/me" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userData?.profileImage || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {userData?.name ? userData.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{userData?.username || "username"}
                  </p>
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-700 mt-2 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 w-full">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 w-full">
          <div className="max-w-4xl mx-auto px-4 py-3 w-full">
            <div className="flex items-center justify-between">
              <div className="md:hidden">
                <h1
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Unsaid.
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 w-64 h-9 border border-gray-300 rounded-md focus:border-rose-500 focus:ring-rose-500 bg-white/70 backdrop-blur-sm"
                  />
                </div>

                <button
                  variant="ghost"
                  size="icon"
                  className="md:hidden p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </button>

                <Link to="/post" className="hidden md:block">
                  <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Post
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
            <div className="bg-white p-4">
              <div className="flex items-center gap-3 mb-4">
                <button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for users, shayaris, hashtags..."
                    className="pl-10 h-12 border border-gray-300 rounded-md w-full focus:border-rose-500 focus:ring-rose-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 px-3">Recent searches</p>
                <div className="space-y-1">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="font-medium">#love</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="font-medium">@priya_writes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-6 w-full pb-24 md:pb-6">
          {/* Emotion Filters */}
          <div className="mb-6 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by emotion
              </span>
            </div>
            <div className="relative w-full">
              <div className="w-full overflow-x-auto scrollbar-hide pb-2">
                <div className="flex space-x-2 w-max">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.name}
                      className={`cursor-pointer whitespace-nowrap transition-all duration-200 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEmotion === emotion.name
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                          : emotion.color
                      }`}
                      onClick={() => setSelectedEmotion(emotion.name)}
                    >
                      {emotion.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6 w-full">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <Card key={post._id} className="overflow-hidden w-full">
                  <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={post.user?.profileImage || defaultImage}
                          alt={post.user?.name}
                        />
                        <AvatarFallback>
                          {post.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {post.user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 w-full">
                    <p className="text-gray-800 whitespace-pre-line break-words">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between w-full">
                      <div className="flex space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{post.likes?.length || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.comments?.length || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 w-full">
                <img
                  src="https://i.pinimg.com/originals/36/51/26/365126a63911723046e0ef2ae1e249ff.gif"
                  alt="No posts"
                  className="mx-auto w-48 h-48 object-contain"
                />
                <p className="text-gray-500 mt-4">
                  No posts found. Be the first to post!
                </p>
                <Link
                  to="/post"
                  className="mt-4 inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Create Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 p-2 text-rose-500"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/post"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Post</span>
          </Link>
          <Link
            to="/suggestions"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Lightbulb className="h-5 w-5" />
            <span className="text-xs">Suggestions</span>
          </Link>
          <Link
            to="/profile/me"
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Avatar className="h-6 w-6 rounded-full overflow-hidden">
              <AvatarImage
                src={
                  userData?.profileImage ||
                  "https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                }
                className="object-cover h-full w-full"
              />
              <AvatarFallback>
                {userData?.name ? userData.name.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}








