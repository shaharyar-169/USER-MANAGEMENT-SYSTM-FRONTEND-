import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentAuthToken = null;

export const setAuthToken = (token) => {
  currentAuthToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const getStoredToken = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const tokenKey = user.role === 'admin' ? 'admin_token' : 'user_token';
      return localStorage.getItem(tokenKey);
    } catch (e) {
      return null;
    }
  }
  return null;
};

if (typeof window !== 'undefined') {
  const storedToken = getStoredToken();
  if (storedToken) {
    setAuthToken(storedToken);
  }
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (currentAuthToken) {
      config.headers.Authorization = `Bearer ${currentAuthToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const storedAdminUser = localStorage.getItem('admin_user');
      const storedNormalUser = localStorage.getItem('user_user');
      
      if (storedAdminUser) {
        try {
          const user = JSON.parse(storedAdminUser);
          if (user.role === 'admin') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
          }
        } catch (e) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      }
      if (storedNormalUser) {
        try {
          const user = JSON.parse(storedNormalUser);
          if (user.role === 'user') {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_user');
          }
        } catch (e) {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_user');
        }
      }
      // Clean up legacy keys
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;