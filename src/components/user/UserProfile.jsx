import React from 'react';
import '../../styles/userprofile.css'
const Icon = ({ name, size = 15 }) => {
  const paths = {
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    gender: (
      <>
        <circle cx="10" cy="14" r="6" />
        <path d="M14.5 9.5 21 3" />
        <path d="M15 3h6v6" />
      </>
    ),
    wallet: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
    mapPin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

const UserProfile = ({ user }) => {
  if (!user) {
    return (
      <div className="ud-card ud-pad ud-loading">
        <div className="ud-loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  const status = (user.status || 'active').toLowerCase();
  const role = (user.role || 'user').toLowerCase();

  const checklist = [
    { label: 'Full Name', done: !!user.name },
    { label: 'Email Address', done: !!user.email },
    { label: 'Age', done: !!user.age },
    { label: 'Salary', done: !!user.salary },
    { label: 'Address', done: !!user.address },
    { label: 'Gender', done: !!user.gender },
  ];
  const completeness = Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100
  );

  const infoItems = [
    { label: 'Email Address', value: user.email || '—', icon: 'mail' },
    { label: 'Age', value: user.age || '—', icon: 'user' },
    { label: 'Gender', value: user.gender || 'Not specified', icon: 'gender' },
    {
      label: 'Salary',
      value: `PKR ${user.salary ? Number(user.salary).toLocaleString() : '0'}`,
      icon: 'wallet',
    },
    {
      label: 'Member Since',
      value: user.created_at ? new Date(user.created_at).toLocaleDateString() : '—',
      icon: 'calendar',
    },
    { label: 'Address', value: user.address || 'Not provided', icon: 'mapPin' },
  ];

  return (
    <div className="ud-profile-view">
      {/* Header card */}
      <div className="ud-card ud-pv-head">
        <div className="ud-pv-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          <span className={`ud-presence ud-presence-${status}`} />
        </div>
        <div className="ud-pv-id">
          <h2>{user.name || 'User'}</h2>
          <p>{user.email || '—'}</p>
          <div className="ud-pv-badges">
            <span className={`ud-badge ud-badge-${status}`}>
              <span className={`ud-dot ud-dot-${status}`} />
              {status}
            </span>
            <span className="ud-badge ud-badge-role">{role}</span>
          </div>
        </div>

        {/* Completion */}
        <div className="ud-pv-completion">
          <div className="ud-pv-completion-top">
            <span>Profile Completion</span>
            <strong>{completeness}%</strong>
          </div>
          <div className="ud-progress">
            <div className="ud-progress-fill" style={{ width: `${completeness}%` }} />
          </div>
          <div className="ud-pv-checklist">
            {checklist.map((c) => (
              <span key={c.label} className={`ud-pv-chip${c.done ? ' done' : ''}`}>
                <Icon name={c.done ? 'check' : 'x'} size={10} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="ud-card ud-pad">
        <div className="ud-card-head">
          <h3>Personal Information</h3>
        </div>
        <div className="ud-info-grid">
          {infoItems.map((item) => (
            <div className="ud-info-item" key={item.label}>
              <div className="ud-info-icon">
                <Icon name={item.icon} />
              </div>
              <div className="ud-info-text">
                <span className="ud-info-label">{item.label}</span>
                <span className="ud-info-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
