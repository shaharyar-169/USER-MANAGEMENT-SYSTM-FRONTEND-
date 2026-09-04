import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../../services/api';
import './ActivityLog.css';

const ITEMS_PER_PAGE = 10;

const ACTION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'login', label: 'Login' },
  { id: 'logout', label: 'Logout' },
  { id: 'create', label: 'Created' },
  { id: 'update', label: 'Updated' },
  { id: 'delete', label: 'Deleted' },
];

const ACTION_CONFIG = {
  login: { label: 'Signed In', color: 'green' },
  logout: { label: 'Signed Out', color: 'slate' },
  create: { label: 'Created', color: 'green' },
  update: { label: 'Updated', color: 'amber' },
  delete: { label: 'Deleted', color: 'red' },
};

const normalizeAction = (action) => {
  const value = (action || '').toLowerCase();
  if (value.includes('login') || value.includes('sign in')) return 'login';
  if (value.includes('logout') || value.includes('sign out')) return 'logout';
  if (value.includes('create') || value.includes('add') || value.includes('invite') || value.includes('register')) return 'create';
  if (value.includes('delete') || value.includes('remove')) return 'delete';
  if (value.includes('update') || value.includes('edit') || value.includes('status')) return 'update';
  return 'update';
};

const formatRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDayDate = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (itemDate.getTime() === today.getTime()) return 'Today';
  if (itemDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (date) => {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
}

const formatMetaTime = (date) => {
  const dayDate = formatDayDate(date);
  const time = formatTime(date);
  const relative = formatRelativeTime(date);
  return { dayDate, time, relative };
}

const formatDateTime = (date) => {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const formatFullTime = (date) => {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
}

const formatFullDateTime = (date) => {
  return `${formatDateTime(date)} ${formatFullTime(date)}`;
}

const ActionIcon = ({ type, size = 14 }) => {
  const icons = {
    login: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    ),
    create: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    ),
    update: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    delete: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    ),
  };
  return icons[type] || icons.update;
};

const AccordionContent = ({ item, actionType, config, status, metadata, onClose }) => {
  const timestamp = item.created_at || item.createdAt || item.timestamp;
  const date = timestamp ? new Date(timestamp) : null;
  
  const userFields = [
    { label: 'User', value: item.user_name || metadata.name || 'Unknown' },
    { label: 'User ID', value: item.user_id },
    { label: 'Email', value: item.user_email || metadata.email },
  ].filter(f => f.value !== null && f.value !== undefined);

  const activityFields = [
    { label: 'Action', value: item.action },
    { label: 'Status', value: <span className={`status-badge status-${status.color}`}>{status.label}</span> },
    { label: 'Description', value: item.description },
  ].filter(f => f.value !== null && f.value !== undefined);

  const dateFields = [
    { label: 'Date', value: date ? formatDayDate(date) : 'Unknown' },
    { label: 'Time', value: date ? formatTime(date) : 'Unknown' },
    { label: 'Relative', value: date ? formatRelativeTime(date) : 'Unknown' },
  ];

  const isAdminAction = ['UPDATE_USER', 'DELETE_USER'].includes(item.action);
  const performedByName = isAdminAction ? 'Admin' : (item.performed_by_name || (item.performed_by ? `User ID: ${item.performed_by}` : 'System'));
  const performedByFields = [
    { label: 'Performed By', value: performedByName },
    { label: 'ID', value: item.performed_by || 'N/A' },
  ].filter(f => f.value !== null && f.value !== undefined);

  const technicalFields = [
    { label: 'IP Address', value: item.ip_address },
    { label: 'User Agent', value: item.user_agent },
  ].filter(f => f.value !== null && f.value !== undefined && f.value !== 'N/A');

  const metadataFields = Object.entries(metadata).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: typeof value === 'object' ? JSON.stringify(value) : value,
  }));

const renderField = (field) => (
    <div className="detail-field" key={field.label}>
      <span className="detail-field-label">{field.label}</span>
      <span className="detail-field-value">{field.value}</span>
    </div>
  );

  const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const ActivityIconS = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const UserAdminIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
      <circle cx="12" cy="7" r="2"></circle>
    </svg>
  );

  const TechnicalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M8 21h8M12 17v4"></path>
    </svg>
  );

  const renderSection = (fields) => (
    <>
      {fields.map((field, idx) => (
        <div key={idx} className="detail-field">
          <span className="detail-field-label">{field.label}</span>
          <span className="detail-field-value">{field.value}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="accordion-content" onClick={(e) => e.stopPropagation()}>
      <div className="accordion-cards">
        <div className="accordion-card">
          <div className="accordion-card-header">
            <div className="accordion-card-icon"><UserIcon /></div>
            <h5>USER</h5>
          </div>
          <div className="accordion-card-content">
            {renderSection(userFields)}
          </div>
        </div>
        <div className="accordion-card">
          <div className="accordion-card-header">
            <div className="accordion-card-icon"><ActivityIconS /></div>
            <h5>ACTIVITY</h5>
          </div>
          <div className="accordion-card-content">
            {renderSection(activityFields)}
          </div>
        </div>
        <div className="accordion-card">
          <div className="accordion-card-header">
            <div className="accordion-card-icon"><CalendarIcon /></div>
            <h5>DATE & TIME</h5>
          </div>
          <div className="accordion-card-content">
            {renderSection(dateFields)}
          </div>
        </div>
        <div className="accordion-card">
          <div className="accordion-card-header">
            <div className="accordion-card-icon"><UserAdminIcon /></div>
            <h5>PERFORMED BY</h5>
          </div>
          <div className="accordion-card-content">
            {renderSection(performedByFields)}
          </div>
        </div>
      </div>
      {(technicalFields.length > 0 || metadataFields.length > 0) && (
        <div className="accordion-technical">
          <div className="accordion-tech-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M8 21h8M12 17v4"></path>
            </svg>
            <span>Technical Information</span>
          </div>
          <div className="accordion-tech-content">
            {technicalFields.length > 0 && (
              <div className="accordion-tech-section">
                {technicalFields.map((field, idx) => (
                  <div key={idx} className="detail-field">
                    <span className="detail-field-label">{field.label}</span>
                    <span className="detail-field-value"><code>{field.value}</code></span>
                  </div>
                ))}
              </div>
            )}
            {metadataFields.length > 0 && (
              <div className="accordion-tech-section">
                {metadataFields.map((field, idx) => (
                  <div key={idx} className="detail-field">
                    <span className="detail-field-label">{field.label}</span>
                    <span className="detail-field-value">{typeof field.value === 'object' ? JSON.stringify(field.value) : field.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItem, setExpandedItem] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/activity-logs');
      const data =
        response.data.activities ||
        response.data.logs ||
        response.data.data ||
        response.data ||
        [];
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = useMemo(() => {
    return activities
      .map((item, index) => ({
        ...item,
        actionType: normalizeAction(item.action || item.type),
        _key: item.id || item._id || index,
      }))
      .filter((item) => {
        const matchesAction = actionFilter === 'all' || item.actionType === actionFilter;
        const haystack = `${item.user_name || item.userName || ''} ${item.description || ''} ${item.action || item.type || ''}`.toLowerCase();
        const matchesSearch = searchQuery === '' || haystack.includes(searchQuery.toLowerCase());
        return matchesAction && matchesSearch;
      })
      .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
  }, [activities, searchQuery, actionFilter]);

  const visibleActivities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActivities, currentPage]);

  const actionCounts = useMemo(() => {
    const counts = { all: activities.length };
    activities.forEach((item) => {
      const type = normalizeAction(item.action || item.type);
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [activities]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterId) => {
    setActionFilter(filterId);
    setCurrentPage(1);
  };

  const getUserName = (item) => item.user_name || item.userName || item.name || 'System';
  const getDescription = (item) =>
    item.description ||
    `${getUserName(item)} ${ACTION_CONFIG[item.actionType]?.label.toLowerCase() || 'performed an action'}${item.target ? ` — ${item.target}` : ''}`;
  const getTimestamp = (item) => item.created_at || item.createdAt || item.timestamp;

  const toggleExpand = (item) => {
    setExpandedItem(expandedItem === item._key ? null : item._key);
  };

  return (
    <div className="activity-log">
      <div className="activity-toolbar">
        <div className="activity-toolbar-left">
          <div className="activity-search">
            <span className="activity-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="activity-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <div className="activity-filters">
            {ACTION_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`activity-filter-pill ${actionFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
                <span className="activity-filter-count">{actionCounts[filter.id] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="activity-refresh-btn" onClick={fetchActivities} title="Refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spinning' : ''}>
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Refresh
        </button>
      </div>

      <div className="activity-table-container">
        <div className="activity-header-row">
          <div className="header-cell header-user">User</div>
          <div className="header-cell header-action">Action</div>
          <div className="header-cell header-description">Description</div>
          <div className="header-cell header-datetime">Date & Time</div>
          <div className="header-cell header-performed">Performed By</div>
          <div className="header-cell header-details">Details</div>
        </div>

        <div className="activity-timeline">
          {loading ? (
            <div className="activity-loading">
              {[...Array(5)].map((_, i) => (
                <div className="activity-skeleton-row" key={i}>
                  <div className="activity-skeleton-icon" />
                  <div className="activity-skeleton-lines">
                    <div className="activity-skeleton-line" style={{ width: '45%' }} />
                    <div className="activity-skeleton-line short" style={{ width: '70%' }} />
                  </div>
                  <div className="activity-skeleton-time" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="activity-empty">
              <div className="activity-empty-icon error">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h4>Something went wrong</h4>
              <p>{error}</p>
              <button type="button" className="activity-retry-btn" onClick={fetchActivities}>
                Try Again
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="activity-empty">
              <div className="activity-empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h4>No activity found</h4>
              <p>
                {searchQuery || actionFilter !== 'all'
                  ? 'No activities match your search or filter.'
                  : 'User activities will appear here once recorded.'}
              </p>
            </div>
          ) : (
            <>
              {visibleActivities.map((item) => {
                const config = ACTION_CONFIG[item.actionType] || ACTION_CONFIG.update;
                const timestamp = getTimestamp(item);
                const date = timestamp ? new Date(timestamp) : null;
const isAdminAction = ['UPDATE_USER', 'DELETE_USER', 'UPDATE_USER_STATUS'].includes(item.action);
                const performedByName = isAdminAction ? 'Admin' : (item.performed_by_name || (item.performed_by ? `User ID: ${item.performed_by}` : 'System'));
                const isExpanded = expandedItem === item._key;
                const metadata = item.metadata || {};
                const status = (() => {
                  if (item.actionType === 'create' || item.actionType === 'login') return { label: 'SUCCESSFUL', color: 'green' };
                  if (item.actionType === 'delete') return { label: 'COMPLETED', color: 'red' };
                  return { label: 'SUCCESSFUL', color: 'indigo' };
                })();
                const config2 = ACTION_CONFIG[item.actionType] || ACTION_CONFIG.update;

                return (
                  <>
                    <div className="activity-item" key={item._key}>
                      <div className="activity-col-user">
                        <div className={`activity-icon-wrapper ${config.color}`}>
                          <ActionIcon type={item.actionType} size={16} />
                        </div>
                        <span className="activity-user">{getUserName(item)}</span>
                      </div>
                      <div className="activity-col-action">
                        <span className={`activity-badge ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="activity-col-description">
                        <p className="activity-description">{getDescription(item)}</p>
                      </div>
                      <div className="activity-col-datetime">
                        <div className="activity-datetime">
                          {date && (
                            <>
                              <span className="activity-date">{formatDateTime(date)}</span>
                              <span className="activity-time-separator">·</span>
                              <span className="activity-time-value">{formatFullTime(date)}</span>
                            </>
                          )}
                          <span className="activity-relative-badge">{date ? formatRelativeTime(date) : 'Unknown time'}</span>
                        </div>
                      </div>
                      <div className="activity-col-performed">
                        {performedByName !== 'System' && (
                          <span className="activity-performed" title="Performed by">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"></path>
                              <path d="M20 21v-2a4 4 0 0 0-4-4h-1"></path>
                              <path d="M4 21v-2a4 4 0 0 1 4-4h1"></path>
                            </svg>
                            {performedByName}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="activity-detail-icon-btn"
                        onClick={() => toggleExpand(item)}
                        title="View Details"
                        aria-label="View activity details"
                        aria-expanded={isExpanded}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isExpanded ? 'rotated' : ''}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="accordion-row">
                        <div className="accordion-wrapper">
                          <AccordionContent
                            item={item}
                            actionType={item.actionType}
                            config={config2}
                            status={status}
                            metadata={item.metadata || {}}
                            onClose={() => setExpandedItem(null)}
                          />
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </>
          )}

          {filteredActivities.length > ITEMS_PER_PAGE && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)}</strong> of <strong>{filteredActivities.length}</strong> activities
              </div>
              <div className="pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                {Array.from({ length: Math.ceil(filteredActivities.length / ITEMS_PER_PAGE) }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(Math.ceil(filteredActivities.length / ITEMS_PER_PAGE), currentPage + 2))
                  .map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredActivities.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={currentPage === Math.ceil(filteredActivities.length / ITEMS_PER_PAGE)}
                  aria-label="Next page"
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
    </div>
  );
};

export default ActivityLog;