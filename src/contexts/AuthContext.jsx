// context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';
import PasswordResetService from '../services/passwordReset'; // ✅ Import password reset service


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getTokenKey = (role) => role === 'admin' ? 'admin_token' : 'user_token';
const getUserKey = (role) => role === 'admin' ? 'admin_user' : 'user_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedAdminUser = localStorage.getItem('admin_user');
    const storedNormalUser = localStorage.getItem('user_user');
    
    let storedUser = null;
    let tokenKey = null;
    
    if (storedAdminUser) {
      try {
        const parsed = JSON.parse(storedAdminUser);
        if (parsed.role === 'admin') {
          storedUser = parsed;
          tokenKey = 'admin_token';
        }
      } catch (e) {}
    }
    
    if (!storedUser && storedNormalUser) {
      try {
        const parsed = JSON.parse(storedNormalUser);
        if (parsed.role === 'user') {
          storedUser = parsed;
          tokenKey = 'user_token';
        }
      } catch (e) {}
    }
    
    if (storedUser && tokenKey) {
      const storedToken = localStorage.getItem(tokenKey);
      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
        fetchUser();
        return;
      }
    }
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      const tokenKey = getTokenKey(user.role);
      const userKey = getUserKey(user.role);
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(user));
      setAuthToken(token);
      setToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      const tokenKey = getTokenKey(user.role);
      const userKey = getUserKey(user.role);
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    if (user) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout API error:', error);
      }
      const tokenKey = getTokenKey(user.role);
      const userKey = getUserKey(user.role);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    }
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  // ============================================
  // ✅ NEW: Password Reset Methods
  // ============================================

  /**
   * 1. Forgot Password - Request reset link
   * @param {string} email - User's email
   */
  const forgotPassword = async (email) => {
    try {
      const result = await PasswordResetService.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Failed to send reset link. Please try again.'
      };
    }
  };

  /**
   * 2. Validate Reset Token
   * @param {string} token - Reset token from URL
   */
  const validateResetToken = async (token) => {
    try {
      const result = await PasswordResetService.validateResetToken(token);
      return result;
    } catch (error) {
      console.error('Validate token error:', error);
      return {
        valid: false,
        message: 'Failed to validate reset link.'
      };
    }
  };

  /**
   * 3. Reset Password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm password
   */
  const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
      const result = await PasswordResetService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to reset password. Please try again.'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,        // ✅ New
    validateResetToken,    // ✅ New
    resetPassword,         // ✅ New
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};