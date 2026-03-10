import { useState, useEffect } from 'react';
import { getPedidos, updatePedidoEstado, deletePedido } from '../services/pedidosService';
import { FiEye, FiCheck, FiTruck, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    const data = await getPedidos();
    setPedidos(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    setLoading(false);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await updatePedidoEstado(id, nuevoEstado);
      await cargarPedidos();
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  };

  const handleEliminarPedido = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await deletePedido(id);
        await cargarPedidos();
      } catch (error) {
        alert('Error al eliminar el pedido');
      }
    }
  };

  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'var(--warning)';
      case 'pagado': return 'var(--info)';
      case 'enviado': return '#9b59b6';
      case 'entregado': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente': return '⏳';
      case 'pagado': return '💰';
      case 'enviado': return '🚚';
      case 'entregado': return '✅';
      default: return '📦';
    }
  };

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
        <p style={{ color: 'var(--text-secondary)' }}>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
          📋 Gestión de Pedidos
        </h3>
        
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            padding: '8px 15px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="todos">Todos los pedidos</option>
          <option value="pendiente">Pendientes</option>
          <option value="pagado">Pagados</option>
          <option value="enviado">Enviados</option>
          <option value="entregado">Entregados</option>
        </select>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--bg-card)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '3rem' }}>📭</span>
          <p style={{ color: 'var(--text-secondary)' }}>No hay pedidos para mostrar</p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {pedidosFiltrados.map(pedido => (
            <div key={pedido.id} style={{
              background: 'var(--bg-card)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden'
            }}>
              {/* Cabecera del pedido */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 20px',
                background: 'var(--filter-bg)',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{getEstadoIcon(pedido.estado)}</span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      Pedido #{pedido.id}
                    </strong>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {new Date(pedido.fecha).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{
                    background: getEstadoColor(pedido.estado),
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.9rem'
                  }}>
                    {pedido.estado.toUpperCase()}
                  </span>
                  
                  <select
                    value={pedido.estado}
                    onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '5px',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="pagado">💰 Pagado</option>
                    <option value="enviado">🚚 Enviado</option>
                    <option value="entregado">✅ Entregado</option>
                  </select>
                  
                  <button
                    onClick={() => handleEliminarPedido(pedido.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '5px'
                    }}
                    title="Eliminar pedido"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {/* Detalle del pedido */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                      Datos del Cliente
                    </h4>
                    <p><strong>Nombre:</strong> {pedido.usuario}</p>
                    <p><strong>Email:</strong> {pedido.email}</p>
                    <p><strong>Teléfono:</strong> {pedido.telefono}</p>
                    <p><strong>Dirección:</strong> {pedido.direccion}</p>
                  </div>
                  
                  <div>
                    <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                      Información del Pedido
                    </h4>
                    <p><strong>Método de pago:</strong> {pedido.metodoPago}</p>
                    {pedido.notas && (
                      <p><strong>Notas:</strong> {pedido.notas}</p>
                    )}
                  </div>
                </div>

                <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                  Productos
                </h4>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: 'var(--filter-bg)',
                      color: 'var(--text-secondary)'
                    }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Producto</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Precio</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Cantidad</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.productos.map((prod, index) => (
                      <tr key={index} style={{
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>
                          {prod.nombre}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', color: 'var(--text-primary)' }}>
                          ${prod.precio.toLocaleString('es-CL')}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-primary)' }}>
                          {prod.cantidad}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', color: 'var(--success)', fontWeight: 'bold' }}>
                          ${(prod.precio * prod.cantidad).toLocaleString('es-CL')}
                        </td>
                      </tr>
                    ))}
                    <tr style={{
                      borderTop: '2px solid var(--border-color)',
                      background: 'var(--filter-bg)'
                    }}>
                      <td colSpan="3" style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                        TOTAL:
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                        ${pedido.total.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GestionPedidos;