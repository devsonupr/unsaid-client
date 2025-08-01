import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMessageCircle, FiBookmark, FiHeart } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import CustomLoader from "@/components/CustomLoader";
import { toast } from "react-hot-toast";
import FollowModal from "@/components/FollowModal";
import { formatDistanceToNow } from "date-fns";
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
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../config.js";

const UserProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showFollowModal, setShowFollowModal] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const defaultImage = "https://i.pinimg.com/736x/20/af/45/20af4549c7ddbe0e465c860f8d63e5e1.jpg";
  const coverImage = "https://i.pinimg.com/1200x/d2/2f/d7/d22fd798bc95e0addaf7bb7a558d759b.jpg";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // First try to fetch by username
        let userRes;
        try {
          userRes = await axios.get(`${BASE_URL}/api/users/username/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          // If username fetch fails, try by ID
          if (error.response?.status === 404) {
            userRes = await axios.get(`${BASE_URL}/api/users/${username}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            throw error;
          }
        }

        if (userRes.data?.success || userRes.data?.data) {
          const userData = userRes.data.data || userRes.data;
          setUser(userData);
          setPosts(userData.posts || []);

          // Check if current user is following this user
          const currentUserRes = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFollowing(currentUserRes.data?.following?.includes(userData._id));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const fetchFollowersData = async () => {
    if (!user?.followers?.length) {
      setFollowersList([]);
      return;
    }

    setLoadingFollowers(true);
    try {
      const token = localStorage.getItem("token");
      const followersPromises = user.followers.map(userId => 
        axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
    if (!user?.following?.length) {
      setFollowingList([]);
      return;
    }

    setLoadingFollowing(true);
    try {
      const token = localStorage.getItem("token");
      const followingPromises = user.following.map(userId => 
        axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
    if (activeTab === "followers" && user) {
      fetchFollowersData();
    }
  }, [activeTab, user?.followers]);

  useEffect(() => {
    if (activeTab === "following" && user) {
      fetchFollowingData();
    }
  }, [activeTab, user?.following]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login first");

      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.put(
        `${BASE_URL}/api/users/${user._id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        isFollowing ? `Unfollowed ${user.name}` : `Followed ${user.name}`
      );
      setIsFollowing(!isFollowing);

      // Update followers count
      setUser((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((id) => id !== user._id)
          : [...prev.followers, user._id],
      }));
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <CustomLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(user?.createdAt);
  const formattedDate = joinedDate.toLocaleDateString("en-GB");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">{posts.length} posts</p>
              </div>
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
                src={user.profileImage || defaultImage}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-r from-amber-200 to-rose-300 text-4xl font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-gray-600 mb-2">@{user.username}</p>

              <p className="text-gray-800 mb-3 leading-relaxed">{user.bio || "No bio yet"}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formattedDate}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <button 
                  onClick={() => setActiveTab("following")} 
                  className="hover:underline"
                >
                  <span className="font-semibold text-gray-900">{user.following?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </button>
                <button 
                  onClick={() => setActiveTab("followers")} 
                  className="hover:underline"
                >
                  <span className="font-semibold text-gray-900">{user.followers?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </button>
              </div>
            </div>

            <div className="ml-4">
              <button
                onClick={handleFollow}
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
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={user.profileImage || defaultImage}
                                alt={user.name}
                              />
                              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-xs text-gray-500">{formatTime(post.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
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
                            <button className="flex items-center text-gray-600">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{post.likes?.length || 0}</span>
                            </button>
                            <button className="flex items-center text-gray-600">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{post.comments?.length || 0}</span>
                            </button>
                            <button className="flex items-center text-gray-600">
                              <Share2 className="h-4 w-4 mr-1" />
                              <span>Share</span>
                            </button>
                          </div>
                          <button className="text-gray-600">
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No posts yet</p>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/profile/${follower.username}`)}
                        >
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/profile/${followingUser.username}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Not following anyone yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;