// pages/ForgotPassword.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth(); // ✅ Get from context

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // ✅ Use the forgotPassword method from AuthContext
      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage(result.message || 'Password reset link sent to your email!');
        setEmailSent(true);
      } else {
        setError(result.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show success state after email sent
  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">📧</div>
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to</p>
            <p className="email-display"><strong>{email}</strong></p>
          </div>

          {message && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              {message}
            </div>
          )}

          <div className="info-box">
            <p>📌 The link will expire in <strong>15 minutes</strong></p>
            <p>📬 If you don't see the email, check your spam folder</p>
          </div>

          <div className="auth-actions">
            <button 
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setMessage('');
              }} 
              className="auth-btn-secondary"
            >
              Resend Email
            </button>
            <Link to="/login" className="auth-btn-link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🔐</div>
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;