import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserManagement from '../components/admin/UserManagement';
import CreateUserForm from '../components/admin/CreateUserForm';
import ActivityLog from '../components/admin/ActivityLog';
import '../styles/Dashboard.css';
import '../styles/State.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        const users = response.data.users || [];

        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const pendingUsers = users.filter(u => u.status === 'pending').length;
        const inactiveUsers = users.filter(u => u.status === 'inactive').length;
        const admins = users.filter(u => u.role === 'admin').length;

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const menuItems = [
    { id: 'users', label: 'All Users', icon: 'users' },
    { id: 'create', label: 'Create User', icon: 'create' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'activity', label: 'Activity', icon: 'activity' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      create: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      ),
      analytics: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      activity: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
      logout: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      ),
      search: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ),
      bell: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      chevronDown: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      ),
      arrowLeft: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      ),
      arrowRight: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement onUpdateUser={(userData) => {
          console.log('Update user:', userData);
        }} />;
      case 'create':
        return <CreateUserForm />;
      case 'analytics':
        return (
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Coming soon...</p>
          </div>
        );
      case 'activity':
        return <ActivityLog />;
      case 'settings':
        return (
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3>Settings</h3>
            <p>Coming soon...</p>
          </div>
        );
      default:
        return <UserManagement />;
    }
  };

  const currentMenuItem = menuItems.find(item => item.id === activeTab);

  const getTrendClass = (value) => {
    if (value === '—' || value === '0%') return 'neutral';
    const numValue = parseFloat(value);
    if (numValue > 0) return 'up';
    if (numValue < 0) return 'down';
    return 'neutral';
  };

  const getTrendIcon = (value) => {
    if (value === '—' || value === '0%') {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      );
    }
    const numValue = parseFloat(value);
    if (numValue > 0) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
        <polyline points="17 18 23 18 23 12"/>
      </svg>
    );
  };

  return (
    <div className="admin-dashboard">
      {isMobile && !sidebarCollapsed && (
        <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div className="brand-text">
              <span className="brand-name">AdminHub</span>
              <span className="brand-subtitle">Management Panel</span>
            </div>
          )}
          <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
            {sidebarCollapsed ? renderIcon('arrowRight') : renderIcon('arrowLeft')}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
            <span className="status-dot online"></span>
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || 'Admin'}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main Menu</span>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarCollapsed(true);
              }}
            >
              <span className="nav-icon">{renderIcon(item.icon)}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              {activeTab === item.id && !sidebarCollapsed && (
                <span className="nav-indicator"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">{renderIcon('logout')}</span>
            {!sidebarCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
<header className="top-header">
          <div className="header-row">
            <div className="header-left">
              <button className="mobile-menu-btn" onClick={toggleSidebar} title="Open Menu" aria-label="Open Menu">
                {renderIcon('menu')}
              </button>
              <div className="page-header">
                <h1 className="page-title">{currentMenuItem?.label || 'Dashboard'}</h1>
                <span className="page-subtitle">Welcome back, {user?.name || 'Admin'}!</span>
              </div>
            </div>
            <div className="header-right">
              <div className="header-actions">
                <button className="action-btn" title="Notifications">
                  {renderIcon('bell')}
                  <span className="notification-badge">3</span>
                </button>
                <div className="header-user-wrapper" ref={userMenuRef}>
                  <div
                    className={`header-user ${userMenuOpen ? 'open' : ''}`}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="header-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                    <div className="header-user-info">
                      <span className="header-user-name">{user?.name || 'Admin'}</span>
                      <span className="header-user-role">Admin</span>
                    </div>
                    <span className={`header-user-chevron ${userMenuOpen ? 'open' : ''}`}>
                      {renderIcon('chevronDown')}
                    </span>
                  </div>
                  {userMenuOpen && (
                    <div className="header-user-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          <span className="dropdown-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                          <div>
                            <div className="dropdown-user-name">{user?.name || 'Admin'}</div>
                            <div className="dropdown-user-email">{user?.email || 'admin@example.com'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-items">
                        <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); }}>
                          {renderIcon('user')}
                          Admin Profile
                        </button>
                        <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); }}>
                          {renderIcon('settings')}
                          Settings
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                          {renderIcon('logout')}
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="stats-loading">
            <div className="stats-loading-spinner"></div>
            <p>Loading stats...</p>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card total-users">
              <div className="stat-card-header">
                <span className="stat-label">Total Users</span>
                <div className="stat-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-card-body">
                <span className="stat-value">{stats.totalUsers}</span>
                <div className={`stat-trend ${getTrendClass(stats.totalGrowth)}`}>
                  {getTrendIcon(stats.totalGrowth)}
                  {stats.totalGrowth}
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{
                  width: `${Math.min((stats.totalUsers / 100) * 100, 100)}%`
                }}></div>
              </div>
            </div>

            <div className="stat-card active-users">
              <div className="stat-card-header">
                <span className="stat-label">Active Users</span>
                <div className="stat-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>
              <div className="stat-card-body">
                <span className="stat-value">{stats.activeUsers}</span>
                <div className={`stat-trend ${getTrendClass(stats.activeGrowth)}`}>
                  {getTrendIcon(stats.activeGrowth)}
                  {stats.activeGrowth}
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{
                  width: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%`
                }}></div>
              </div>
            </div>

            <div className="stat-card pending-users">
              <div className="stat-card-header">
                <span className="stat-label">Pending Users</span>
                <div className="stat-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
              <div className="stat-card-body">
                <span className="stat-value">{stats.pendingUsers}</span>
                <div className={`stat-trend ${getTrendClass(stats.pendingGrowth)}`}>
                  {getTrendIcon(stats.pendingGrowth)}
                  {stats.pendingGrowth}
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{
                  width: `${stats.totalUsers > 0 ? Math.round((stats.pendingUsers / stats.totalUsers) * 100) : 0}%`
                }}></div>
              </div>
            </div>

            <div className="stat-card inactive-users">
              <div className="stat-card-header">
                <span className="stat-label">Inactive Users</span>
                <div className="stat-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                </div>
              </div>
              <div className="stat-card-body">
                <span className="stat-value">{stats.inactiveUsers}</span>
                <div className={`stat-trend ${getTrendClass(stats.inactiveGrowth)}`}>
                  {getTrendIcon(stats.inactiveGrowth)}
                  {stats.inactiveGrowth}
                </div>
              </div>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill" style={{
                  width: `${stats.totalUsers > 0 ? Math.round((stats.inactiveUsers / stats.totalUsers) * 100) : 0}%`
                }}></div>
              </div>
            </div>

            <div className="stat-card admins">
              <div className="stat-card-header">
                <span className="stat-label">Admins</span>
                <div className="stat-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-card-body">
                <span className="stat-value">{stats.admins}</span>
                <div className="stat-trend neutral">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {stats.adminGrowth}
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
