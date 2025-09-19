import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrders, getMenu } from '../services/api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);
  const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false);
  const [quickStats, setQuickStats] = useState({
    todaySales: 0,
    todaysOrders: 0, // Changed from pendingOrders to be more accurate
    lowStockItems: 0,
    isLoading: true
  });

  // Fetch quick stats for admin users
  const fetchQuickStats = async () => {
    if (!user || user.role !== 'admin') {
      return;
    }

    try {
      setQuickStats(prev => ({ ...prev, isLoading: true }));
      
      // Fetch data concurrently using centralized API service
      const [orders, menu] = await Promise.all([
        getOrders(),
        getMenu()
      ]);
      
      // Calculate today's sales - robust date handling
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => {
        const orderDate = order.timestamp || order.created_at || order.serverReceivedAt;
        return orderDate && new Date(orderDate).toDateString() === today;
      });
      const todaySales = todayOrders.reduce((sum, order) => {
        const total = parseFloat(order.total || order.amount || 0);
        return sum + (isNaN(total) ? 0 : total);
      }, 0);
      
      // Calculate low stock items (stock < 10)
      const lowStockItems = menu.filter(item => {
        const stock = parseInt(item.stock || 0);
        return !isNaN(stock) && stock < 10;
      }).length;
      
      // Show today's order count
      const totalOrdersToday = todayOrders.length;
      
      setQuickStats({
        todaySales: todaySales,
        todaysOrders: totalOrdersToday, // Today's order count
        lowStockItems: lowStockItems,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch quick stats:', error);
      setQuickStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Role-specific notification system
  const generateRoleBasedNotifications = () => {
    if (!user) return [];

    const baseNotifications = [];
    
    if (user.role === 'staff') {
      // Staff notifications: Order updates, shift reminders, low stock alerts
      return [
        { id: 1, type: 'order', message: 'Order #1234 completed successfully', time: '5 min ago', read: false, priority: 'normal' },
        { id: 2, type: 'inventory', message: 'Low stock: Chicken Shawarma (8 left)', time: '15 min ago', read: false, priority: 'warning' },
        { id: 3, type: 'system', message: 'Shift started - POS ready', time: '2 hours ago', read: true, priority: 'info' },
        { id: 4, type: 'order', message: 'Customer requested extra sauce for order #1230', time: '1 hour ago', read: true, priority: 'normal' }
      ];
    } else if (user.role === 'admin') {
      // Admin notifications: Sales targets, staff actions, system alerts, reports ready
      return [
        { id: 1, type: 'sales', message: 'Daily sales target 80% reached ($640/$800)', time: '10 min ago', read: false, priority: 'success' },
        { id: 2, type: 'staff', message: 'New staff member "john_doe" added to system', time: '30 min ago', read: false, priority: 'info' },
        { id: 3, type: 'system', message: 'Weekly report generated and ready for export', time: '1 hour ago', read: false, priority: 'info' },
        { id: 4, type: 'inventory', message: 'Critical: 3 items below minimum stock level', time: '2 hours ago', read: false, priority: 'critical' },
        { id: 5, type: 'system', message: 'Database backup completed successfully', time: '3 hours ago', read: true, priority: 'info' },
        { id: 6, type: 'sales', message: 'Peak hour alert: 15 orders in last hour', time: '4 hours ago', read: true, priority: 'warning' }
      ];
    }

    return baseNotifications;
  };

  useEffect(() => {
    if (user) {
      const roleNotifications = generateRoleBasedNotifications();
      setNotifications(roleNotifications);
      setUnreadCount(roleNotifications.filter(n => !n.read).length);
    }
  }, [user]);

  // Fetch quick stats when user changes or component mounts
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchQuickStats();
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(fetchQuickStats, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-wrapper')) {
        setShowNotifications(false);
      }
      if (showManagementDropdown && !event.target.closest('.management-dropdown')) {
        setShowManagementDropdown(false);
      }
      if (showAnalyticsDropdown && !event.target.closest('.analytics-dropdown')) {
        setShowAnalyticsDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications, showManagementDropdown, showAnalyticsDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return 'fas fa-shopping-cart';
      case 'system': return 'fas fa-cog';
      case 'inventory': return 'fas fa-exclamation-triangle';
      case 'sales': return 'fas fa-chart-line';
      case 'staff': return 'fas fa-users';
      default: return 'fas fa-bell';
    }
  };

  const getNotificationPriorityClass = (priority) => {
    switch (priority) {
      case 'critical': return 'notification-critical';
      case 'warning': return 'notification-warning';
      case 'success': return 'notification-success';
      case 'info': return 'notification-info';
      default: return 'notification-normal';
    }
  };

  // Get current admin section for breadcrumbs
  const getCurrentSection = () => {
    if (location.pathname !== '/admin') return null;
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    
    const sectionConfig = {
      dashboard: { name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      staff: { name: 'Staff Management', icon: 'fas fa-users' },
      menu: { name: 'Menu Management', icon: 'fas fa-utensils' },
      orders: { name: 'Recent Orders', icon: 'fas fa-receipt' },
      reports: { name: 'Reports & Export', icon: 'fas fa-chart-bar' }
    };
    
    return sectionConfig[section] || { name: 'Dashboard', icon: 'fas fa-tachometer-alt' };
  };

  return (
    <header className="modern-navbar">
      <div className="navbar-container">
        {/* Mobile Hamburger Menu */}
        {user && (
          <button 
            className="mobile-menu-toggle enhanced-touch d-md-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        )}

        {/* Brand Section */}
        <button 
          className="navbar-brand" 
          onClick={() => handleNavigation('/')}
          aria-label="Go to home"
        >
          <div className="brand-icon">
            <img 
              src="/icons/logo.png" 
              alt="Shawarma Boss Logo" 
              className="brand-logo"
            />
          </div>
          <div className="brand-content">
            <h1 className="brand-title">
              Shawarma Boss
              <span className="brand-badge">POS</span>
            </h1>
            <p className="brand-subtitle d-none d-lg-block">Modern Point of Sale</p>
          </div>
        </button>

        {user && (
          <>
            {/* Desktop Navigation Tabs */}
            <nav className="nav-tabs d-none d-md-flex" aria-label="Primary navigation">
              <div className="nav-tab-list">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
                  title="POS Dashboard"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  <div className="tab-icon">
                    <i className="fas fa-cash-register"></i>
                  </div>
                  <span className="tab-label">POS</span>
                </button>

                {/* Staff accessible features */}
                {user && (
                  <button
                    onClick={() => handleNavigation('/orders')}
                    className={`nav-tab ${location.pathname === '/orders' ? 'active' : ''}`}
                    title="View Recent Orders"
                    aria-current={location.pathname === '/orders' ? 'page' : undefined}
                  >
                    <div className="tab-icon">
                      <i className="fas fa-receipt"></i>
                    </div>
                    <span className="tab-label">Orders</span>
                  </button>
                )}

                {/* Admin-only primary tabs */}
                {user.role === 'admin' && (
                  <>
                    <div className="nav-tab-dropdown management-dropdown">
                      <button
                        className={`nav-tab ${location.pathname === '/admin' && ['staff', 'menu'].includes(new URLSearchParams(location.search).get('section')) ? 'active' : ''}`}
                        onClick={() => setShowManagementDropdown(!showManagementDropdown)}
                        aria-expanded={showManagementDropdown}
                        title="Management Tools"
                      >
                        <div className="tab-icon">
                          <i className="fas fa-cogs"></i>
                        </div>
                        <span className="tab-label">Management</span>
                        <i className={`fas fa-chevron-down ms-1 ${showManagementDropdown ? 'rotate-180' : ''}`}></i>
                      </button>
                      {showManagementDropdown && (
                        <ul className="dropdown-menu modern-dropdown show">
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => {
                                handleNavigation('/admin?section=staff');
                                setShowManagementDropdown(false);
                              }}
                            >
                              <i className="fas fa-users me-2"></i>Staff Management
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => {
                                handleNavigation('/admin?section=menu');
                                setShowManagementDropdown(false);
                              }}
                            >
                              <i className="fas fa-utensils me-2"></i>Menu Management
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className="nav-tab-dropdown analytics-dropdown">
                      <button
                        className={`nav-tab ${location.pathname === '/admin' && ['dashboard', 'orders', 'reports'].includes(new URLSearchParams(location.search).get('section')) ? 'active' : ''}`}
                        onClick={() => setShowAnalyticsDropdown(!showAnalyticsDropdown)}
                        aria-expanded={showAnalyticsDropdown}
                        title="Analytics & Reports"
                      >
                        <div className="tab-icon">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <span className="tab-label">Analytics</span>
                        <i className={`fas fa-chevron-down ms-1 ${showAnalyticsDropdown ? 'rotate-180' : ''}`}></i>
                      </button>
                      {showAnalyticsDropdown && (
                        <ul className="dropdown-menu modern-dropdown show">
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => {
                                handleNavigation('/admin?section=dashboard');
                                setShowAnalyticsDropdown(false);
                              }}
                            >
                              <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => {
                                handleNavigation('/admin?section=orders');
                                setShowAnalyticsDropdown(false);
                              }}
                            >
                              <i className="fas fa-list-alt me-2"></i>Order History
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => {
                                handleNavigation('/admin?section=reports');
                                setShowAnalyticsDropdown(false);
                              }}
                            >
                              <i className="fas fa-chart-bar me-2"></i>Reports & Export
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            </nav>
            
            {/* Quick Stats for Admin */}
            {user.role === 'admin' && (
              <div className="quick-stats d-none d-lg-flex">
                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-icon sales">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Today's Sales</div>
                      <div className="stat-value">
                        {quickStats.isLoading ? (
                          <div className="stat-loading">
                            <i className="fas fa-spinner fa-spin"></i>
                          </div>
                        ) : (
                          `$${quickStats.todaySales.toFixed(2)}`
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon orders">
                      <i className="fas fa-receipt"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Today's Orders</div>
                      <div className="stat-value">
                        {quickStats.isLoading ? (
                          <div className="stat-loading">
                            <i className="fas fa-spinner fa-spin"></i>
                          </div>
                        ) : (
                          quickStats.todaysOrders
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {quickStats.lowStockItems > 0 && (
                    <div className="stat-item warning">
                      <div className="stat-icon inventory">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-label">Low Stock</div>
                        <div className="stat-value">{quickStats.lowStockItems} items</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Breadcrumb Navigation for Admin */}
            {user.role === 'admin' && location.pathname === '/admin' && (
              <div className="breadcrumb-nav d-none d-md-flex">
                <div className="breadcrumb-container">
                  <button 
                    className="breadcrumb-item home"
                    onClick={() => handleNavigation('/')}
                    title="Go to POS"
                  >
                    <i className="fas fa-home"></i>
                  </button>
                  <i className="fas fa-chevron-right breadcrumb-separator"></i>
                  <span className="breadcrumb-item current">
                    <i className={getCurrentSection()?.icon}></i>
                    <span className="breadcrumb-label">{getCurrentSection()?.name}</span>
                  </span>
                </div>
              </div>
            )}
            
            {/* Right Side Actions */}
            <div className="navbar-actions enhanced-touch">
              {/* Notifications */}
              <div className="notification-wrapper">
                <button
                  className="notification-btn"
                  onClick={toggleNotifications}
                  title="Notifications"
                  aria-label="Show notifications"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h6>Notifications</h6>
                      {unreadCount > 0 && (
                        <button 
                          className="mark-read-btn"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="notification-empty">
                          <i className="fas fa-bell-slash"></i>
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`notification-item ${!notification.read ? 'unread' : ''} ${getNotificationPriorityClass(notification.priority)}`}
                          >
                            <div className="notification-icon">
                              <i className={getNotificationIcon(notification.type)}></i>
                            </div>
                            <div className="notification-content">
                              <p className="notification-message">{notification.message}</p>
                              <div className="notification-meta">
                                <span className="notification-time">{notification.time}</span>
                                {notification.priority && notification.priority !== 'normal' && (
                                  <span className={`notification-priority priority-${notification.priority}`}>
                                    {notification.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!notification.read && <div className="unread-dot"></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="user-profile">
                <div className="user-info">
                  <div className="user-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="user-details d-none d-lg-block">
                    <div className="user-name">{user.username}</div>
                    <div className={`user-role role-${user.role}`}>
                      <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 'fa-user'} me-1`}></i>
                      {user.role}
                    </div>
                  </div>
                  
                  <div className="dropdown">
                    <button 
                      className="user-menu-btn" 
                      type="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      title="User Menu"
                    >
                      <i className="fas fa-chevron-down d-none d-md-inline"></i>
                      <i className="fas fa-ellipsis-v d-md-none"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end modern-dropdown">
                      <li className="dropdown-header">
                        <div className="dropdown-user-info">
                          <div className="dropdown-avatar">
                            <i className="fas fa-user-circle"></i>
                          </div>
                          <div>
                            <div className="dropdown-name">{user.username}</div>
                            <div className={`dropdown-role role-${user.role}`}>
                              <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 'fa-user'} me-1`}></i>
                              {user.role}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                          <div className="dropdown-item-content">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {user && (
        <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <div className="mobile-user-info">
              <div className="mobile-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="mobile-user-details">
                <div className="mobile-user-name">{user.username}</div>
                <div className={`mobile-user-role role-${user.role}`}>
                  <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 'fa-user'} me-1`}></i>
                  {user.role}
                </div>
              </div>
            </div>
          </div>
          
          <nav className="mobile-nav-list">
            <button
              onClick={() => handleNavigation('/')}
              className={`mobile-nav-item enhanced-touch ${location.pathname === '/' ? 'active' : ''}`}
            >
              <i className="fas fa-cash-register"></i>
              <span>POS Dashboard</span>
            </button>
            
            {/* Orders accessible to all staff */}
            <button
              onClick={() => handleNavigation('/orders')}
              className={`mobile-nav-item enhanced-touch ${location.pathname === '/orders' ? 'active' : ''}`}
            >
              <i className="fas fa-receipt"></i>
              <span>Order History</span>
            </button>

            {user.role === 'admin' && (
              <>
                <div className="mobile-nav-section">
                  <div className="mobile-nav-header">
                    <i className="fas fa-cogs"></i>
                    <span>Management</span>
                  </div>
                  <div className="mobile-nav-items">
                    <button
                      onClick={() => handleNavigation('/admin?section=staff')}
                      className={`mobile-nav-subitem ${location.pathname === '/admin' && new URLSearchParams(location.search).get('section') === 'staff' ? 'active' : ''}`}
                    >
                      <i className="fas fa-users"></i>
                      <span>Staff Management</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin?section=menu')}
                      className={`mobile-nav-subitem ${location.pathname === '/admin' && new URLSearchParams(location.search).get('section') === 'menu' ? 'active' : ''}`}
                    >
                      <i className="fas fa-utensils"></i>
                      <span>Menu Management</span>
                    </button>
                  </div>
                </div>

                <div className="mobile-nav-section">
                  <div className="mobile-nav-header">
                    <i className="fas fa-chart-line"></i>
                    <span>Analytics</span>
                  </div>
                  <div className="mobile-nav-items">
                    <button
                      onClick={() => handleNavigation('/admin?section=dashboard')}
                      className={`mobile-nav-subitem ${location.pathname === '/admin' && new URLSearchParams(location.search).get('section') === 'dashboard' ? 'active' : ''}`}
                    >
                      <i className="fas fa-tachometer-alt"></i>
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin?section=orders')}
                      className={`mobile-nav-subitem ${location.pathname === '/admin' && new URLSearchParams(location.search).get('section') === 'orders' ? 'active' : ''}`}
                    >
                      <i className="fas fa-list-alt"></i>
                      <span>Order Analytics</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin?section=reports')}
                      className={`mobile-nav-subitem ${location.pathname === '/admin' && new URLSearchParams(location.search).get('section') === 'reports' ? 'active' : ''}`}
                    >
                      <i className="fas fa-chart-bar"></i>
                      <span>Reports & Export</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="mobile-nav-divider"></div>
            <button className="mobile-nav-item logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </header>
  );
};

export default Header;