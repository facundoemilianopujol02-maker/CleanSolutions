import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

function EstrellasProducto({ productoId }) {
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'valoraciones'),
      where('productoId', '==', productoId.toString())
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const valoraciones = querySnapshot.docs.map(doc => doc.data());
      
      if (valoraciones.length > 0) {
        const suma = valoraciones.reduce((acc, v) => acc + v.puntuacion, 0);
        setPromedio(suma / valoraciones.length);
        setTotal(valoraciones.length);
      } else {
        setPromedio(0);
        setTotal(0);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productoId]);

  if (loading) {
    return <div style={{ height: '24px' }} />; // Placeholder
  }

  if (total === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '8px',
        marginBottom: '5px',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        <span>☆☆☆☆☆</span>
        <span>Sin valoraciones</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      marginTop: '8px',
      marginBottom: '5px'
    }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((estrella) => (
          <span
            key={estrella}
            style={{
              color: estrella <= Math.round(promedio) ? '#FFD700' : '#E0E0E0',
              fontSize: '1rem'
            }}
          >
            ★
          </span>
        ))}
      </div>
      <span style={{ 
        fontSize: '0.9rem', 
        fontWeight: 'bold',
        color: 'var(--text-primary)'
      }}>
        {promedio.toFixed(1)}
      </span>
      <span style={{ 
        fontSize: '0.8rem', 
        color: 'var(--text-secondary)' 
      }}>
        ({total})
      </span>
    </div>
  );
}

export default EstrellasProducto;