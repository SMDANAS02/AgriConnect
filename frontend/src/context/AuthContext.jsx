import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('agri_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('agri_token') || null);
  const [loading, setLoading] = useState(true);

  // Auto verify session on startup
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authService.getProfile();
          if (response.data && response.data.user) {
            setUser(response.data.user);
            localStorage.setItem('agri_user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('agri_user', JSON.stringify(userData));
      localStorage.setItem('agri_token', userToken);

      toast.success(`Welcome back, ${userData.name}! 🌾`);
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token: userToken } = response.data;

      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('agri_user', JSON.stringify(newUser));
      localStorage.setItem('agri_token', userToken);

      toast.success('Registration successful! Welcome to AgriConnect 🚀');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_token');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('agri_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isFarmer: user?.role === 'farmer',
        isOwner: user?.role === 'equipment_owner',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
