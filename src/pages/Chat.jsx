import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { user, logout } = useAuth();
  const { selectedUser, fetchUsers } = useChat();
  const navigate = useNavigate();
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">💬</span>
              </div>
              <h1 className="text-2xl font-bold">Live Chat</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full border-2 border-white"
                />
                <span className="font-medium hidden sm:block">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto flex overflow-hidden">
        {/* User List - Left Sidebar */}
        <div
          className={`${
            showUserList ? 'block' : 'hidden'
          } md:block w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col`}
        >
          <UserList />
        </div>

        {/* Chat Window - Main Area */}
        <div
          className={`${
            !showUserList || selectedUser ? 'block' : 'hidden'
          } md:block flex-1 bg-gray-50 flex flex-col`}
        >
          {selectedUser ? (
            <ChatWindow onBack={() => setShowUserList(true)} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-6xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Live Chat
                </h2>
                <p className="text-gray-600">
                  Select a user from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
