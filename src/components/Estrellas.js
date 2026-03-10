import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

function Estrellas({ puntuacion, editable = false, onChange, tamaño = 24 }) {
  const [hover, setHover] = useState(null);

  const handleClick = (valor) => {
    if (editable && onChange) {
      onChange(valor);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((valor) => (
        <FiStar
          key={valor}
          size={tamaño}
          style={{
            cursor: editable ? 'pointer' : 'default',
            color: (hover !== null ? hover >= valor : puntuacion >= valor) 
              ? '#FFD700' 
              : '#E0E0E0',
            transition: 'color 0.2s',
            fill: (hover !== null ? hover >= valor : puntuacion >= valor) 
              ? '#FFD700' 
              : 'transparent'
          }}
          onMouseEnter={() => editable && setHover(valor)}
          onMouseLeave={() => editable && setHover(null)}
          onClick={() => handleClick(valor)}
        />
      ))}
    </div>
  );
}

export default Estrellas;