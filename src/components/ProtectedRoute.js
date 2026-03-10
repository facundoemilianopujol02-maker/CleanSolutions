import { Navigate } from 'react-router-dom';
import { isAdmin } from '../services/authService';

function ProtectedRoute({ children, user, requiredRole = 'user' }) {
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si requiere ser admin y no lo es
  if (requiredRole === 'admin' && !isAdmin(user)) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        background: 'var(--bg-card)',
        borderRadius: '15px',
        boxShadow: '0 4px 12px var(--shadow-color)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '4rem' }}>🚫</span>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Acceso Denegado
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          No tenés permisos para acceder a esta página.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 25px',
            background: 'var(--info)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Usuario autorizado
  return children;
}

export default ProtectedRoute;