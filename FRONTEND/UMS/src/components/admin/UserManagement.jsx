import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../commons/Toast';
import "./UserModal.css"
import "./UserTable.css"

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });
  const [editModal, setEditModal] = useState({ 
    show: false, 
    user: null 
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    age: '',
    salary: '',
    address: '',
    gender: '',
    role: ''
  });

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

  // ============================================
  // ✅ EDIT USER HANDLERS
  // ============================================

  const handleEditClick = (user) => {
    setEditModal({ show: true, user });
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      age: user.age || '',
      salary: user.salary || '',
      address: user.address || '',
      gender: user.gender || 'Not Specified',
      role: user.role || 'user'
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { user } = editModal;
    
    setIsUpdating(true);
    try {
      await api.put(`/users/${user.id}`, editFormData);
      showToast('User updated successfully!', 'success');
      await getUsers();
      setEditModal({ show: false, user: null });
    } catch (error) {
      console.error('Error updating user:', error);
      showToast(error.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditModal({ show: false, user: null });
    setEditFormData({
      name: '',
      email: '',
      age: '',
      salary: '',
      address: '',
      gender: '',
      role: ''
    });
  };

  // ============================================
  // STATUS TOGGLE
  // ============================================

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

  // ============================================
  // DELETE USER HANDLERS
  // ============================================

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

  // ✅ Helper function to get status class
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-active';
    }
  };

  // ✅ Helper function to get status label
  const getStatusLabel = (status) => {
    return status || 'Active';
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

      {/* ============================================ */}
      {/* ✅ EDIT MODAL */}
      {/* ============================================ */}
      {editModal.show && editModal.user && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <span className="modal-icon">✏️</span>
              </div>
              <h2>
                Edit User
                <small>Update user information</small>
              </h2>
              <button className="modal-close-btn" onClick={handleEditCancel}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {/* User Info Display */}
                <div className="user-info-display">
                  <div className="user-avatar-small">
                    {editModal.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <div className="label">Editing User</div>
                    <div className="name">{editModal.user.name}</div>
                    <div className="email">{editModal.user.email}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input
                      type="number"
                      name="salary"
                      value={editFormData.salary}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={editFormData.gender}
                      onChange={handleEditChange}
                    >
                      <option value="Not Specified">Not Specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-btn cancel-btn-modal" 
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-btn save-btn-modal"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DELETE MODAL */}
      {/* ============================================ */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <span className="modal-icon">🗑️</span>
              </div>
              <h2>
                Delete User
                <small>This action cannot be undone</small>
              </h2>
              <button className="modal-close-btn" onClick={handleCancelDelete}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user?</p>
              <div className="user-info-display">
                <div className="user-avatar-small">
                  {deleteModal.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <div className="label">User to delete</div>
                  <div className="name">{deleteModal.userName}</div>
                </div>
              </div>
              <div className="modal-warning">⚠️ This action cannot be undone. All user data will be permanently removed.</div>
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

      {/* ============================================ */}
      {/* USER TABLE */}
      {/* ============================================ */}
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
                <tr 
                  key={user.id} 
                  className={user.status === 'inactive' ? 'inactive-row' : ''}
                >
                  <td>{index + 1}</td>
                  <td>
                    <div className="user-name-cell">
                      <span className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                      {user.name}
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <span className="salary-badge">
                      PKR {user.salary ? Number(user.salary).toLocaleString() : '0'}
                    </span>
                  </td>
                  <td className="user-address">{user.address || '-'}</td>
                  <td>
                    {/* ✅ FIXED: Clickable status button */}
                    <button
                      className={`status-badge ${getStatusClass(user.status)}`}
                      onClick={() => handleToggleStatus(user)}
                      disabled={isUpdating}
                      title="Click to toggle status"
                    >
                      <span className="status-dot"></span>
                      {getStatusLabel(user.status)}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditClick(user)}
                        disabled={isUpdating}
                        title="Edit User"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(user)}
                        disabled={isUpdating}
                        title="Delete User"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
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