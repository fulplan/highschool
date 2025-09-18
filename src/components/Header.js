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
    <header className="navbar navbar-expand-lg navbar-dark bg-gradient shadow-lg py-2 beautiful-navbar">
      <div className="container-fluid">
        {/* Brand/Logo Section */}
        <button 
          className="navbar-brand d-flex align-items-center hover-lift border-0 bg-transparent" 
          onClick={() => handleNavigation('/')}
          aria-label="Go to home"
        >
          <div className="brand-icon-wrapper me-3">
            <img 
              src="/icons/logo.png" 
              alt="Shawarma Boss Logo" 
              className="brand-logo"
            />
          </div>
          <div className="brand-text">
            <h1 className="brand-name mb-0">
              <i className="fas fa-fire text-danger me-2"></i>
              Shawarma Boss
            </h1>
            <small className="brand-tagline d-none d-lg-block">Modern Point of Sale System</small>
          </div>
        </button>

        {user && (
          <>
            {/* Navigation Pills */}
            <nav className="navbar-nav mx-auto" aria-label="Primary navigation">
              <div className="nav-pills-container d-flex align-items-center gap-2">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`nav-pill ${location.pathname === '/' ? 'active' : ''}`}
                  title="Point of Sale"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  <i className="fas fa-cash-register me-2"></i>
                  <span>POS</span>
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className={`nav-pill ${location.pathname === '/admin' ? 'active' : ''}`}
                    title="Admin Dashboard"
                    aria-current={location.pathname === '/admin' ? 'page' : undefined}
                  >
                    <i className="fas fa-cogs me-2"></i>
                    <span>Admin</span>
                  </button>
                )}
              </div>
            </nav>
            
            {/* User Section */}
            <div className="user-section d-flex align-items-center">
              <div className="user-info me-3 text-end d-none d-md-block">
                <div className="user-name text-white fw-semibold">
                  <i className="fas fa-user-circle me-1"></i>
                  {user.username}
                </div>
                <span className={`role-badge ${user.role}`}>
                  <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 'fa-id-badge'} me-1`}></i>
                  {user.role}
                </span>
              </div>
              
              <div className="action-buttons d-flex gap-2">
                <div className="dropdown">
                  <button 
                    className="btn user-menu-btn dropdown-toggle d-md-none" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    title="User Menu"
                  >
                    <i className="fas fa-user"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end user-dropdown">
                    <li>
                      <h6 className="dropdown-header">
                        <i className="fas fa-user-circle me-1"></i>
                        {user.username}
                      </h6>
                    </li>
                    <li>
                      <span className="dropdown-item-text">
                        <span className={`role-badge ${user.role}`}>
                          <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 'fa-id-badge'} me-1`}></i>
                          {user.role}
                        </span>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="btn logout-btn d-none d-md-flex align-items-center"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  <span className="d-none d-lg-inline">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;