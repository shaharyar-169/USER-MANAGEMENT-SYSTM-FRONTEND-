import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserManagement from '../components/admin/UserManagement';
import CreateUserForm from '../components/admin/CreateUserForm';
import '../styles/Dashboard.css';
import '../styles/State.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    inactiveUsers: 0,
    admins: 0,
    totalGrowth: '0%',
    activeGrowth: '0%',
    pendingGrowth: '0%',
    inactiveGrowth: '0%',
    adminGrowth: '—'
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const response = await api.get('/users');
        const users = response.data.users || [];
        
        // Calculate stats from real data
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const pendingUsers = users.filter(u => u.status === 'pending').length;
        const inactiveUsers = users.filter(u => u.status === 'inactive').length;
        const admins = users.filter(u => u.role === 'admin').length;
        
        // Calculate growth (compare with previous month)
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const newUsers = users.filter(u => new Date(u.created_at) > oneMonthAgo).length;
        const previousTotal = totalUsers - newUsers;
        const totalGrowth = previousTotal > 0 ? `${Math.round((newUsers / previousTotal) * 100)}%` : '0%';
        
        const newActive = users.filter(u => u.status === 'active' && new Date(u.created_at) > oneMonthAgo).length;
        const previousActive = activeUsers - newActive;
        const activeGrowth = previousActive > 0 ? `${Math.round((newActive / previousActive) * 100)}%` : '0%';
        
        const newPending = users.filter(u => u.status === 'pending' && new Date(u.created_at) > oneMonthAgo).length;
        const previousPending = pendingUsers - newPending;
        const pendingGrowth = previousPending > 0 ? `${Math.round((newPending / previousPending) * 100)}%` : '0%';
        
        const newInactive = users.filter(u => u.status === 'inactive' && new Date(u.created_at) > oneMonthAgo).length;
        const previousInactive = inactiveUsers - newInactive;
        const inactiveGrowth = previousInactive > 0 ? `${Math.round((newInactive / previousInactive) * 100)}%` : '0%';
        
        setStats({
          totalUsers,
          activeUsers,
          pendingUsers,
          inactiveUsers,
          admins,
          totalGrowth,
          activeGrowth,
          pendingGrowth,
          inactiveGrowth,
          adminGrowth: '—'
        });
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
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

  // Helper to get trend class
  const getTrendClass = (value) => {
    if (value === '—' || value === '0%') return 'neutral';
    const numValue = parseFloat(value);
    if (numValue > 0) return 'up';
    if (numValue < 0) return 'down';
    return 'neutral';
  };

  // Helper to get trend icon
  const getTrendIcon = (value) => {
    if (value === '—' || value === '0%') {
      return (
        <line x1="5" y1="12" x2="19" y2="12"/>
      );
    }
    const numValue = parseFloat(value);
    if (numValue > 0) {
      return (
        <>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </>
      );
    }
    return (
      <>
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
        <polyline points="17 18 23 18 23 12"/>
      </>
    );
  };

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

        {/* ✅ Stats Cards with Real Data - Including Inactive Users */}
        {loading ? (
          <div className="stats-loading">
            <div className="stats-loading-spinner"></div>
            <p>Loading stats...</p>
          </div>
        ) : (
          <div className="stats-grid">
            {/* Total Users */}
            <div className="stat-card total-users">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">👥</span>
                </div>
                <div className="stat-content">
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalUsers}</span>
                    <span className="stat-label">Total Users</span>
                  </div>
                  <div className={`stat-trend ${getTrendClass(stats.totalGrowth)}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {getTrendIcon(stats.totalGrowth)}
                    </svg>
                    {stats.totalGrowth}
                  </div>
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{ 
                  width: `${Math.min((stats.totalUsers / 100) * 100, 100)}%` 
                }}></div>
              </div>
            </div>

            {/* Active Users */}
            <div className="stat-card active-users">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">✅</span>
                </div>
                <div className="stat-content">
                  <div className="stat-info">
                    <span className="stat-value">{stats.activeUsers}</span>
                    <span className="stat-label">Active Users</span>
                  </div>
                  <div className={`stat-trend ${getTrendClass(stats.activeGrowth)}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {getTrendIcon(stats.activeGrowth)}
                    </svg>
                    {stats.activeGrowth}
                  </div>
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{ 
                  width: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%` 
                }}></div>
              </div>
            </div>

            {/* Pending Users */}
            <div className="stat-card pending-users">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">⏳</span>
                </div>
                <div className="stat-content">
                  <div className="stat-info">
                    <span className="stat-value">{stats.pendingUsers}</span>
                    <span className="stat-label">Pending Users</span>
                  </div>
                  <div className={`stat-trend ${getTrendClass(stats.pendingGrowth)}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {getTrendIcon(stats.pendingGrowth)}
                    </svg>
                    {stats.pendingGrowth}
                  </div>
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{ 
                  width: `${stats.totalUsers > 0 ? Math.round((stats.pendingUsers / stats.totalUsers) * 100) : 0}%` 
                }}></div>
              </div>
            </div>

            {/* ✅ Inactive Users - NEW */}
            <div className="stat-card inactive-users">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">🚫</span>
                </div>
                <div className="stat-content">
                  <div className="stat-info">
                    <span className="stat-value">{stats.inactiveUsers}</span>
                    <span className="stat-label">Inactive Users</span>
                  </div>
                  <div className={`stat-trend ${getTrendClass(stats.inactiveGrowth)}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {getTrendIcon(stats.inactiveGrowth)}
                    </svg>
                    {stats.inactiveGrowth}
                  </div>
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{ 
                  width: `${stats.totalUsers > 0 ? Math.round((stats.inactiveUsers / stats.totalUsers) * 100) : 0}%` 
                }}></div>
              </div>
            </div>

            {/* Admins */}
            <div className="stat-card admins">
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">👑</span>
                </div>
                <div className="stat-content">
                  <div className="stat-info">
                    <span className="stat-value">{stats.admins}</span>
                    <span className="stat-label">Admins</span>
                  </div>
                  <div className="stat-trend neutral">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {stats.adminGrowth}
                  </div>
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{ 
                  width: `${stats.totalUsers > 0 ? Math.round((stats.admins / stats.totalUsers) * 100) : 0}%` 
                }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;