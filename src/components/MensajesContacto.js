import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiMail, FiCheck, FiTrash2, FiClock } from 'react-icons/fi';

function MensajesContacto() {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'noLeidos', 'respondidos'

  useEffect(() => {
    const mensajesRef = collection(db, 'contactos');
    const q = query(mensajesRef, orderBy('fecha', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevosMensajes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate() || new Date()
      }));
      setMensajes(nuevosMensajes);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const marcarComoLeido = async (id) => {
    try {
      const mensajeRef = doc(db, 'contactos', id);
      await updateDoc(mensajeRef, { leido: true });
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  const marcarComoRespondido = async (id) => {
    try {
      const mensajeRef = doc(db, 'contactos', id);
      await updateDoc(mensajeRef, { respondido: true });
    } catch (error) {
      console.error('Error al marcar como respondido:', error);
    }
  };

  const eliminarMensaje = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este mensaje?')) {
      try {
        await deleteDoc(doc(db, 'contactos', id));
      } catch (error) {
        console.error('Error al eliminar mensaje:', error);
      }
    }
  };

  const mensajesFiltrados = mensajes.filter(msg => {
    if (filtro === 'noLeidos') return !msg.leido;
    if (filtro === 'respondidos') return msg.respondido;
    return true;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--info)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FiMail /> Mensajes de Contacto ({mensajesFiltrados.length})
      </h3>

      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setFiltro('todos')}
          style={{
            padding: '8px 16px',
            background: filtro === 'todos' ? 'var(--info)' : 'var(--filter-bg)',
            color: filtro === 'todos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('noLeidos')}
          style={{
            padding: '8px 16px',
            background: filtro === 'noLeidos' ? 'var(--warning)' : 'var(--filter-bg)',
            color: filtro === 'noLeidos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          No leídos
        </button>
        <button
          onClick={() => setFiltro('respondidos')}
          style={{
            padding: '8px 16px',
            background: filtro === 'respondidos' ? 'var(--success)' : 'var(--filter-bg)',
            color: filtro === 'respondidos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Respondidos
        </button>
      </div>

      {/* Lista de mensajes */}
      {mensajesFiltrados.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--bg-card)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '3rem' }}>📭</span>
          <p>No hay mensajes para mostrar</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {mensajesFiltrados.map(msg => (
            <div
              key={msg.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '10px',
                border: `1px solid ${!msg.leido ? 'var(--warning)' : 'var(--border-color)'}`,
                padding: '1.5rem'
              }}
            >
              {/* Header del mensaje */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {msg.usuario?.nombre || 'Anónimo'}
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>
                    ({msg.usuario?.email || 'email no especificado'})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {!msg.leido && (
                    <button
                      onClick={() => marcarComoLeido(msg.id)}
                      style={{
                        background: 'var(--warning)',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <FiCheck /> Marcar leído
                    </button>
                  )}
                  {!msg.respondido && (
                    <button
                      onClick={() => marcarComoRespondido(msg.id)}
                      style={{
                        background: 'var(--success)',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <FiCheck /> Respondido
                    </button>
                  )}
                  <button
                    onClick={() => eliminarMensaje(msg.id)}
                    style={{
                      background: 'var(--danger)',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {/* Asunto */}
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {msg.asunto}
              </h4>

              {/* Mensaje */}
              <p style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                padding: '1rem',
                background: 'var(--filter-bg)',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.mensaje}
              </p>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <span>
                  <FiClock style={{ marginRight: '5px' }} />
                  {msg.fecha?.toLocaleString() || 'Fecha desconocida'}
                </span>
                <span>
                  Estado: 
                  <span style={{
                    color: msg.respondido ? 'var(--success)' : (msg.leido ? 'var(--info)' : 'var(--warning)'),
                    marginLeft: '5px',
                    fontWeight: 'bold'
                  }}>
                    {msg.respondido ? 'Respondido' : (msg.leido ? 'Leído' : 'No leído')}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MensajesContacto;