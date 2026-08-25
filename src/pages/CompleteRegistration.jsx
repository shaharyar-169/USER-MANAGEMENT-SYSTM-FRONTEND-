// pages/CompleteRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const CompleteRegistration = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    gender: '',
    address: '',
    age: '',
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No invitation token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/users/invitation/${token}`);
        setUserData(response.data.user);
        setFormData(prev => ({
          ...prev,
          gender: response.data.user.gender || '',
          address: response.data.user.address || '',
          age: response.data.user.age || '',
        }));
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Invalid or expired invitation link');
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.gender) {
      setError('Please select your gender');
      return;
    }

    if (!formData.address) {
      setError('Please enter your address');
      return;
    }

    if (!formData.age) {
      setError('Please enter your age');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(`/users/complete-registration/${token}`, {
        password: formData.password,
        gender: formData.gender,
        address: formData.address,
        age: parseInt(formData.age),
      });

      setSuccess(response.data.message);
      setFormData({
        password: '',
        confirmPassword: '',
        gender: '',
        address: '',
        age: '',
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to complete registration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: '#666' }}>Validating your invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">❌</div>
            <h2>Invalid Invitation</h2>
            <p style={{ color: '#f44336' }}>{error}</p>
          </div>
          <button 
            className="auth-btn" 
            onClick={() => navigate('/login')}
            style={{ marginTop: '20px' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✅</div>
            <h2>Registration Complete!</h2>
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              {success}
            </div>
            <p style={{ color: '#666', marginTop: '15px' }}>
              Redirecting to login page...
            </p>
            <div className="spinner" style={{ margin: '20px auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-logo">✉️</div>
          <h2>Complete Registration</h2>
          <p>Welcome, <strong>{userData?.name}</strong>! Please complete your profile.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                value={userData?.name || ''}
                disabled
                style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                value={userData?.email || ''}
                disabled
                style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <div className="input-wrapper">
                <span className="input-icon">🎂</span>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <div className="input-wrapper">
                <span className="input-icon">⚧</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  disabled={submitting}
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

          <div className="form-group">
            <label>Address *</label>
            <div className="input-wrapper">
              <span className="input-icon">📍</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Create Password *</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                minLength="6"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={submitting}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              {error}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Complete Registration ✅'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;