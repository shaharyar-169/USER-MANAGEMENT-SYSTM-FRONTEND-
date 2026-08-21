import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/user/UserProfile';
import '../styles/Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>User Dashboard</h1>
          <div className="user-info">
            <span>👋 Welcome, {user?.name}</span>
            <span className="badge user-badge">User</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <UserProfile user={user} />
      </div>
    </div>
  );
};

export default UserDashboard;