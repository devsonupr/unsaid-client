import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Link as LinkIcon,
  Calendar,
  ArrowLeft,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  Settings,
  X,
  Bookmark,
  Trash2,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import CustomLoader from "@/components/CustomLoader";
import { BASE_URL } from "../config.js";

export default function ProfilePage({ username = "me" }) {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const defaultImage = "https://i.pinimg.com/736x/20/af/45/20af4549c7ddbe0e465c860f8d63e5e1.jpg";
  const coverImage = "https://i.pinimg.com/1200x/d2/2f/d7/d22fd798bc95e0addaf7bb7a558d759b.jpg";

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
      setUserPosts(response.data.posts || []);
      setPreviewImage(response.data.profileImage || defaultImage);
      setFormData({
        name: response.data.name || '',
        username: response.data.username || '',
        bio: response.data.bio || '',
        location: response.data.location || ''
      });
    } catch (err) {
      setError(err.message || "Failed to fetch user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowersData = async () => {
    if (!userData?.followers?.length) {
      setFollowersList([]);
      return;
    }

    setLoadingFollowers(true);
    try {
      const token = localStorage.getItem("token");
      const followersPromises = userData.followers.map(userId => 
        axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const followersResponses = await Promise.all(followersPromises);
      const followersData = followersResponses.map(res => res.data.data);
      setFollowersList(followersData);
    } catch (err) {
      console.error("Error fetching followers data:", err);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowingData = async () => {
    if (!userData?.following?.length) {
      setFollowingList([]);
      return;
    }

    setLoadingFollowing(true);
    try {
      const token = localStorage.getItem("token");
      const followingPromises = userData.following.map(userId => 
        axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const followingResponses = await Promise.all(followingPromises);
      const followingData = followingResponses.map(res => res.data.data);
      setFollowingList(followingData);
    } catch (err) {
      console.error("Error fetching following data:", err);
    } finally {
      setLoadingFollowing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === "followers" && userData) {
      fetchFollowersData();
    }
  }, [activeTab, userData?.followers]);

  useEffect(() => {
    if (activeTab === "following" && userData) {
      fetchFollowingData();
    }
  }, [activeTab, userData?.following]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);

      await axios.put(
        `${BASE_URL}/api/users/${userData._id}/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchUserData();
      setShowEditProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(true);
    setShowOptionsMenu(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/users/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/auth");
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err.response?.data?.message || "Failed to delete account");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return "Just now";
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const joinedDate = new Date(userData?.createdAt);
  const formattedDate = joinedDate.toLocaleDateString("en-GB");

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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error loading data</h2>
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900">{userData.name}</h1>
                <p className="text-sm text-gray-500">{userPosts.length} posts</p>
              </div>
            </div>
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {showOptionsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {username === "me" && (
                    <>
                      <button
                        onClick={confirmDeleteAccount}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          handleLogout();
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </>
                  )}
                  {username !== "me" && (
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="relative h-48 md:h-64">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="px-4 pb-6">
          <div className="relative -mt-16 mb-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={previewImage || userData.profileImage}
                alt={userData.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-r from-amber-200 to-rose-300 text-4xl font-semibold">
                {userData.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{userData.name}</h1>
              <p className="text-gray-600 mb-2">@{userData.username}</p>

              <p className="text-gray-800 mb-3 leading-relaxed">{userData.bio || "No bio yet"}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {userData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </div>
                )}
                {userData.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={`https://${userData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formattedDate}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <button onClick={() => setActiveTab("following")} className="hover:underline">
                  <span className="font-semibold text-gray-900">{userData.following?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </button>
                <button onClick={() => setActiveTab("followers")} className="hover:underline">
                  <span className="font-semibold text-gray-900">{userData.followers?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </button>
              </div>
            </div>

            <div className="ml-4 flex flex-col gap-2">
              {username === "me" ? (
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="grid w-full grid-cols-3 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "posts" ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("followers")}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "followers" ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Followers
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "following" ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Following
              </button>
            </div>

            {activeTab === "posts" && (
              <div className="mt-6 space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <Card key={post._id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={userData.profileImage || defaultImage}
                              alt={userData.name}
                            />
                            <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{userData.username}</p>
                            <p className="text-xs text-gray-500">{formatTime(post.createdAt)}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                        {post.image && (
                          <div className="mt-4">
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full h-auto rounded-md"
                            />
                          </div>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{post.likes?.length || 0}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{post.comments?.length || 0}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              <Share2 className="h-4 w-4 mr-1" />
                              <span>Share</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No posts yet</p>
                    {username === "me" && (
                      <Link
                        to="/post"
                        className="mt-4 inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Create your first post
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="mt-6">
                {loadingFollowers ? (
                  <div className="flex justify-center py-12">
                    <CustomLoader />
                  </div>
                ) : followersList.length > 0 ? (
                  <div className="space-y-4">
                    {followersList.map((follower) => (
                      <div key={follower._id} className="flex items-center p-4 bg-white rounded-lg shadow">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={follower.profileImage || defaultImage} alt={follower.name} />
                          <AvatarFallback>{follower.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">{follower.name}</h3>
                          <p className="text-sm text-gray-500">@{follower.username}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${follower.username}`)}>
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No followers yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="mt-6">
                {loadingFollowing ? (
                  <div className="flex justify-center py-12">
                    <CustomLoader />
                  </div>
                ) : followingList.length > 0 ? (
                  <div className="space-y-4">
                    {followingList.map((followingUser) => (
                      <div key={followingUser._id} className="flex items-center p-4 bg-white rounded-lg shadow">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={followingUser.profileImage || defaultImage} alt={followingUser.name} />
                          <AvatarFallback>{followingUser.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">{followingUser.name}</h3>
                          <p className="text-sm text-gray-500">@{followingUser.username}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${followingUser.username}`)}>
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Not following anyone yet</p>
                    {username === "me" && (
                      <button
                        onClick={() => navigate("/suggestions")}
                        className="mt-4 inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Find people to follow
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Delete Account</h2>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete your account? This action cannot be undone.
                All your data will be permanently removed.
              </p>
              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
                <button
                  className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Edit Profile</h2>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setShowEditProfile(false);
                    setPreviewImage(userData.profileImage || defaultImage);
                  }}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    disabled={isUpdating}
                  >
                    <ImageIcon className="h-4 w-4 text-gray-700" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    disabled={isUpdating}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-rose-500 focus:ring-rose-500"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-rose-500 focus:ring-rose-500"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-rose-500 focus:ring-rose-500"
                  rows={3}
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-rose-500 focus:ring-rose-500"
                  disabled={isUpdating}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => {
                    setShowEditProfile(false);
                    setPreviewImage(userData.profileImage || defaultImage);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}