import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import Estrellas from './Estrellas';
import { FiSend, FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

// Función para calcular promedios (exportada)
export const calcularPromedios = async (productos) => {
  const promedios = {};
  
  for (const producto of productos) {
    const q = query(
      collection(db, 'valoraciones'),
      where('productoId', '==', producto.id.toString())
    );
    
    const querySnapshot = await getDocs(q);
    const valoraciones = querySnapshot.docs.map(doc => doc.data());
    
    if (valoraciones.length > 0) {
      const suma = valoraciones.reduce((acc, v) => acc + v.puntuacion, 0);
      promedios[producto.id] = {
        promedio: suma / valoraciones.length,
        total: valoraciones.length
      };
    } else {
      promedios[producto.id] = {
        promedio: 0,
        total: 0
      };
    }
  }
  
  return promedios;
};

function Valoraciones({ productoId, user }) {
  const [valoraciones, setValoraciones] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editandoComentario, setEditandoComentario] = useState('');
  const [editandoPuntuacion, setEditandoPuntuacion] = useState(0);

  // Escuchar valoraciones en tiempo real
  useEffect(() => {
    setLoading(true);
    
    const q = query(
      collection(db, 'valoraciones'),
      where('productoId', '==', productoId.toString())
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const valoracionesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate() || new Date()
      }));
      
      setValoraciones(valoracionesData);
      
      // Calcular promedio
      if (valoracionesData.length > 0) {
        const suma = valoracionesData.reduce((acc, v) => acc + v.puntuacion, 0);
        setPromedio(suma / valoracionesData.length);
      } else {
        setPromedio(0);
      }
      
      setTotal(valoracionesData.length);
      setLoading(false);
    }, (error) => {
      console.error('Error al cargar valoraciones:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productoId]);

  const enviarValoracion = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debés iniciar sesión para valorar');
      return;
    }
    
    if (puntuacion === 0) {
      alert('Seleccioná una puntuación');
      return;
    }

    setEnviando(true);

    try {
      await addDoc(collection(db, 'valoraciones'), {
        productoId: productoId.toString(),
        usuarioId: user.uid,
        usuarioEmail: user.email,
        puntuacion: puntuacion,
        comentario: comentario,
        fecha: serverTimestamp()
      });

      setComentario('');
      setPuntuacion(0);
      
    } catch (error) {
      console.error('Error al enviar valoración:', error);
      alert('Error al enviar la valoración');
    } finally {
      setEnviando(false);
    }
  };

  const iniciarEdicion = (valoracion) => {
    setEditandoId(valoracion.id);
    setEditandoComentario(valoracion.comentario || '');
    setEditandoPuntuacion(valoracion.puntuacion);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditandoComentario('');
    setEditandoPuntuacion(0);
  };

  const guardarEdicion = async (id) => {
    try {
      const valoracionRef = doc(db, 'valoraciones', id);
      await updateDoc(valoracionRef, {
        puntuacion: editandoPuntuacion,
        comentario: editandoComentario,
        editado: true,
        fechaEdicion: serverTimestamp()
      });
      
      cancelarEdicion();
    } catch (error) {
      console.error('Error al editar valoración:', error);
      alert('Error al guardar los cambios');
    }
  };

  const eliminarValoracion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar tu valoración?')) {
      try {
        await deleteDoc(doc(db, 'valoraciones', id));
      } catch (error) {
        console.error('Error al eliminar valoración:', error);
        alert('Error al eliminar la valoración');
      }
    }
  };

  // Verificar si el usuario ya votó
  const yaVoto = user ? valoraciones.some(v => v.usuarioId === user.uid) : false;

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'var(--filter-bg)',
        borderRadius: '15px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--info)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Cargando valoraciones...</p>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '3rem',
      padding: '2rem',
      background: 'var(--filter-bg)',
      borderRadius: '15px',
      border: '1px solid var(--border-color)'
    }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        ⭐ Valoraciones de clientes
      </h3>

      {/* Resumen de valoraciones */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            {promedio > 0 ? promedio.toFixed(1) : '0.0'}
          </span>
          <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>/5</span>
          <div style={{ marginTop: '0.5rem' }}>
            <Estrellas puntuacion={Math.round(promedio)} tamaño={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {total} {total === 1 ? 'valoración' : 'valoraciones'}
          </p>
        </div>
      </div>

      {/* Formulario para nueva valoración (solo para usuarios logueados que no hayan votado) */}
      {user && !yaVoto ? (
        <form onSubmit={enviarValoracion} style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'var(--bg-card)',
          borderRadius: '10px'
        }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Dejá tu valoración
          </h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Puntuación
            </label>
            <Estrellas
              puntuacion={puntuacion}
              editable={true}
              onChange={setPuntuacion}
              tamaño={32}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Contanos tu experiencia con este producto..."
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            style={{
              padding: '12px 25px',
              background: enviando ? 'var(--text-secondary)' : 'var(--info)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: enviando ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1rem'
            }}
          >
            <FiSend /> {enviando ? 'Enviando...' : 'Enviar valoración'}
          </button>
        </form>
      ) : user && yaVoto ? (
        <p style={{
          padding: '1rem',
          background: 'var(--bg-card)',
          borderRadius: '10px',
          marginBottom: '2rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          ✅ Ya has valorado este producto. Podés editar o eliminar tu valoración abajo.
        </p>
      ) : (
        <p style={{
          padding: '1rem',
          background: 'var(--bg-card)',
          borderRadius: '10px',
          marginBottom: '2rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          🔑 Iniciá sesión para dejar tu valoración
        </p>
      )}

      {/* Lista de valoraciones */}
      {valoraciones.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {valoraciones.sort((a, b) => b.fecha - a.fecha).map(val => {
            const esMiValoracion = user && val.usuarioId === user.uid;
            const estaEditando = editandoId === val.id;

            return (
              <div
                key={val.id}
                style={{
                  padding: '1rem',
                  background: esMiValoracion ? 'rgba(52, 152, 219, 0.1)' : 'var(--bg-card)',
                  borderRadius: '10px',
                  border: `1px solid ${esMiValoracion ? 'var(--info)' : 'var(--border-color)'}`,
                  position: 'relative'
                }}
              >
                {estaEditando ? (
                  // MODO EDICIÓN
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Puntuación
                      </label>
                      <Estrellas
                        puntuacion={editandoPuntuacion}
                        editable={true}
                        onChange={setEditandoPuntuacion}
                        tamaño={32}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Comentario
                      </label>
                      <textarea
                        value={editandoComentario}
                        onChange={(e) => setEditandoComentario(e.target.value)}
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => guardarEdicion(val.id)}
                        style={{
                          padding: '8px 15px',
                          background: 'var(--success)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiCheck /> Guardar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        style={{
                          padding: '8px 15px',
                          background: 'var(--text-secondary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiX /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // MODO VISUALIZACIÓN
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <Estrellas puntuacion={val.puntuacion} tamaño={16} />
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          {val.usuarioEmail?.split('@')[0] || 'Anónimo'}
                        </span>
                        {val.editado && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic'
                          }}>
                            (editado)
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {formatearFecha(val.fecha)}
                      </span>
                    </div>
                    
                    {val.comentario && (
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                        {val.comentario}
                      </p>
                    )}

                    {/* Botones de acción para el dueño de la valoración */}
                    {esMiValoracion && (
                      <div style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end',
                        marginTop: '1rem'
                      }}>
                        <button
                          onClick={() => iniciarEdicion(val)}
                          style={{
                            padding: '5px 10px',
                            background: 'var(--info)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <FiEdit /> Editar
                        </button>
                        <button
                          onClick={() => eliminarValoracion(val.id)}
                          style={{
                            padding: '5px 10px',
                            background: 'var(--danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <FiTrash2 /> Eliminar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-secondary)'
        }}>
          No hay valoraciones aún. ¡Sé el primero en opinar!
        </p>
      )}
    </div>
  );
}

export default Valoraciones;