import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../commons/Toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setIsUpdating(true);

    try {
      await api.patch(`/users/${user.id}/status`, { status: newStatus });
      showToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
      await getUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteModal({ show: true, userId: user.id, userName: user.name });
  };

  const handleConfirmDelete = async () => {
    const { userId } = deleteModal;
    setIsUpdating(true);

    try {
      await api.delete(`/users/${userId}`);
      showToast('User deleted successfully!', 'success');
      await getUsers();
      setDeleteModal({ show: false, userId: null, userName: '' });
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
      setIsUpdating(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, userId: null, userName: '' });
  };

  const renderPlaceholderRows = (count = 5) => {
    const rows = [];
    for (let i = 0; i < count; i++) {
      rows.push(
        <tr key={`placeholder-${i}`} className="placeholder-row">
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className="user-management">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">🗑️</div>
              <h2>Delete User</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user?</p>
              <div className="user-info">
                <span className="user-name-display">👤 {deleteModal.userName}</span>
              </div>
              <p className="modal-warning">⚠️ This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn-modal" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="modal-btn delete-btn-modal" onClick={handleConfirmDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        {isUpdating && (
          <div className="table-overlay">
            <div className="table-overlay-spinner"></div>
            <p>Updating...</p>
          </div>
        )}

        {loading && users.length === 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Salary</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderPlaceholderRows(6)}</tbody>
          </table>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">😕</span>
            <p>No users found</p>
            <p className="empty-subtext">Create your first user</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Salary</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className={user.status === 'inactive' ? 'inactive-row' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="user-name-cell">
                      <span className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <span className="salary-badge">
                      PKR {user.salary ? Number(user.salary).toLocaleString() : '0'}
                    </span>
                  </td>
                  <td>{user.address}</td>
                  <td>
                    <button
                      className={`status-toggle ${user.status || 'active'}`}
                      onClick={() => handleToggleStatus(user)}
                      disabled={isUpdating}
                    >
                      <span className="status-indicator"></span>
                      {user.status || 'active'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" disabled={isUpdating}>
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(user)}
                        disabled={isUpdating}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length < 5 && renderPlaceholderRows(5 - users.length)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;