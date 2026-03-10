import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function CarruselOfertas({ productos }) {
  const navigate = useNavigate();
  const [indiceActual, setIndiceActual] = useState(0);
  const [productosOferta, setProductosOferta] = useState([]);

  // Filtrar productos marcados como oferta
  useEffect(() => {
    const ofertas = productos.filter(prod => prod.oferta === true);
    setProductosOferta(ofertas);
    setIndiceActual(0);
  }, [productos]);

  const nextSlide = () => {
    setIndiceActual((prev) => (prev + 1) % productosOferta.length);
  };

  const prevSlide = () => {
    setIndiceActual((prev) => (prev - 1 + productosOferta.length) % productosOferta.length);
  };

  if (productosOferta.length === 0) {
    return (
      <div style={{
        height: '300px',
        background: 'var(--filter-bg)',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        border: '2px dashed var(--border-color)'
      }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          🏷️ No hay ofertas activas.<br />
          Marcá productos como "Oferta" desde el panel Admin.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      marginBottom: '3rem',
      position: 'relative',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px var(--shadow-color)'
    }}>
      {/* Carrusel */}
      <div style={{
        position: 'relative',
        height: '400px',
        width: '100%'
      }}>
        {productosOferta.map((producto, index) => (
          <div
            key={producto.id}
            onClick={() => navigate(`/producto/${producto.id}`)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === indiceActual ? 1 : 0,
              transition: 'opacity 0.5s ease',
              cursor: 'pointer',
              background: `linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card) 50%, transparent 100%)`,
              display: 'flex',
              alignItems: 'center',
              padding: '2rem'
            }}
          >
            {/* Contenido del slide */}
            <div style={{
              flex: 1,
              maxWidth: '50%',
              zIndex: 2
            }}>
              <span style={{
                background: 'var(--danger)',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                🔥 {producto.descuento}% OFF
              </span>
              
              <h2 style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                {producto.nombre}
              </h2>
              
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                color: 'var(--text-secondary)'
              }}>
                {producto.descripcion?.substring(0, 100)}...
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '2rem'
              }}>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--success)'
                }}>
                  ${producto.precioOferta?.toLocaleString('es-CL')}
                </span>
                <span style={{
                  fontSize: '1.2rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'line-through'
                }}>
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
              </div>
              
              <button
                style={{
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                🛒 Comprar Ahora
              </button>
            </div>
            
            {/* Imagen del producto */}
            <div style={{
              flex: 1,
              height: '100%',
              position: 'relative',
              zIndex: 1
            }}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación (solo si hay más de 1 oferta) */}
      {productosOferta.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          >
            <FiChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          >
            <FiChevronRight size={24} />
          </button>

          {/* Indicadores */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10
          }}>
            {productosOferta.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceActual(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index === indiceActual ? 'var(--success)' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CarruselOfertas;