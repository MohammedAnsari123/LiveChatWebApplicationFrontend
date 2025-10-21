import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typing, setTyping] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      socketRef.current = io('http://localhost:5000', {
        auth: { token }
      });

      // Emit user online status
      socketRef.current.emit('user-online', user._id);

      // Listen for user status changes
      socketRef.current.on('user-status-change', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (status === 'online') {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });

        // Update users list
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u._id === userId ? { ...u, isOnline: status === 'online' } : u
          )
        );
      });

      // Listen for incoming messages
      socketRef.current.on('receive-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicator
      socketRef.current.on('user-typing', (userId) => {
        setTyping(userId);
      });

      // Listen for stop typing
      socketRef.current.on('user-stop-typing', () => {
        setTyping(null);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, token]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users');
      setUsers(data);
      
      // Update online status
      const online = new Set(data.filter(u => u.isOnline).map(u => u._id));
      setOnlineUsers(online);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch messages with a specific user
  const fetchMessages = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/${userId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (receiverId, content) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/messages', {
        receiverId,
        content,
        messageType: 'text'
      });

      setMessages(prev => [...prev, data]);

      // Emit message through socket
      if (socketRef.current) {
        socketRef.current.emit('send-message', data);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (receiverId) => {
    if (socketRef.current && user) {
      socketRef.current.emit('typing', {
        senderId: user._id,
        receiverId
      });
    }
  };

  // Stop typing indicator
  const stopTypingIndicator = (receiverId) => {
    if (socketRef.current && user) {
      socketRef.current.emit('stop-typing', {
        senderId: user._id,
        receiverId
      });
    }
  };

  const value = {
    users,
    selectedUser,
    setSelectedUser,
    messages,
    onlineUsers,
    typing,
    fetchUsers,
    fetchMessages,
    sendMessage,
    sendTypingIndicator,
    stopTypingIndicator
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
