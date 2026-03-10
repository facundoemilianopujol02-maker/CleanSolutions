import { useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';

function ProductCard({ producto, agregarAlCarrito }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  return (
    <div 
      className="product-card"
      style={{
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: producto.oferta ? '2px solid var(--danger)' : '1px solid var(--border-color)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px var(--shadow-color)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onClick={handleClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px var(--shadow-color)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-color)';
      }}
    >
      {/* Etiqueta de oferta */}
      {producto.oferta && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'var(--danger)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          zIndex: 2,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          🔥 {producto.descuento}% OFF
        </div>
      )}

      {/* Imagen con LazyLoad */}
      <LazyImage
        src={producto.imagen}
        alt={producto.nombre}
        height="250px"
        style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover'
        }}
      />
      
      {/* Info */}
      <div style={{ padding: '15px' }}>
        <span style={{
          background: 'var(--filter-bg)',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          {producto.categoria}
        </span>
        
        {/* 👇 SECCIÓN DE ESTRELLAS ELIMINADA */}
        
        <h3 style={{ margin: '10px 0 10px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          {producto.nombre}
        </h3>
        
        {/* Stock y unidad */}
        <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Stock:</span>{' '}
          <span style={{ color: 'var(--text-tertiary)' }}>
            {producto.stock} {producto.tipoUnidad || 'unidades'}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {producto.oferta ? (
              <div>
                <span style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--success)',
                  marginRight: '8px'
                }}>
                  ${producto.precioOferta?.toLocaleString('es-CL')}
                </span>
                <span style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'line-through'
                }}>
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
              </div>
            ) : (
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: 'var(--success)'
              }}>
                ${producto.precio.toLocaleString('es-CL')}
              </span>
            )}
          </div>
          
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
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2980b9'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--info)'}
          >
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;