import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`);
          setUser(data);
        } catch (error) {
          console.error('Error loading user:', error);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const signup = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
        name,
        email,
        password
      });
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
