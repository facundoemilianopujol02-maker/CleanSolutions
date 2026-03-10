import { useState } from 'react';

function LazyImage({ src, alt, height, width, style }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: width || '100%',
      height: height || 'auto',
      background: '#f0f0f0',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {!imageLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton 1.5s infinite'
        }} />
      )}
      
      <img
        src={src}
        alt={alt}
        style={{
          ...style,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}

// Agregar estilos para skeleton loading
const style = document.createElement('style');
style.textContent = `
  @keyframes skeleton {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);

export default LazyImage;