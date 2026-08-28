import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/user/UserProfile';
import '../styles/UserDashboard.css';

/* --------------------------------------------
   Icons
-------------------------------------------- */
const Icon = ({ name, size = 18 }) => {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    activity: (
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    wallet: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    key: (
      <>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    checkCircle: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    mapPin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    alert: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
    layers: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || null}
    </svg>
  );
};

/* --------------------------------------------
   Constants
-------------------------------------------- */
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'profile', label: 'My Profile', icon: 'user' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
];

const VIEW_TITLES = {
  overview: 'Overview',
  profile: 'My Profile',
  security: 'Security',
  activity: 'Activity',
};

const ROLE_DESC = {
  admin: 'Full system access',
  editor: 'Content management access',
  user: 'Standard account access',
};

/* --------------------------------------------
   Component
-------------------------------------------- */
const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close mobile sidebar on resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Lock body scroll when sidebar is open on mobile */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  /* Derived data */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const status = (user?.status || 'active').toLowerCase();
  const role = (user?.role || 'user').toLowerCase();

  const joined = user?.created_at ? new Date(user.created_at) : null;
  const days = joined ? Math.max(0, Math.floor((Date.now() - joined.getTime()) / 86400000)) : 0;
  const memberFor =
    days >= 365
      ? `${Math.floor(days / 365)} yr ${Math.floor((days % 365) / 30)} mo`
      : `${Math.max(1, Math.floor(days / 30))} mo`;

  const checklist = useMemo(() => ([
    { label: 'Full Name', done: !!user?.name },
    { label: 'Email Address', done: !!user?.email },
    { label: 'Age', done: !!user?.age },
    { label: 'Salary', done: !!user?.salary },
    { label: 'Address', done: !!user?.address },
    { label: 'Gender', done: !!user?.gender },
  ]), [user]);

  const completeness = Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100
  );

  const activity = useMemo(() => {
    if (!user) return [];
    const items = [];
    const created = user.created_at ? new Date(user.created_at) : null;
    const updated = user.updated_at ? new Date(user.updated_at) : null;

    if (created) {
      items.push({
        id: 'created', type: 'success', icon: 'users',
        title: 'Account created',
        desc: 'Invitation accepted via email',
        date: created,
      });
    }
    if (updated) {
      items.push({
        id: 'updated', type: 'info', icon: 'edit',
        title: 'Profile updated',
        desc: 'Account details were modified by administrator',
        date: updated,
      });
    }
    items.push({
      id: 'status',
      type: status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'warn',
      icon: 'shield',
      title: `Account status: ${status}`,
      desc: 'Managed by your administrator',
      date: updated || created || new Date(),
    });
    items.push({
      id: 'member', type: 'info', icon: 'clock',
      title: `Member for ${joined ? memberFor : '—'}`,
      desc: 'Continuous account membership',
      date: new Date(),
    });
    return items.sort((a, b) => b.date - a.date);
  }, [user, status, memberFor, joined]);

  const notifications = useMemo(() => {
    const items = [];
    if (completeness < 100) {
      items.push({
        id: 'profile', icon: 'alert', type: 'warn',
        title: 'Complete your profile',
        desc: `${completeness}% complete — add your missing details`,
        action: () => setView('profile'),
        actionLabel: 'Complete now',
      });
    }
    if (status === 'pending') {
      items.push({
        id: 'pending', icon: 'info', type: 'info',
        title: 'Account pending approval',
        desc: 'An administrator will review your account shortly',
      });
    }
    if (items.length === 0) {
      items.push({
        id: 'clear', icon: 'checkCircle', type: 'success',
        title: "You're all caught up",
        desc: 'No new notifications right now',
      });
    }
    return items;
  }, [completeness, status]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goView = (v) => {
    setView(v);
    setSidebarOpen(false);
    setOpenMenu(null);
  };

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (!user) {
    return (
      <div className="ud-shell ud-shell-loading">
        <div className="ud-loading-spinner" />
        <p>Loading your portal...</p>
      </div>
    );
  }

  /* --------------------------------------------
     Render
  -------------------------------------------- */
  return (
    <div className="ud-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="ud-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`ud-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="ud-brand">
          <div className="ud-brand-logo">
            <Icon name="layers" size={20} />
          </div>
          <div className="ud-brand-text">
            <span className="ud-brand-name">UserPortal</span>
            <span className="ud-brand-sub">Employee Portal</span>
          </div>
          <button className="ud-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="ud-sidebar-user">
          <div className="ud-sidebar-avatar">
            {user.name?.charAt(0).toUpperCase() || 'U'}
            <span className={`ud-presence ud-presence-${status}`} />
          </div>
          <div className="ud-sidebar-user-info">
            <span className="ud-sidebar-user-name">{user.name || 'User'}</span>
            <span className="ud-sidebar-user-role">{role}</span>
          </div>
        </div>

        <nav className="ud-nav">
          <span className="ud-nav-title">Menu</span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`ud-nav-item${view === item.id ? ' active' : ''}`}
              onClick={() => goView(item.id)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {view === item.id && <span className="ud-nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="ud-sidebar-foot">
          <button className="ud-nav-item ud-logout" onClick={handleLogout}>
            <Icon name="logout" size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="ud-main">
        {/* Topbar */}
        <header className="ud-topbar">
          <div className="ud-topbar-left">
            <button className="ud-hamburger" onClick={() => setSidebarOpen(true)}>
              <Icon name="menu" size={18} />
            </button>
            <div className="ud-topbar-title">
              <h1>{VIEW_TITLES[view]}</h1>
              <span>{today}</span>
            </div>
          </div>

          <div className="ud-topbar-right" ref={menuRef}>
            {/* Notifications */}
            <div className="ud-menu-wrap">
              <button
                className={`ud-icon-btn${openMenu === 'notif' ? ' active' : ''}`}
                onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}
              >
                <Icon name="bell" size={17} />
                {notifications.some((n) => n.id !== 'clear') && (
                  <span className="ud-badge-dot" />
                )}
              </button>

              {openMenu === 'notif' && (
                <div className="ud-dropdown ud-dropdown-notif">
                  <div className="ud-dropdown-head">
                    <span>Notifications</span>
                    <span className="ud-dropdown-count">{notifications.length}</span>
                  </div>
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      className="ud-notif-item"
                      onClick={() => (n.action ? (n.action(), setOpenMenu(null)) : setOpenMenu(null))}
                    >
                      <span className={`ud-notif-icon ud-notif-${n.type}`}>
                        <Icon name={n.icon} size={14} />
                      </span>
                      <span className="ud-notif-text">
                        <span className="ud-notif-title">{n.title}</span>
                        <span className="ud-notif-desc">{n.desc}</span>
                        {n.actionLabel && (
                          <span className="ud-notif-link">{n.actionLabel}
                            <Icon name="chevronRight" size={11} />
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="ud-menu-wrap">
              <button
                className={`ud-user-btn${openMenu === 'profile' ? ' active' : ''}`}
                onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
              >
                <span className="ud-topbar-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="ud-user-btn-text">
                  <span className="ud-user-btn-name">{user.name || 'User'}</span>
                  <span className="ud-user-btn-role">{role}</span>
                </span>
                <Icon name="chevronDown" size={13} />
              </button>

              {openMenu === 'profile' && (
                <div className="ud-dropdown ud-dropdown-profile">
                  <div className="ud-dropdown-user">
                    <span className="ud-topbar-avatar lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <div>
                      <span className="ud-dropdown-user-name">{user.name}</span>
                      <span className="ud-dropdown-user-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="ud-dropdown-sep" />
                  <button className="ud-dropdown-item" onClick={() => goView('profile')}>
                    <Icon name="user" size={15} /> My Profile
                  </button>
                  <button className="ud-dropdown-item" onClick={() => navigate('/forgot-password')}>
                    <Icon name="key" size={15} /> Reset Password
                  </button>
                  <div className="ud-dropdown-sep" />
                  <button className="ud-dropdown-item danger" onClick={handleLogout}>
                    <Icon name="logout" size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="ud-content" key={view}>

          {/* ---------- OVERVIEW ---------- */}
          {view === 'overview' && (
            <>
              {/* Welcome */}
              <section className="ud-welcome">
                <div className="ud-welcome-decor ud-wd-1" />
                <div className="ud-welcome-decor ud-wd-2" />
                <div className="ud-welcome-text">
                  <h2>{greeting}, {user.name?.split(' ')[0]}.</h2>
                  <p>Here's what's happening with your account today.</p>
                </div>
                <div className="ud-welcome-actions">
                  <button className="ud-btn ud-btn-white" onClick={() => goView('profile')}>
                    <Icon name="edit" size={14} /> Edit Profile
                  </button>
                  <button className="ud-btn ud-btn-ghost" onClick={() => navigate('/forgot-password')}>
                    <Icon name="key" size={14} /> Change Password
                  </button>
                </div>
              </section>

              {/* Overview cards */}
              <section className="ud-cards">
                <div className="ud-card ud-oc">
                  <div className="ud-oc-head">
                    <span>Account Status</span>
                    <span className="ud-oc-icon"><Icon name="activity" size={16} /></span>
                  </div>
                  <span className={`ud-oc-value ud-tx-${status}`}>
                    <span className={`ud-dot ud-dot-${status}`} />
                    {status}
                  </span>
                  <span className="ud-oc-sub">Updated by administrator</span>
                </div>

                <div className="ud-card ud-oc">
                  <div className="ud-oc-head">
                    <span>Access Role</span>
                    <span className="ud-oc-icon"><Icon name="award" size={16} /></span>
                  </div>
                  <span className="ud-oc-value ud-capitalize">{role}</span>
                  <span className="ud-oc-sub">{ROLE_DESC[role] || 'Account access'}</span>
                </div>

                <div className="ud-card ud-oc">
                  <div className="ud-oc-head">
                    <span>Member For</span>
                    <span className="ud-oc-icon"><Icon name="clock" size={16} /></span>
                  </div>
                  <span className="ud-oc-value">{joined ? memberFor : '—'}</span>
                  <span className="ud-oc-sub">
                    {joined ? `Since ${formatDate(joined)}` : '—'}
                  </span>
                </div>

                <div className="ud-card ud-oc">
                  <div className="ud-oc-head">
                    <span>Salary</span>
                    <span className="ud-oc-icon"><Icon name="wallet" size={16} /></span>
                  </div>
                  <span className="ud-oc-value">
                    {user.salary ? `PKR ${Number(user.salary).toLocaleString()}` : '—'}
                  </span>
                  <span className="ud-oc-sub">Monthly gross</span>
                </div>
              </section>

              {/* Completion + Security */}
              <section className="ud-grid-2">
                <div className="ud-card ud-pad">
                  <div className="ud-card-head">
                    <h3>Profile Completion</h3>
                    <span className="ud-chip ud-chip-accent">{completeness}%</span>
                  </div>
                  <div className="ud-progress">
                    <div className="ud-progress-fill" style={{ width: `${completeness}%` }} />
                  </div>
                  <ul className="ud-checklist">
                    {checklist.map((c) => (
                      <li key={c.label} className={c.done ? 'done' : ''}>
                        <span className="ud-check-ico">
                          <Icon name={c.done ? 'check' : 'x'} size={11} />
                        </span>
                        {c.label}
                      </li>
                    ))}
                  </ul>
                  {completeness < 100 && (
                    <button className="ud-btn ud-btn-primary ud-btn-block" onClick={() => goView('profile')}>
                      Complete Profile
                    </button>
                  )}
                </div>

                <div className="ud-card ud-pad">
                  <div className="ud-card-head">
                    <h3>Security Overview</h3>
                    <span className={`ud-chip ud-chip-${status}`}>{status}</span>
                  </div>
                  <ul className="ud-sec-list">
                    <li>
                      <span className="ud-sec-ico ok"><Icon name="checkCircle" size={15} /></span>
                      <div>
                        <span className="ud-sec-title">Protected Account</span>
                        <span className="ud-sec-desc">Secured with JWT authentication</span>
                      </div>
                    </li>
                    <li>
                      <span className="ud-sec-ico accent"><Icon name="award" size={15} /></span>
                      <div>
                        <span className="ud-sec-title">{ROLE_DESC[role] || 'Standard access'}</span>
                        <span className="ud-sec-desc">Access level: {role}</span>
                      </div>
                    </li>
                    <li>
                      <span className="ud-sec-ico warn"><Icon name="key" size={15} /></span>
                      <div>
                        <span className="ud-sec-title">Password</span>
                        <span className="ud-sec-desc">Reset anytime via email verification</span>
                      </div>
                      <button className="ud-btn ud-btn-soft" onClick={() => navigate('/forgot-password')}>
                        Reset
                      </button>
                    </li>
                    <li>
                      <span className="ud-sec-ico accent"><Icon name="calendar" size={15} /></span>
                      <div>
                        <span className="ud-sec-title">Member Since</span>
                        <span className="ud-sec-desc">{joined ? formatDate(joined) : '—'}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Activity + Personal info */}
              <section className="ud-grid-2">
                <div className="ud-card ud-pad">
                  <div className="ud-card-head">
                    <h3>Recent Activity</h3>
                    <button className="ud-link" onClick={() => goView('activity')}>
                      View all <Icon name="chevronRight" size={12} />
                    </button>
                  </div>
                  <ul className="ud-activity">
                    {activity.slice(0, 4).map((a) => (
                      <li key={a.id}>
                        <span className={`ud-act-ico ud-act-${a.type}`}>
                          <Icon name={a.icon} size={14} />
                        </span>
                        <div className="ud-act-body">
                          <span className="ud-act-title">{a.title}</span>
                          <span className="ud-act-desc">{a.desc}</span>
                        </div>
                        <span className="ud-act-date">{formatDate(a.date)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ud-card ud-pad">
                  <div className="ud-card-head">
                    <h3>Personal Information</h3>
                    <button className="ud-link" onClick={() => goView('profile')}>
                      View all <Icon name="chevronRight" size={12} />
                    </button>
                  </div>
                  <div className="ud-mini-grid">
                    <div className="ud-mini">
                      <span className="ud-mini-label">Email</span>
                      <span className="ud-mini-value">{user.email || '—'}</span>
                    </div>
                    <div className="ud-mini">
                      <span className="ud-mini-label">Age</span>
                      <span className="ud-mini-value">{user.age || '—'}</span>
                    </div>
                    <div className="ud-mini">
                      <span className="ud-mini-label">Gender</span>
                      <span className="ud-mini-value">{user.gender || '—'}</span>
                    </div>
                    <div className="ud-mini">
                      <span className="ud-mini-label">Address</span>
                      <span className="ud-mini-value">{user.address || '—'}</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ---------- MY PROFILE ---------- */}
          {view === 'profile' && <UserProfile user={user} />}

          {/* ---------- SECURITY ---------- */}
          {view === 'security' && (
            <div className="ud-grid-2 ud-grid-security">
              <div className="ud-card ud-pad">
                <div className="ud-card-head">
                  <h3>Account Security</h3>
                  <span className={`ud-chip ud-chip-${status}`}>{status}</span>
                </div>
                <ul className="ud-sec-list">
                  <li>
                    <span className="ud-sec-ico ok"><Icon name="checkCircle" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">Protected Account</span>
                      <span className="ud-sec-desc">Session secured with JWT token authentication</span>
                    </div>
                  </li>
                  <li>
                    <span className="ud-sec-ico accent"><Icon name="award" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">{ROLE_DESC[role] || 'Standard access'}</span>
                      <span className="ud-sec-desc">Role-based access level: {role}</span>
                    </div>
                  </li>
                  <li>
                    <span className="ud-sec-ico warn"><Icon name="key" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">Password</span>
                      <span className="ud-sec-desc">Reset via email verification link</span>
                    </div>
                    <button className="ud-btn ud-btn-soft" onClick={() => navigate('/forgot-password')}>
                      Change
                    </button>
                  </li>
                  <li>
                    <span className="ud-sec-ico accent"><Icon name="mail" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">Verified Email</span>
                      <span className="ud-sec-desc">{user.email || '—'}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="ud-card ud-pad">
                <div className="ud-card-head">
                  <h3>Account Details</h3>
                </div>
                <ul className="ud-sec-list">
                  <li>
                    <span className="ud-sec-ico accent"><Icon name="user" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">Account Holder</span>
                      <span className="ud-sec-desc">{user.name || '—'}</span>
                    </div>
                  </li>
                  <li>
                    <span className="ud-sec-ico accent"><Icon name="calendar" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">Member Since</span>
                      <span className="ud-sec-desc">{joined ? formatDate(joined) : '—'}</span>
                    </div>
                  </li>
                  <li>
                    <span className="ud-sec-ico accent"><Icon name="clock" size={15} /></span>
                    <div>
                      <span className="ud-sec-title">Membership Duration</span>
                      <span className="ud-sec-desc">{joined ? memberFor : '—'}</span>
                    </div>
                  </li>
                  <li>
                    <span className={`ud-sec-ico ${status === 'active' ? 'ok' : status === 'inactive' ? 'danger' : 'warn'}`}>
                      <Icon name={status === 'active' ? 'checkCircle' : 'alert'} size={15} />
                    </span>
                    <div>
                      <span className="ud-sec-title">Current Status</span>
                      <span className="ud-sec-desc">
                        {status === 'active'
                          ? 'Your account is fully active'
                          : status === 'pending'
                          ? 'Awaiting administrator approval'
                          : 'Account is currently deactivated'}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ---------- ACTIVITY ---------- */}
          {view === 'activity' && (
            <div className="ud-card ud-pad">
              <div className="ud-card-head">
                <h3>Account Activity</h3>
                <span className="ud-chip ud-chip-accent">{activity.length} events</span>
              </div>
              <ul className="ud-activity ud-activity-lg">
                {activity.map((a) => (
                  <li key={a.id}>
                    <span className={`ud-act-ico ud-act-${a.type}`}>
                      <Icon name={a.icon} size={15} />
                    </span>
                    <div className="ud-act-body">
                      <span className="ud-act-title">{a.title}</span>
                      <span className="ud-act-desc">{a.desc}</span>
                    </div>
                    <span className="ud-act-date">{formatDate(a.date)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;