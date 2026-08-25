// frontend/src/services/passwordReset.service.js

import api from './api';

/**
 * Password Reset Service - Handles all password reset related API calls
 */
class PasswordResetService {
    /**
     * 1. Request password reset link
     * @param {string} email - User's email address
     * @returns {Promise<Object>}
     */
    static async forgotPassword(email) {
        try {
            const response = await api.post('/users/forgot-password', { email });
            return {
                success: true,
                message: response.data.message || 'Password reset link sent to your email.'
            };
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send reset link. Please try again.'
            };
        }
    }

    /**
     * 2. Validate reset token
     * @param {string} token - Reset token from URL
     * @returns {Promise<Object>}
     */
    static async validateResetToken(token) {
        try {
            const response = await api.get(`/users/validate-reset-token/${token}`);
            return {
                valid: response.data.valid || false,
                email: response.data.email || '',
                name: response.data.name || '',
                message: response.data.message || ''
            };
        } catch (error) {
            console.error('Validate token error:', error);
            return {
                valid: false,
                email: '',
                name: '',
                message: error.response?.data?.message || 'Invalid or expired reset link.'
            };
        }
    }

    /**
     * 3. Reset password with token
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     * @param {string} confirmPassword - Confirm password
     * @returns {Promise<Object>}
     */
    static async resetPassword(token, newPassword, confirmPassword) {
        try {
            const response = await api.post('/users/reset-password', {
                token,
                newPassword,
                confirmPassword
            });
            return {
                success: true,
                message: response.data.message || 'Password reset successful!'
            };
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reset password. Please try again.'
            };
        }
    }

    /**
     * Helper: Check if token is valid
     * @param {string} token - Reset token
     * @returns {Promise<boolean>}
     */
    static async isTokenValid(token) {
        const result = await this.validateResetToken(token);
        return result.valid;
    }

    /**
     * Helper: Get user email from token
     * @param {string} token - Reset token
     * @returns {Promise<string>}
     */
    static async getEmailFromToken(token) {
        const result = await this.validateResetToken(token);
        return result.email || '';
    }
}

export default PasswordResetService;