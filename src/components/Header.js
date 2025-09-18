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
    <header className="bg-black text-white p-4 shadow">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/icons/logo.png" 
            alt="Shawarma Boss Logo" 
            className="w-12 h-12 rounded"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-xl font-bold text-danger">Shawarma Boss</h1>
            <small className="text-gray-400">Modern MERN Stack POS</small>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <nav className="flex gap-4">
              <button
                onClick={() => handleNavigation('/')}
                className={`px-4 py-2 rounded transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                POS
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => handleNavigation('/admin')}
                  className={`px-4 py-2 rounded transition-colors ${
                    location.pathname === '/admin' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>
            
            <div className="text-right">
              <div className="text-sm">
                Logged in: <strong>{user.username}</strong>
                <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-300 hover:text-white mt-1"
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