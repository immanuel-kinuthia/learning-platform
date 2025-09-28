import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NavBar = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav style={{ padding: '1rem', background: theme === 'dark' ? '#333' : '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none', fontWeight: 'bold' }}>SkillShare</Link>
      </div>
      <div>
        <button onClick={toggleTheme} style={{ marginRight: '1rem', background: 'transparent', color: 'white', border: '1px solid white', padding: '0.5rem', cursor: 'pointer' }}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        {token ? (
          <>
            <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Courses</Link>
            {user.role === 'mentor' && (
              <Link to="/create-course" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Create Course</Link>
            )}
            <Link to="/profile" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Profile</Link>
            <button
              onClick={handleLogout}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
