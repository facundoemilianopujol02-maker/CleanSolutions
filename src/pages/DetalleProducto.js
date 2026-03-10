import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logViewItem, logAddToCart } from '../services/analyticsService';
import Valoraciones from '../components/Valoraciones';

function DetalleProducto({ agregarAlCarrito, productos, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const encontrado = productos.find(p => p.id === id);
      setProducto(encontrado);
      setCargando(false);
    }, 500);
  }, [id, productos]);

  // Analytics: Ver producto
  useEffect(() => {
    if (producto) {
      logViewItem(producto);
    }
  }, [producto]);

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto);
    }
    logAddToCart(producto, cantidad);
    alert(`✅ ${cantidad} ${cantidad === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`);
  };

  const handleComprarAhora = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto);
    }
    logAddToCart(producto, cantidad);
    navigate('/checkout');
  };

  if (cargando) {
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
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem'
      }}>
        <h2>🔍 Producto no encontrado</h2>
        <p>El producto que buscas no existe.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          ← Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 20px'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ← Volver a la tienda
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px var(--shadow-color)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Columna Izquierda - Imagen */}
        <div>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{
              width: '100%',
              height: '500px',
              objectFit: 'cover',
              borderRadius: '15px'
            }}
          />
        </div>

        {/* Columna Derecha - Info */}
        <div>
          <span style={{
            background: 'var(--filter-bg)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}>
            {producto.categoria}
          </span>

          <h1 style={{
            fontSize: '2.5rem',
            margin: '1rem 0',
            color: 'var(--text-primary)'
          }}>
            {producto.nombre}
          </h1>

          <div style={{
            fontSize: '2.5rem',
            color: 'var(--success)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            ${producto.precio.toLocaleString('es-CL')}
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '2rem',
            padding: '1rem 0',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Stock</div>
              <div style={{ 
                fontWeight: 'bold',
                color: producto.stock > 10 ? 'var(--success)' : 'var(--warning)'
              }}>
                {producto.stock > 0 ? `${producto.stock} ${producto.tipoUnidad || 'unidades'}` : 'Agotado'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Código</div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>#{producto.id}</div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Descripción</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {producto.descripcion}
            </p>
          </div>

          {/* Selector de Cantidad */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Cantidad ({producto.tipoUnidad || 'unidades'})</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--filter-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >-</button>
              
              <span style={{
                width: '60px',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                {cantidad}
              </span>
              
              <button
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--filter-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >+</button>
              
              <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>
                (máx. {producto.stock})
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleAgregar}
              disabled={producto.stock === 0}
              style={{
                flex: 2,
                background: producto.stock > 0 ? 'var(--success)' : 'var(--text-muted)',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: producto.stock > 0 ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => {
                if (producto.stock > 0) {
                  e.currentTarget.style.background = '#2ecc71';
                }
              }}
              onMouseLeave={e => {
                if (producto.stock > 0) {
                  e.currentTarget.style.background = 'var(--success)';
                }
              }}
            >
              🛒 Agregar al Carrito
            </button>
            
            <button
              onClick={handleComprarAhora}
              disabled={producto.stock === 0}
              style={{
                flex: 1,
                background: producto.stock > 0 ? 'var(--info)' : 'var(--text-muted)',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                cursor: producto.stock > 0 ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => {
                if (producto.stock > 0) {
                  e.currentTarget.style.background = '#2980b9';
                }
              }}
              onMouseLeave={e => {
                if (producto.stock > 0) {
                  e.currentTarget.style.background = 'var(--info)';
                }
              }}
            >
              💳 Comprar Ahora
            </button>
          </div>

          {/* Botón de consultar por WhatsApp */}
          <button
            onClick={() => {
              const texto = `Hola! Me interesa este producto de CleanSolutions:%0A%0A*${producto.nombre}*%0A$${producto.precio.toLocaleString('es-CL')}%0A%0A${window.location.href}`;
              window.open(`https://wa.me/543794034489?text=${texto}`, '_blank');
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: '#25D366',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '1rem'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#128C7E'}
            onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
          >
            📱 Consultar por WhatsApp
          </button>

          {/* Info adicional */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--filter-bg)',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}>
            <p>🔄 Cambios y devoluciones gratis</p>
            <p>🔒 Pago seguro</p>
          </div>
        </div>
      </div>

      {/* Valoraciones */}
      <Valoraciones productoId={producto.id} user={user} />
      
    </div>
  );
}

export default DetalleProducto;