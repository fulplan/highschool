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
    <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/icons/logo.png" 
            alt="Shawarma Boss Logo" 
            className="navbar-brand-img"
            style={{ width: '48px', height: '48px', borderRadius: '0.25rem' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-xl font-bold text-danger mb-0">Shawarma Boss</h1>
            <small className="text-muted">Modern MERN Stack POS</small>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <nav className="flex gap-4">
              <button
                onClick={() => handleNavigation('/')}
                className={`btn btn-sm ${
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
                  className={`btn btn-sm ${
                    location.pathname === '/admin' 
                      ? 'btn-danger' 
                      : 'btn-outline-light'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>
            
            <div className="text-end">
              <div className="text-sm">
                Logged in: <strong>{user.username}</strong>
                <span className="ms-2 badge bg-danger">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-link btn-sm text-light p-0 mt-1"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;