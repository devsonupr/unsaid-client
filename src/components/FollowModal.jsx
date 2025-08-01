// components/FollowModal.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CustomLoader from './CustomLoader';
import { BASE_URL } from "../config.js";

const FollowModal = ({ type, userIds, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!userIds || userIds.length === 0) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${BASE_URL}/api/users/get-users-by-ids`,
          { userIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center p-8">
              <CustomLoader />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {type} found
            </div>
          ) : (
            <ul>
              {users.map(user => (
                <li key={user._id} className="border-b border-gray-100 last:border-0">
                  <div className="flex items-center p-4 hover:bg-gray-50">
                    <img
                      src={user.profileImage || "https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.name}</p>
                    </div>
                    <button className="text-blue-500 text-sm font-semibold">
                      Follow
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;


