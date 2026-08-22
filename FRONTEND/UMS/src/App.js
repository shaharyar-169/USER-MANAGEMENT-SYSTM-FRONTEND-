// App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/App.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import CompleteRegistration from './pages/CompleteRegistration';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './components/commons/PrivateRoute';
import Header from './components/commons/Header';

function App() {
  const location = useLocation();
  
  // Hide header on auth pages
  const hideHeader = ['/login', '/register', '/complete-registration'].includes(location.pathname);

  return (
    <div className="App">
      {!hideHeader && <Header />}
      <div className={`main-content ${hideHeader ? 'full-width' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-registration" element={<CompleteRegistration />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute roles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;