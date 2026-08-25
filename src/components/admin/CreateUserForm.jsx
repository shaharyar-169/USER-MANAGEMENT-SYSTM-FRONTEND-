// components/admin/CreateUserForm.jsx
import React, { useState } from 'react';
import api from '../../services/api';
import Toast from '../commons/Toast';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    salary: '',
    address: '',
    gender: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/users', formData);
      showToast('User created successfully! Invitation email sent.', 'success');
      setFormData({
        name: '',
        email: '',
        age: '',
        salary: '',
        address: '',
        gender: '',
        role: 'user',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      showToast(error.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-form">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      <div className="form-card">
        <div className="form-header">
          <span className="form-icon">✉️</span>
          <h2>Invite New User</h2>
          <span className="form-subtitle">Send invitation email to user</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <small style={{ color: '#888', fontSize: '0.8rem' }}>
              An invitation email will be sent to this address
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <div className="input-wrapper">
                <span className="input-icon">🎂</span>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="input-wrapper">
                <span className="input-icon">⚧</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary (PKR)</label>
              <div className="input-wrapper">
                <span className="input-icon">💰</span>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role</label>
              <div className="input-wrapper">
                <span className="input-icon">👔</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📍</span>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending Invitation...
              </>
            ) : (
              '✉️ Send Invitation'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;