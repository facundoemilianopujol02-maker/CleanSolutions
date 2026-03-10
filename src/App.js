import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Filtros from './components/Filtros';
import DetalleProducto from './pages/DetalleProducto';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import LoginModal from './components/LoginModal';
import CarruselOfertas from './components/CarruselOfertas';
import ContadorRegresivo from './components/ContadorRegresivo';
import Newsletter from './components/Newsletter';
import ProductosDestacados from './components/ProductosDestacados';
import Contacto from './components/Contacto';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { auth } from './firebase/config';
import { getProductos } from './services/productosService';
import { getCombos } from './services/combosService';
import './App.css';

// Componente Modal para Combo
function ComboModal({ combo, isOpen, onClose, agregarAlCarrito }) {
  if (!isOpen || !combo) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }} onClick={onClose}>
      
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '15px',
        padding: '2rem',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }} onClick={e => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Columna Izquierda - Imagen */}
          <div>
            <img
              src={combo.imagen || 'https://via.placeholder.com/400?text=Combo'}
              alt={combo.nombre}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
          </div>

          {/* Columna Derecha - Info */}
          <div>
            <span style={{
              background: 'var(--warning)',
              color: 'white',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              🎁 COMBO ESPECIAL
            </span>

            <h2 style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              {combo.nombre}
            </h2>

            <div style={{
              fontSize: '2rem',
              color: 'var(--success)',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              ${combo.precio.toLocaleString('es-CL')}
            </div>

            {combo.descripcion && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Descripción</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {combo.descripcion}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Productos incluidos</h3>
              <div style={{
                background: 'var(--filter-bg)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                {combo.productos && combo.productos.map((prod, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: index < combo.productos.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}>
                    <span style={{ color: 'var(--text-primary)' }}>{prod.nombre}</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                      {prod.cantidad} {prod.tipoUnidad}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => {
                  agregarAlCarrito(combo);
                  onClose();
                }}
                style={{
                  flex: 2,
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🛒 Agregar al Carrito
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  background: 'var(--filter-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Seguir viendo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar combos
function CombosSection({ combos, agregarAlCarrito }) {
  const [comboSeleccionado, setComboSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModal = (combo) => {
    setComboSeleccionado(combo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setComboSeleccionado(null);
  };

  if (!combos || combos.length === 0) return null;

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ color: 'var(--text-primary)' }}>
          🎁 Combos Especiales
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {combos.filter(combo => combo.activo !== false).map(combo => (
          <div
            key={combo.id}
            onClick={() => abrirModal(combo)}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid var(--warning)',
              boxShadow: '0 4px 12px var(--shadow-color)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              position: 'relative'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Etiqueta de COMBO */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'var(--warning)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              zIndex: 2
            }}>
              🎁 COMBO
            </div>

            {/* Imagen */}
            <img
              src={combo.imagen || 'https://via.placeholder.com/400?text=Combo'}
              alt={combo.nombre}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />

            {/* Info */}
            <div style={{ padding: '15px' }}>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '1.2rem',
                color: 'var(--text-primary)'
              }}>
                {combo.nombre}
              </h3>

              {/* Lista de productos incluidos (resumida) */}
              <div style={{
                background: 'var(--filter-bg)',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Incluye:
                </p>
                {combo.productos && combo.productos.slice(0, 3).map(prod => (
                  <div key={prod.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3px'
                  }}>
                    <span>{prod.nombre}</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {prod.cantidad} {prod.tipoUnidad}
                    </span>
                  </div>
                ))}
                {combo.productos && combo.productos.length > 3 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--info)', marginTop: '5px' }}>
                    + {combo.productos.length - 3} productos más
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--success)'
                }}>
                  ${combo.precio.toLocaleString('es-CL')}
                </span>

                <span style={{
                  background: 'var(--info)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '5px',
                  fontSize: '0.85rem'
                }}>
                  Ver detalles →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de combo */}
      <ComboModal
        combo={comboSeleccionado}
        isOpen={modalAbierto}
        onClose={cerrarModal}
        agregarAlCarrito={agregarAlCarrito}
      />
    </div>
  );
}

// HomePage como componente SEPARADO
function HomePage({ 
  productos, 
  combos,
  busqueda, 
  setBusqueda, 
  categoriaSeleccionada, 
  setCategoriaSeleccionada,
  orden,
  setOrden,
  categorias,
  agregarAlCarrito,
  loading,
  user 
}) {
  
  // Estado para la fecha del contador (persistente)
  const [fechaOferta, setFechaOferta] = useState(() => {
    const guardada = localStorage.getItem('fechaOferta');
    return guardada ? Number(guardada) : new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
  });

  // Guardar cuando cambia
  useEffect(() => {
    localStorage.setItem('fechaOferta', fechaOferta.toString());
  }, [fechaOferta]);

  const productosFiltrados = () => {
    let filtrados = productos;

    if (busqueda) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    if (categoriaSeleccionada) {
      filtrados = filtrados.filter(p => p.categoria === categoriaSeleccionada);
    }

    switch (orden) {
      case 'precio-asc':
        filtrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }

    return filtrados;
  };

  const productosVisibles = productosFiltrados();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid var(--border-color)',
            borderTop: '5px solid var(--info)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Carrusel de ofertas */}
      <CarruselOfertas productos={productos} />
      
      {/* Contador regresivo - AHORA EDITABLE POR ADMIN */}
      <ContadorRegresivo 
        fechaObjetivo={fechaOferta} 
        editable={user?.email === 'admin@mitienda.com'}
        onFechaChange={setFechaOferta}
      />

      {/* 👇 COMBOS - SE MUESTRAN DESPUÉS DEL CONTADOR */}
      <CombosSection combos={combos} agregarAlCarrito={agregarAlCarrito} />
      
      {/* Productos destacados */}
      <ProductosDestacados 
        productos={productos} 
        agregarAlCarrito={agregarAlCarrito} 
      />
      
      {/* Sección de productos con filtros */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <h2 style={{ color: 'var(--text-primary)' }}>🛍️ Todos los Productos</h2>
        <span style={{ color: 'var(--text-secondary)' }}>
          {productosVisibles.length} productos
        </span>
      </div>
      
      <Filtros 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        orden={orden}
        setOrden={setOrden}
        categorias={categorias}
        totalResultados={productosVisibles.length}
      />
      
      {productosVisibles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          background: 'var(--bg-card)',
          borderRadius: '15px',
          boxShadow: '0 2px 8px var(--shadow-color)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '4rem' }}>🔍</span>
          <h3 style={{ color: 'var(--text-primary)' }}>No se encontraron productos</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Probá con otros términos de búsqueda o categorías.
          </p>
          <button
            onClick={() => {
              setBusqueda('');
              setCategoriaSeleccionada('');
              setOrden('default');
            }}
            style={{
              marginTop: '1rem',
              padding: '10px 20px',
              background: 'var(--info)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px',
          marginBottom: '3rem'
        }}>
          {productosVisibles.map(producto => (
            <ProductCard 
              key={producto.id}
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      )}

      {/* Newsletter */}
      <Newsletter />

      {/* Contacto */}
      <Contacto user={user} />
      
    </main>
  );
}

function App() {
  // Estados
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [orden, setOrden] = useState('default');
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos y combos desde Firestore
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const productosFirestore = await getProductos();
        setProductos(productosFirestore);
        
        const combosFirestore = await getCombos();
        setCombos(combosFirestore);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Efecto para Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))];

  // Funciones del carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      
      if (existe) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(item => item.id === id);
      
      if (existe.cantidad === 1) {
        return prevCarrito.filter(item => item.id !== id);
      } else {
        return prevCarrito.map(item =>
          item.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      }
    });
  };

  const eliminarProducto = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Cálculos
  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div>
          <Navbar 
            cantidadTotal={cantidadTotal}
            mostrarCarrito={mostrarCarrito}
            setMostrarCarrito={setMostrarCarrito}
            carrito={carrito}
            quitarDelCarrito={quitarDelCarrito}
            eliminarProducto={eliminarProducto}
            totalCarrito={totalCarrito}
            vaciarCarrito={vaciarCarrito}
            user={user}
            setShowLoginModal={setShowLoginModal}
          />

          <Routes>
            <Route path="/" element={
              <HomePage 
                productos={productos}
                combos={combos}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                categoriaSeleccionada={categoriaSeleccionada}
                setCategoriaSeleccionada={setCategoriaSeleccionada}
                orden={orden}
                setOrden={setOrden}
                categorias={categorias}
                agregarAlCarrito={agregarAlCarrito}
                loading={loading}
                user={user}
              />
            } />
            
            <Route 
              path="/producto/:id" 
              element={<DetalleProducto 
                agregarAlCarrito={agregarAlCarrito}
                productos={productos}
              />} 
            />
            
            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  carrito={carrito}
                  totalCarrito={totalCarrito}
                  vaciarCarrito={vaciarCarrito}
                />
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user} requiredRole="admin">
                  <AdminPanel 
                    user={user}
                    productos={productos}
                    setProductos={setProductos}
                  />
                </ProtectedRoute>
              } 
            />

            {/* Páginas legales */}
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
          </Routes>

          <LoginModal 
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            user={user}
            setUser={setUser}
          />

          {/* FOOTER */}
          <footer style={{
            background: 'var(--footer-bg)',
            color: 'var(--footer-text)',
            padding: '3rem 2rem',
            marginTop: '3rem',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              textAlign: 'left'
            }}>
              
              {/* Columna 1: Logo y descripción */}
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧼 CleanSolutions</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Productos de limpieza profesionales para hogar y comercio. Calidad y confianza.
                </p>
              </div>

              {/* Columna 2: Contacto */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>📞 Contacto</h4>
                <p style={{ marginBottom: '0.5rem' }}>
                  📧 <a href="mailto:cleansolutions12km@gmail.com" 
                        style={{ color: 'var(--footer-text)', textDecoration: 'none' }}>
                    cleansolutions12km@gmail.com
                  </a>
                </p>
                <p>
                  📱 <a href="https://wa.me/543794034489" 
                        target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--footer-text)', textDecoration: 'none' }}>
                    +54 3794 034489
                  </a>
                </p>
              </div>

              {/* Columna 3: Redes Sociales */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>🌐 Redes Sociales</h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '1.5rem' }}>
                  <a href="https://www.instagram.com/clean.solutions610" 
                     target="_blank" rel="noopener noreferrer"
                     style={{ color: 'var(--footer-text)', textDecoration: 'none' }}
                     title="Instagram">
                    📸
                  </a>
                  <a href="https://wa.me/543794034489" 
                     target="_blank" rel="noopener noreferrer"
                     style={{ color: 'var(--footer-text)', textDecoration: 'none' }}
                     title="WhatsApp">
                    💬
                  </a>
                  <a href="mailto:cleansolutions12km@gmail.com" 
                     style={{ color: 'var(--footer-text)', textDecoration: 'none' }}
                     title="Email">
                    📧
                  </a>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Seguinos en @clean.solutions610 para novedades
                </p>
              </div>

              {/* Columna 4: Información legal */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>📋 Información legal</h4>
                <p style={{ marginBottom: '0.5rem' }}>
                  <a href="/terminos" 
                     style={{ color: 'var(--footer-text)', textDecoration: 'none' }}>
                    Términos y condiciones
                  </a>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <a href="/privacidad" 
                     style={{ color: 'var(--footer-text)', textDecoration: 'none' }}>
                    Política de privacidad
                  </a>
                </p>
              </div>
            </div>

            {/* Línea divisoria */}
            <div style={{
              maxWidth: '1200px',
              margin: '2rem auto 1rem',
              height: '1px',
              background: 'var(--border-color)'
            }} />

            {/* Copyright */}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              © {new Date().getFullYear()} CleanSolutions - Todos los derechos reservados
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;