import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import Toast from '../commons/Toast';
import "./UserModal.css"
import "./UserTable.css"

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editFormData, setEditFormData] = useState({
    name: '', email: '', age: '', salary: '', address: '', gender: '', role: ''
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

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery === '' ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const statusCounts = useMemo(() => {
    return {
      all: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      inactive: users.filter(u => u.status === 'inactive').length,
    };
  }, [users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

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
    setEditFormData(prev => ({ ...prev, [name]: value }));
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
    setEditFormData({ name: '', email: '', age: '', salary: '', address: '', gender: '', role: '' });
  };

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
    return Array.from({ length: count }, (_, i) => (
      <tr key={`placeholder-${i}`} className="placeholder-row">
        {Array.from({ length: 8 }, (_, j) => <td key={j}>&nbsp;</td>)}
      </tr>
    ));
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'inactive': return 'status-inactive';
      default: return 'status-active';
    }
  };

  const getStatusLabel = (status) => status || 'Active';

  const startItem = filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length);

  return (
    <div className="user-management">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
      )}

      {/* EDIT MODAL */}
      {editModal.show && editModal.user && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h2>Edit User<small>Update user information</small></h2>
              <button className="modal-close-btn" onClick={handleEditCancel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="user-info-display">
                  <div className="user-avatar-small">{editModal.user.name?.charAt(0).toUpperCase() || 'U'}</div>
                  <div className="user-details">
                    <div className="label">Editing User</div>
                    <div className="name">{editModal.user.name}</div>
                    <div className="email">{editModal.user.email}</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name <span className="required">*</span></label>
                    <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={editFormData.age} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input type="number" name="salary" value={editFormData.salary} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={editFormData.gender} onChange={handleEditChange}>
                      <option value="Not Specified">Not Specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={editFormData.role} onChange={handleEditChange}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={editFormData.address} onChange={handleEditChange} placeholder="Enter address" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn cancel-btn-modal" onClick={handleEditCancel}>Cancel</button>
                <button type="submit" className="modal-btn save-btn-modal" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrapper danger">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
              <h2>Delete User<small>This action cannot be undone</small></h2>
              <button className="modal-close-btn" onClick={handleCancelDelete}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user?</p>
              <div className="user-info-display">
                <div className="user-avatar-small">{deleteModal.userName?.charAt(0).toUpperCase() || 'U'}</div>
                <div className="user-details">
                  <div className="label">User to delete</div>
                  <div className="name">{deleteModal.userName}</div>
                </div>
              </div>
              <div className="modal-warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                This action cannot be undone. All user data will be permanently removed.
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn-modal" onClick={handleCancelDelete}>Cancel</button>
              <button className="modal-btn delete-btn-modal" onClick={handleConfirmDelete}>Delete User</button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="table-section">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, address..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => { setSearchQuery(''); setCurrentPage(1); }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <div className="filter-pills">
              {['all', 'active', 'pending', 'inactive'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-pill ${statusFilter === filter ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <span className="filter-count">{statusCounts[filter]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
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
                  <th>#</th><th>Name</th><th>Email</th><th>Age</th><th>Salary</th><th>Address</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderPlaceholderRows(10)}</tbody>
            </table>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <p>No users found</p>
              <p className="empty-subtext">{searchQuery ? 'Try a different search term' : 'Create your first user'}</p>
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Age</th><th>Salary</th><th>Address</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id} className={user.status === 'inactive' ? 'inactive-row' : ''}>
                    <td className="col-index">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>
                      <div className="user-name-cell">
                        <span className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
                        <span className="user-name-text">{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>{user.age}</td>
                    <td><span className="salary-badge">PKR {user.salary ? Number(user.salary).toLocaleString() : '0'}</span></td>
                    <td className="user-address">{user.address || '-'}</td>
                    <td>
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
                        <button className="action-btn edit-btn" onClick={() => handleEditClick(user)} disabled={isUpdating} title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteClick(user)} disabled={isUpdating} title="Delete">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination - Only show when more than 10 users */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{filteredUsers.length}</strong> users
            </div>
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              {getPaginationRange().map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
