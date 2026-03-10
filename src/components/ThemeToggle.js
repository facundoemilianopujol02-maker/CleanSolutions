import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        color: 'var(--navbar-text)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
      }}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}

export default ThemeToggle;