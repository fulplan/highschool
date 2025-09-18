import React from 'react';
import { useAuth } from '../services/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="modern-navbar">
      <div className="navbar-container">
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
            {/* Navigation Tabs */}
            <nav className="nav-tabs" aria-label="Primary navigation">
              <div className="nav-tab-list">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
                  title="Staff Dashboard"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  <div className="tab-icon">
                    <i className="fas fa-cash-register"></i>
                  </div>
                  <span className="tab-label">Staff</span>
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className={`nav-tab ${location.pathname === '/admin' ? 'active' : ''}`}
                    title="Admin Dashboard"
                    aria-current={location.pathname === '/admin' ? 'page' : undefined}
                  >
                    <div className="tab-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <span className="tab-label">Admin</span>
                  </button>
                )}
              </div>
            </nav>
            
            {/* User Profile */}
            <div className="user-profile">
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-details d-none d-md-block">
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
                    <i className="fas fa-chevron-down"></i>
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
          </>
        )}
      </div>
      
      {/* Mobile PWA Install Indicator */}
      <div className="pwa-indicator d-none">
        <i className="fas fa-mobile-alt"></i>
      </div>
    </header>
  );
};

export default Header;