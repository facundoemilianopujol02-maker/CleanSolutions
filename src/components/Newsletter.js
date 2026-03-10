import { useState } from 'react';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [suscrito, setSuscrito] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación simple
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresá un email válido');
      return;
    }

    // Guardar en localStorage (simulado)
    const suscriptores = JSON.parse(localStorage.getItem('suscriptores') || '[]');
    if (!suscriptores.includes(email)) {
      suscriptores.push(email);
      localStorage.setItem('suscriptores', JSON.stringify(suscriptores));
    }

    setSuscrito(true);
    setEmail('');
    setError('');

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => setSuscrito(false), 3000);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--info) 0%, #5faee3 100%)',
      padding: '3rem 2rem',
      borderRadius: '15px',
      marginBottom: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efecto decorativo */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-80px',
        left: '-80px',
        width: '300px',
        height: '300px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{
          color: 'white',
          fontSize: '2rem',
          marginBottom: '1rem'
        }}>
          📧 ¡No te pierdas ninguna oferta!
        </h2>
        
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '1.1rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Suscribite a nuestro newsletter y recibí las mejores ofertas directamente en tu email.
        </p>

        {suscrito && (
          <div style={{
            background: 'rgba(46, 204, 113, 0.9)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <FiCheckCircle size={20} />
            <span>¡Gracias por suscribirte!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '10px',
          maxWidth: '500px',
          margin: '0 auto',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <FiMail style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999'
            }} />
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '15px 15px 15px 45px',
                border: error ? '2px solid var(--danger)' : 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              background: 'var(--success)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#27ae60';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--success)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Suscribirme
          </button>
        </form>

        {error && (
          <p style={{
            color: 'white',
            marginTop: '1rem',
            background: 'rgba(231, 76, 60, 0.8)',
            padding: '0.5rem',
            borderRadius: '5px',
            display: 'inline-block'
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Newsletter;