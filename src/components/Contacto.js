import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { sendContactNotification } from '../services/emailService';
import { FiSend, FiCheckCircle } from 'react-icons/fi';

function Contacto({ user }) {
  const [mensaje, setMensaje] = useState('');
  const [asunto, setAsunto] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mensaje.trim()) {
      setError('Por favor escribí un mensaje');
      return;
    }

    setEnviando(true);
    setError('');

    try {
      // Determinar nombre y email (del usuario logueado o del formulario)
      const nombreFinal = user ? user.email.split('@')[0] : (nombre || 'Anónimo');
      const emailFinal = user?.email || email || 'no especificado';

      // 1. Guardar en Firestore
      await addDoc(collection(db, 'contactos'), {
        usuario: user ? {
          uid: user.uid,
          email: user.email,
          nombre: user.email.split('@')[0]
        } : {
          email: emailFinal,
          nombre: nombreFinal
        },
        asunto: asunto || 'Consulta general',
        mensaje: mensaje,
        fecha: serverTimestamp(),
        leido: false,
        respondido: false
      });

      // 2. Enviar email usando EmailJS
      const emailResult = await sendContactNotification({
        nombre: nombreFinal,
        email: emailFinal,
        asunto: asunto || 'Consulta general',
        mensaje: mensaje
      });

      if (emailResult.success) {
        console.log('Email enviado correctamente');
      } else {
        console.warn('El mensaje se guardó pero el email no pudo enviarse');
      }

      // Limpiar formulario
      setMensaje('');
      setAsunto('');
      setNombre('');
      setEmail('');
      setEnviado(true);
      
      setTimeout(() => setEnviado(false), 3000);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Hubo un error al enviar el mensaje. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '15px',
      padding: '2rem',
      border: '1px solid var(--border-color)',
      margin: '2rem auto',
      maxWidth: '600px'
    }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        💬 ¿Tenés alguna consulta?
      </h3>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Dejanos tu mensaje y te responderemos a la brevedad por email.
      </p>

      {enviado && (
        <div style={{
          background: 'var(--success)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FiCheckCircle size={20} />
          <span>¡Mensaje enviado! Te responderemos pronto.</span>
        </div>
      )}

      {error && (
        <div style={{
          background: 'var(--danger)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Si el usuario NO está logueado, mostramos campos adicionales */}
        {!user && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                Tu nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                Tu email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
            Asunto (opcional)
          </label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Ej: Consulta sobre envíos"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
            Mensaje *
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribí tu consulta..."
            rows="5"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            width: '100%',
            padding: '15px',
            background: enviando ? 'var(--text-secondary)' : 'var(--info)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: enviando ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => !enviando && (e.currentTarget.style.background = '#2980b9')}
          onMouseLeave={e => !enviando && (e.currentTarget.style.background = 'var(--info)')}
        >
          {enviando ? 'Enviando...' : (
            <>
              <FiSend /> Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default Contacto;