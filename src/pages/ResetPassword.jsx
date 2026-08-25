// pages/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { validateResetToken, resetPassword } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const result = await validateResetToken(token);
        
        if (result.valid) {
          setValidToken(true);
          setUserEmail(result.email);
          setMessage(`Reset password for ${result.email}`);
        } else {
          setValidToken(false);
          setError(result.message || 'Invalid or expired reset link');
        }
      } catch (error) {
        setValidToken(false);
        setError('Failed to validate reset link. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setLoading(false);
      setValidToken(false);
      setError('No reset token provided');
    }
  }, [token, validateResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword(token, newPassword, confirmPassword);
      
      if (result.success) {
        setMessage(result.message || 'Password reset successful!');
        setError('');
        
        // ✅ Redirect to login with success message
        setTimeout(() => {
          navigate('/login', { 
            state: { message: '✅ Password reset successful! Please login with your new password.' }
          });
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password. Please try again.');
        
        if (result.message?.toLowerCase().includes('expired')) {
          setTimeout(() => {
            navigate('/forgot-password');
          }, 3000);
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of the component (loading, invalid token states, form)
  
  // Valid token - Show reset form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🔐</div>
          <h2>Create New Password</h2>
          <p>Enter your new password below</p>
        </div>

        <div className="user-info">
          <p>Resetting password for:</p>
          <p className="email-display"><strong>{userEmail}</strong></p>
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
            <label>New Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                disabled={isSubmitting}
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <small className="hint-text">Password must be at least 6 characters</small>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">✅</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                disabled={isSubmitting}
                required
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <div className="field-error">✗ Passwords do not match</div>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <div className="field-success">✓ Passwords match</div>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-btn" 
            disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Resetting...
              </>
            ) : (
              'Reset Password'
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

export default ResetPassword;