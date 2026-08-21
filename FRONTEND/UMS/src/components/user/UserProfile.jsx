import React from 'react';

const UserProfile = ({ user }) => {
  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="profile-title">
          <h2>{user.name}</h2>
          <span className={`status-badge ${user.status}`}>
            {user.status}
          </span>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-row">
          <div className="detail-item">
            <label>Email</label>
            <span>{user.email}</span>
          </div>
          <div className="detail-item">
            <label>Age</label>
            <span>{user.age}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <label>Salary</label>
            <span>PKR {user.salary ? Number(user.salary).toLocaleString() : '0'}</span>
          </div>
          <div className="detail-item">
            <label>Role</label>
            <span className={`role-badge ${user.role}`}>{user.role}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item full-width">
            <label>Address</label>
            <span>{user.address || 'Not provided'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <label>Gender</label>
            <span>{user.gender || 'Not specified'}</span>
          </div>
          <div className="detail-item">
            <label>Member Since</label>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;