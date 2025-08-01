import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  TrendingUp,
  Users,
  Hash,
  UserPlus,
  ArrowLeft,
  Home,
  Plus,
  MessageCircle,
  Compass
} from "lucide-react";

const trendingHashtags = [
  { tag: "#love", posts: 12500, growth: "+15%" },
  { tag: "#pain", posts: 8900, growth: "+8%" },
  { tag: "#friendship", posts: 6700, growth: "+12%" },
  { tag: "#life", posts: 15200, growth: "+5%" },
  { tag: "#hope", posts: 4300, growth: "+22%" },
  { tag: "#nostalgia", posts: 3800, growth: "+18%" },
];

const suggestedUsers = [
  {
    name: "Priya Singh",
    username: "priya_writes",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Expressing emotions through words | Hindi Poetry",
    followers: 2847,
    isFollowing: false,
  },
  {
    name: "Ahmed Khan",
    username: "ahmed_shayar",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Urdu Shayari | Classical Poetry Lover",
    followers: 1923,
    isFollowing: false,
  },
  {
    name: "Kavya Sharma",
    username: "kavya_poet",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Modern poetry with traditional touch",
    followers: 3456,
    isFollowing: true,
  },
];

const trendingTopics = [
  { name: "Monsoon Poetry", posts: 1200, color: "bg-blue-100 text-blue-800" },
  { name: "Heartbreak", posts: 2300, color: "bg-red-100 text-red-800" },
  { name: "Motivation", posts: 890, color: "bg-green-100 text-green-800" },
  { name: "Family", posts: 1500, color: "bg-purple-100 text-purple-800" },
  { name: "Dreams", posts: 670, color: "bg-yellow-100 text-yellow-800" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Explore</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for users, hashtags, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-12 border border-gray-300 rounded-md focus:border-rose-500 focus:ring-rose-500 bg-white/70 backdrop-blur-sm"
          />
        </div>

        {/* Explore Tabs */}
        <div className="mb-6">
          <div className="grid w-full grid-cols-3 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setActiveTab("trending")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === "trending" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === "users" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              <Users className="h-4 w-4 mr-1" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("topics")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === "topics" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              <Hash className="h-4 w-4 mr-1" />
              Topics
            </button>
          </div>

          {/* Trending Tab Content */}
          {activeTab === "trending" && (
            <div className="mt-6 space-y-6">
              {/* Trending Hashtags */}
              <div className="border-0 rounded-lg shadow-sm bg-white/70 backdrop-blur-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Hash className="h-5 w-5 text-rose-500" />
                    Trending Hashtags
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {trendingHashtags.map((hashtag, index) => (
                      <div
                        key={hashtag.tag}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{hashtag.tag}</p>
                            <p className="text-sm text-gray-600">{hashtag.posts.toLocaleString()} posts</p>
                          </div>
                        </div>
                        <span className="text-green-700 bg-green-100 text-xs px-2.5 py-0.5 rounded-full">
                          {hashtag.growth}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trending Topics */}
              <div className="border-0 rounded-lg shadow-sm bg-white/70 backdrop-blur-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Popular Topics</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trendingTopics.map((topic) => (
                      <div
                        key={topic.name}
                        className="p-4 rounded-lg border border-gray-200 hover:border-rose-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{topic.name}</h3>
                            <p className="text-sm text-gray-600">{topic.posts} posts</p>
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full ${topic.color}`}>
                            Trending
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab Content */}
          {activeTab === "users" && (
            <div className="mt-6">
              <div className="border-0 rounded-lg shadow-sm bg-white/70 backdrop-blur-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Suggested Users</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {suggestedUsers.map((user) => (
                      <div
                        key={user.username}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link
                              to={`/profile/${user.username}`}
                              className="font-semibold text-gray-900 hover:text-rose-600 transition-colors"
                            >
                              {user.name}
                            </Link>
                            <p className="text-sm text-gray-600">@{user.username}</p>
                            <p className="text-sm text-gray-700 mt-1">{user.bio}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {user.followers.toLocaleString()} followers
                            </p>
                          </div>
                        </div>
                        <button
                          className={`text-sm px-3 py-1.5 rounded-md flex items-center ${
                            user.isFollowing
                              ? "border border-gray-300 hover:bg-gray-100"
                              : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                          }`}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {user.isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Topics Tab Content */}
          {activeTab === "topics" && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.name}
                    className="border-0 rounded-lg shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${topic.color}`}>
                          {topic.posts}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Discover beautiful shayaris about {topic.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/explore" className="flex flex-col items-center gap-1 p-2 text-rose-500">
            <Compass className="h-5 w-5" />
            <span className="text-xs">Explore</span>
          </Link>
          <Link to="/post" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Post</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Link>
          <Link to="/profile/me" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <div className="h-5 w-5 rounded-full overflow-hidden">
              <img src="/placeholder.svg?height=20&width=20" alt="Profile" className="h-full w-full" />
            </div>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}