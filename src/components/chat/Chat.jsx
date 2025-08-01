import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  MessageCircle, 
  Home, 
  Compass, 
  Plus 
} from "lucide-react";

const chatList = [
  {
    id: 1,
    name: "Priya Singh",
    username: "priya_writes",
    avatar: "https://i.pinimg.com/736x/c4/45/91/c4459163457b69580e79b26c1560d5fc.jpg",
    lastMessage: "Your latest shayari was beautiful! 💕",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Ahmed Khan",
    username: "ahmed_shayar",
    avatar: "https://i.pinimg.com/1200x/d5/d6/b7/d5d6b7578ac6527bbb0dca2ecff49533.jpg",
    lastMessage: "Thanks for sharing that Urdu poetry collection",
    time: "1h ago",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Kavya Sharma",
    username: "kavya_poet",
    avatar: "https://i.pinimg.com/1200x/ff/a4/5d/ffa45dde08771142525f87a82293f81a.jpg",
    lastMessage: "Let's collaborate on that poetry project",
    time: "3h ago",
    unread: 1,
    online: true,
  },
];

const messages = [
  {
    id: 1,
    sender: "other",
    content: "Your latest shayari about love was so touching!",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    content: "Thank you so much! It came from the heart ❤️",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "other",
    content: "I could really feel the emotions in every line",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "other",
    content: "Your latest shayari was beautiful! 💕",
    time: "10:35 AM",
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("Sending:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <MessageCircle className="h-6 w-6 text-rose-500" />
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex">
        {/* Chat List - Left Sidebar */}
        <div
          className={`w-full md:w-80 bg-white/70 backdrop-blur-sm border-r border-gray-200 flex flex-col ${
            selectedChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? "bg-rose-50 border-rose-200" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={chat.avatar || "/placeholder.svg"}
                        alt={chat.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-rose-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window - Right Side */}
        {selectedChat ? (
          <div
            className={`flex-1 flex flex-col bg-white/50 backdrop-blur-sm ${
              selectedChat ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 md:hidden"
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={selectedChatData?.avatar || "/placeholder.svg"}
                      alt={selectedChatData?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChatData?.name}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedChatData?.online ? "Online" : "Last seen 2h ago"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === "me"
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "me" ? "text-rose-100" : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full border border-gray-300 rounded-md py-2 pr-10 focus:border-rose-500 focus:ring-rose-500"
                  />
                  <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100">
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-2 rounded-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h2>
              <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/explore" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Compass className="h-5 w-5" />
            <span className="text-xs">Explore</span>
          </Link>
          <Link to="/post" className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Post</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center gap-1 p-2 text-rose-500">
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