import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import CreateUserForm from '../components/admin/CreateUserForm';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    admins: 1,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({
          totalUsers: 124,
          activeUsers: 98,
          pendingUsers: 15,
          admins: 1,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const menuItems = [
    { id: 'users', label: 'All Users', icon: '👥', color: '#667eea' },
    { id: 'create', label: 'Create User', icon: '➕', color: '#4caf50' },
    { id: 'analytics', label: 'Analytics', icon: '📊', color: '#ff9800' },
    { id: 'settings', label: 'Settings', icon: '⚙️', color: '#607d8b' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'users':
        return <UserManagement onUpdateUser={(userData) => {
          // Handle update user
          console.log('Update user:', userData);
        }} />;
      case 'create':
        return <CreateUserForm />;
      case 'analytics':
        return (
          <div className="placeholder-content">
            <div className="placeholder-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="placeholder-content">
            <div className="placeholder-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Coming soon...</p>
          </div>
        );
      default:
        return <UserManagement />;
    }
  };

  const currentMenuItem = menuItems.find(item => item.id === activeTab);

  return (
    <div className="admin-dashboard">
      {isMobile && !sidebarCollapsed && (
        <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">🚀</div>
          {!sidebarCollapsed && (
            <div className="brand-text">
              <span className="brand-name">AdminHub</span>
              <span className="brand-subtitle">Management Panel</span>
            </div>
          )}
          <button className="toggle-btn" onClick={toggleSidebar} title="Toggle Sidebar">
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || 'Admin'}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarCollapsed(true);
              }}
            >
              <span className="nav-icon" style={{ color: item.color }}>{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              {activeTab === item.id && !sidebarCollapsed && (
                <span className="nav-indicator"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">
              <span className="title-icon">{currentMenuItem?.icon}</span>
              {currentMenuItem?.label || 'Dashboard'}
            </h1>
            <span className="page-subtitle">Welcome back, {user?.name || 'Admin'}!</span>
          </div>
          <div className="header-right">
            <div className="header-search">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search users..." />
              <kbd className="search-shortcut">⌘K</kbd>
            </div>
            <div className="header-actions">
              <button className="action-btn" title="Notifications">
                🔔
                <span className="notification-badge">3</span>
              </button>
              <button className="action-btn" title="Messages">
                💬
                <span className="notification-badge">5</span>
              </button>
              <div className="header-user">
                <span className="header-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
                <div className="header-user-info">
                  <span className="header-user-name">{user?.name || 'Admin'}</span>
                  <span className="header-user-role">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card total-users">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">👥</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalUsers}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-trend up">↑ 12.5%</div>
          </div>
          <div className="stat-card active-users">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.activeUsers}</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-trend up">↑ 8.3%</div>
          </div>
          <div className="stat-card pending-users">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.pendingUsers}</span>
              <span className="stat-label">Pending Users</span>
            </div>
            <div className="stat-trend down">↓ 2.1%</div>
          </div>
          <div className="stat-card admins">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">👑</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.admins}</span>
              <span className="stat-label">Admins</span>
            </div>
            <div className="stat-trend">—</div>
          </div>
        </div>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;