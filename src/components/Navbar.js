import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { isAdmin } from '../services/authService';
import { useResponsive } from '../hooks/useResponsive';
import { FiMenu, FiX } from 'react-icons/fi';

function Navbar({ 
  cantidadTotal, 
  mostrarCarrito, 
  setMostrarCarrito, 
  carrito, 
  quitarDelCarrito, 
  eliminarProducto, 
  totalCarrito,
  vaciarCarrito,
  user,
  setShowLoginModal
}) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const [menuOpen, setMenuOpen] = useState(false);

  const cerrarMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const irA = (ruta) => {
    navigate(ruta);
    cerrarMenu();
  };

  return (
    <nav style={{
      background: 'var(--navbar-bg)',
      color: 'var(--navbar-text)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px var(--shadow-color)',
      transition: 'all 0.3s ease'
    }}>
      {/* Logo */}
      <h1 
        style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }}
        onClick={() => irA('/')}
      >
        🧼 CleanSolutions
      </h1>

      {/* Menú principal - Desktop */}
      {(isMobile || isTablet) ? (
        // Versión móvil/tablet: botón hamburguesa
        <>
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--navbar-text)',
              fontSize: '1.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1001
            }}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Menú desplegable móvil */}
          {menuOpen && (
            <div style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              background: 'var(--navbar-bg)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 4px 8px var(--shadow-color)',
              zIndex: 999,
              animation: 'slideDown 0.3s ease'
            }}>
              {/* Botón de usuario */}
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  cerrarMenu();
                }}
                style={{
                  background: user ? 'var(--success)' : 'transparent',
                  color: user ? 'white' : 'var(--navbar-text)',
                  border: user ? 'none' : '1px solid var(--navbar-text)',
                  borderRadius: '25px',
                  padding: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                {user ? '👤 ' + user.email.split('@')[0] : '🔑 Iniciar sesión'}
              </button>

              {/* Botón Admin (si corresponde) */}
              {isAdmin(user) && (
                <button
                  onClick={() => irA('/admin')}
                  style={{
                    background: 'var(--warning)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                >
                  👨‍💼 Panel Admin
                </button>
              )}

              {/* Botón Inicio */}
              <button
                onClick={() => irA('/')}
                style={{
                  background: 'transparent',
                  color: 'var(--navbar-text)',
                  border: '1px solid var(--navbar-text)',
                  borderRadius: '25px',
                  padding: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                🏠 Inicio
              </button>

              {/* Carrito en móvil - AHORA FUNCIONAL */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setMostrarCarrito(!mostrarCarrito);
                    // No cerramos el menú para que se vea el carrito
                  }}
                  style={{
                    background: cantidadTotal > 0 ? 'var(--danger)' : 'transparent',
                    color: 'var(--navbar-text)',
                    border: cantidadTotal > 0 ? 'none' : '1px solid var(--navbar-text)',
                    borderRadius: '25px',
                    padding: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  🛒 Carrito {cantidadTotal > 0 && `(${cantidadTotal})`}
                </button>

                {/* Dropdown del carrito (solo si está abierto) */}
                {mostrarCarrito && (
                  <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: 0,
                    right: 0,
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px var(--shadow-color)',
                    padding: '15px',
                    zIndex: 1000,
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>🛒 Tu Carrito</h4>
                      {carrito.length > 0 && (
                        <button
                          onClick={vaciarCarrito}
                          style={{
                            background: 'var(--filter-bg)',
                            border: '1px solid var(--border-color)',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          Vaciar todo
                        </button>
                      )}
                    </div>
                    
                    {carrito.length === 0 ? (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '20px 0',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ fontSize: '2rem' }}>🛒</span>
                        <p>Carrito vacío</p>
                      </div>
                    ) : (
                      <>
                        {carrito.map(item => (
                          <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px solid var(--border-color)'
                          }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <img 
                                src={item.imagen} 
                                alt={item.nombre}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '5px',
                                  objectFit: 'cover'
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                  {item.nombre}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  ${item.precio.toLocaleString('es-CL')} x {item.cantidad}
                                </div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() => quitarDelCarrito(item.id)}
                                style={{
                                  background: 'var(--filter-bg)',
                                  border: '1px solid var(--border-color)',
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  color: 'var(--text-primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >-</button>
                              
                              <button
                                onClick={() => eliminarProducto(item.id)}
                                style={{
                                  background: 'var(--danger)',
                                  color: 'white',
                                  border: 'none',
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '0.9rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >✕</button>
                            </div>
                          </div>
                        ))}
                        
                        <div style={{
                          marginTop: '15px',
                          paddingTop: '10px',
                          borderTop: '2px solid var(--border-color)',
                          fontWeight: 'bold'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            color: 'var(--text-primary)'
                          }}>
                            <span>Total:</span>
                            <span style={{ color: 'var(--success)' }}>
                              ${totalCarrito.toLocaleString('es-CL')}
                            </span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setMostrarCarrito(false);
                              cerrarMenu();
                              navigate('/checkout');
                            }}
                            style={{
                              width: '100%',
                              padding: '12px',
                              background: 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.95rem'
                            }}
                          >
                            Finalizar Compra
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Redes sociales en móvil */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '1.5rem'
              }}>
                <a href="https://www.instagram.com/clean.solutions610" 
                   target="_blank" rel="noopener noreferrer"
                   style={{ color: 'var(--navbar-text)', textDecoration: 'none' }}>
                  📸
                </a>
                <a href="https://wa.me/543794034489" 
                   target="_blank" rel="noopener noreferrer"
                   style={{ color: 'var(--navbar-text)', textDecoration: 'none' }}>
                  💬
                </a>
                <a href="mailto:cleansolutions12km@gmail.com" 
                   style={{ color: 'var(--navbar-text)', textDecoration: 'none' }}>
                  📧
                </a>
              </div>
            </div>
          )}
        </>
      ) : (
        // Versión desktop: menú horizontal normal
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          
          {/* Botón de tema */}
          <ThemeToggle />
          
          {/* Botón de usuario */}
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              background: user ? 'var(--success)' : 'var(--filter-bg)',
              color: user ? 'white' : 'var(--text-primary)',
              border: 'none',
              borderRadius: '25px',
              padding: '8px 15px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              if (!user) e.currentTarget.style.background = 'var(--border-color)';
            }}
            onMouseLeave={e => {
              if (!user) e.currentTarget.style.background = 'var(--filter-bg)';
            }}
          >
            {user ? '👤 ' + user.email.split('@')[0] : '🔑 Iniciar sesión'}
          </button>

          {/* Botón de Admin */}
          {isAdmin(user) && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                background: 'var(--warning)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e67e22'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--warning)'}
            >
              👨‍💼 Admin
            </button>
          )}

          <span 
            style={{ 
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'background 0.2s',
              color: 'var(--navbar-text)'
            }}
            onClick={() => navigate('/')}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            🏠 Inicio
          </span>
          
          {/* Carrito desktop (funciona igual) */}
          <div style={{ position: 'relative' }}>
            <span 
              style={{ 
                background: cantidadTotal > 0 ? 'var(--danger)' : 'var(--text-light)',
                padding: '8px 15px',
                borderRadius: '25px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.2s'
              }}
              onClick={() => setMostrarCarrito(!mostrarCarrito)}
              onMouseEnter={e => {
                if (cantidadTotal > 0) {
                  e.currentTarget.style.background = '#ff6666';
                }
              }}
              onMouseLeave={e => {
                if (cantidadTotal > 0) {
                  e.currentTarget.style.background = 'var(--danger)';
                }
              }}
            >
              🛒 <span style={{ fontWeight: 'bold' }}>{cantidadTotal}</span>
            </span>
            
            {/* Dropdown del carrito desktop */}
            {mostrarCarrito && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '350px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px var(--shadow-color)',
                padding: '20px',
                zIndex: 1000,
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>🛒 Tu Carrito</h4>
                  {carrito.length > 0 && (
                    <button
                      onClick={vaciarCarrito}
                      style={{
                        background: 'var(--filter-bg)',
                        border: '1px solid var(--border-color)',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Vaciar todo
                    </button>
                  )}
                </div>
                
                {carrito.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '30px 0',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ fontSize: '3rem' }}>🛒</span>
                    <p>Carrito vacío</p>
                  </div>
                ) : (
                  <>
                    {carrito.map(item => (
                      <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <img 
                            src={item.imagen} 
                            alt={item.nombre}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '5px',
                              objectFit: 'cover'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                              {item.nombre}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              ${item.precio.toLocaleString('es-CL')} x {item.cantidad}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => quitarDelCarrito(item.id)}
                            style={{
                              background: 'var(--filter-bg)',
                              border: '1px solid var(--border-color)',
                              width: '28px',
                              height: '28px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-primary)'
                            }}
                            title="Quitar uno"
                          >
                            -
                          </button>
                          
                          <button
                            onClick={() => eliminarProducto(item.id)}
                            style={{
                              background: 'var(--danger)',
                              color: 'white',
                              border: 'none',
                              width: '28px',
                              height: '28px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Eliminar del carrito"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '2px solid var(--border-color)',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px',
                        color: 'var(--text-primary)'
                      }}>
                        <span>Total:</span>
                        <span style={{ color: 'var(--success)' }}>
                          ${totalCarrito.toLocaleString('es-CL')}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setMostrarCarrito(false);
                          navigate('/checkout');
                        }}
                        style={{
                          width: '100%',
                          padding: '15px',
                          background: 'var(--success)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2ecc71'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--success)'}
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;