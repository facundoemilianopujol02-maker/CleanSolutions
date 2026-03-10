import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

function ProductosDestacados({ productos, agregarAlCarrito }) {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    // Simular productos destacados (podrían tener más ventas, mejores puntuaciones, etc)
    const destacadosSimulados = productos
      .sort(() => 0.5 - Math.random()) // Mezclar aleatoriamente
      .slice(0, 4) // Tomar 4
      .map(prod => ({
        ...prod,
        puntuacion: (4 + Math.random()).toFixed(1) // Puntuación entre 4 y 5
      }));
    
    setDestacados(destacadosSimulados);
  }, [productos]);

  if (destacados.length === 0) return null;

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ color: 'var(--text-primary)' }}>
          ⭐ Productos Destacados
        </h2>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--info)',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          Ver todos →
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {destacados.map(producto => (
          <div
            key={producto.id}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px var(--shadow-color)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => navigate(`/producto/${producto.id}`)}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              {/* 👇 SECCIÓN DE ESTRELLAS ELIMINADA */}
            </div>

            <div style={{ padding: '15px' }}>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '1.1rem',
                color: 'var(--text-primary)'
              }}>
                {producto.nombre}
              </h3>

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
                  ${producto.precio.toLocaleString('es-CL')}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    agregarAlCarrito(producto);
                  }}
                  style={{
                    background: 'var(--info)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosDestacados;