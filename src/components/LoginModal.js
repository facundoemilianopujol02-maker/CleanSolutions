import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { login, register, logout } from '../services/authService';

function LoginModal({ isOpen, onClose, user, setUser }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Validaciones en tiempo real
  const [errores, setErrores] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? '' : 'Email inválido';
  };

  const validarPassword = (password) => {
    if (password.length < 6) return 'Mínimo 6 caracteres';
    if (!/[A-Z]/.test(password)) return 'Debe tener al menos una mayúscula';
    if (!/[0-9]/.test(password)) return 'Debe tener al menos un número';
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrores(prev => ({ ...prev, email: validarEmail(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (modo === 'register') {
      setErrores(prev => ({ ...prev, password: validarPassword(value) }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (modo === 'register') {
      setErrores(prev => ({
        ...prev,
        confirmPassword: value !== password ? 'Las contraseñas no coinciden' : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setLoading(true);

    // Validaciones extra
    if (modo === 'register') {
      if (errores.email || errores.password || errores.confirmPassword) {
        setError('Corregí los errores antes de continuar');
        setLoading(false);
        return;
      }
    }

    try {
      if (modo === 'login') {
        const result = await login(email, password);
        if (result.success) {
          setUser(result.user);
          onClose();
        } else {
          setError(result.error);
        }
      } 
      else if (modo === 'register') {
        const result = await register(email, password);
        if (result.success) {
          setUser(result.user);
          onClose();
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setUser(null);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setErrores({ email: '', password: '', confirmPassword: '' });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }} onClick={onClose}>
      
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '15px',
        padding: '2rem',
        width: '90%',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }} onClick={e => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          ✕
        </button>

        {user ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--info)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2.5rem',
              color: 'white'
            }}>
              👤
            </div>
            <h3 style={{ color: 'var(--text-primary)' }}>¡Hola, {user.email}!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Has iniciado sesión correctamente
            </p>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 25px',
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%'
              }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {modo === 'login' && '🔐 Iniciar Sesión'}
              {modo === 'register' && '📝 Crear Cuenta'}
            </h2>

            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {mensaje && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: `2px solid ${errores.email ? 'var(--danger)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                {errores.email && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errores.email}</span>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: `2px solid ${errores.password ? 'var(--danger)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errores.password && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errores.password}</span>
                )}
              </div>

              {/* Confirmar password (solo registro) */}
              {modo === 'register' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errores.confirmPassword ? 'var(--danger)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {errores.confirmPassword && (
                    <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errores.confirmPassword}</span>
                  )}
                </div>
              )}

              {/* Requisitos de contraseña (solo registro) */}
              {modo === 'register' && (
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  padding: '10px',
                  background: 'var(--filter-bg)',
                  borderRadius: '8px'
                }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Requisitos:</p>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li style={{ color: password.length >= 6 ? 'var(--success)' : 'var(--text-secondary)' }}>
                      ✓ Mínimo 6 caracteres
                    </li>
                    <li style={{ color: /[A-Z]/.test(password) ? 'var(--success)' : 'var(--text-secondary)' }}>
                      ✓ Al menos una mayúscula
                    </li>
                    <li style={{ color: /[0-9]/.test(password) ? 'var(--success)' : 'var(--text-secondary)' }}>
                      ✓ Al menos un número
                    </li>
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? 'var(--text-secondary)' : 'var(--success)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: loading ? 'wait' : 'pointer',
                  marginBottom: '1rem'
                }}
              >
                {loading ? 'Procesando...' : (modo === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
              </button>
            </form>

            {/* Links para cambiar modo */}
            <div style={{ textAlign: 'center' }}>
              {modo === 'login' ? (
                <button
                  onClick={() => {
                    setModo('register');
                    resetForm();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--info)',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  ¿No tenés cuenta? Registrate
                </button>
              ) : (
                <button
                  onClick={() => {
                    setModo('login');
                    resetForm();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--info)',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  ← Volver a iniciar sesión
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;