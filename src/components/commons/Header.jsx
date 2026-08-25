import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1>👥 User Management</h1>
        </div>
        <div className="header-right">
          {user && (
            <>
              <span className="user-welcome">
                Welcome, {user.name}
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;