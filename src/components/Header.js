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
    <header className="navbar navbar-dark bg-dark shadow-sm py-1">
      <div className="container d-flex align-items-center justify-content-between">
        <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}>
          <img 
            src="/icons/logo.png" 
            alt="Shawarma Boss Logo" 
            className="me-2 rounded"
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
          <span className="fw-bold text-danger fs-5">Shawarma Boss</span>
          <small className="text-muted ms-2 d-none d-md-inline">Modern MERN Stack POS</small>
        </a>

        {user && (
          <>
            <div className="d-flex align-items-center gap-2 ms-3">
              <button
                onClick={() => handleNavigation('/')}
                className={`btn btn-sm py-0 px-2 ${
                  location.pathname === '/' 
                    ? 'btn-danger' 
                    : 'btn-outline-light'
                }`}
              >
                POS
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => handleNavigation('/admin')}
                  className={`btn btn-sm py-0 px-2 ${
                    location.pathname === '/admin' 
                      ? 'btn-danger' 
                      : 'btn-outline-light'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>
            
            <div className="d-flex align-items-center ms-3">
              <span className="text-light small me-2">
                {user.username} <span className="badge bg-danger text-uppercase">{user.role}</span>
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm py-0 px-2"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;