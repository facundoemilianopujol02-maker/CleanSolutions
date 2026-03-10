import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';

function GestionCombos({ productos = [], combos = [], setCombos, onAdd, onUpdate, onDelete }) {
  const [modo, setModo] = useState('lista'); // 'lista', 'nuevo', 'editar'
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [editandoCantidad, setEditandoCantidad] = useState(null);
  const [cantidadTemp, setCantidadTemp] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: '',
    activo: true
  });

  console.log('📦 GestionCombos - productos recibidos:', productos?.length || 0);
  console.log('🎁 GestionCombos - combos recibidos:', combos?.length || 0);

  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      precio: '',
      imagen: '',
      descripcion: '',
      activo: true
    });
    setProductosSeleccionados([]);
  };

  const handleNuevoCombo = () => {
    resetForm();
    setModo('nuevo');
  };

  const handleEditarCombo = (combo) => {
    setFormData({
      id: combo.id,
      nombre: combo.nombre,
      precio: combo.precio,
      imagen: combo.imagen || '',
      descripcion: combo.descripcion || '',
      activo: combo.activo !== false
    });
    setProductosSeleccionados(combo.productos || []);
    setModo('editar');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const iniciarEdicionCantidad = (producto) => {
    setEditandoCantidad(producto.id);
    setCantidadTemp(producto.cantidad.toString());
  };

  const guardarCantidad = (id) => {
    const nuevaCantidad = parseFloat(cantidadTemp);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      alert('Ingresá una cantidad válida mayor a 0');
      return;
    }

    setProductosSeleccionados(prev =>
      prev.map(p =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
    setEditandoCantidad(null);
    setCantidadTemp('');
  };

  const cancelarEdicionCantidad = () => {
    setEditandoCantidad(null);
    setCantidadTemp('');
  };

  const agregarProductoAlCombo = (producto) => {
    if (!producto) return;

    if (productosSeleccionados.some(p => p.id === producto.id)) {
      alert('Este producto ya está en el combo');
      return;
    }

    const cantidad = prompt(`¿Cuántas ${producto.tipoUnidad || 'unidades'} de ${producto.nombre}?`, '1');
    if (cantidad && !isNaN(cantidad) && cantidad > 0) {
      setProductosSeleccionados([
        ...productosSeleccionados,
        {
          id: producto.id,
          nombre: producto.nombre,
          imagen: producto.imagen,
          tipoUnidad: producto.tipoUnidad || 'unidades',
          cantidad: Number(cantidad)
        }
      ]);
    }
  };

  const quitarProductoDelCombo = (id) => {
    setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== id));
  };

  const handleGuardarCombo = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      alert('El nombre y el precio son obligatorios');
      return;
    }

    if (productosSeleccionados.length === 0) {
      alert('Debés agregar al menos un producto al combo');
      return;
    }

    const comboData = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      imagen: formData.imagen || 'https://via.placeholder.com/400?text=Combo',
      descripcion: formData.descripcion,
      productos: productosSeleccionados,
      activo: formData.activo
    };

    try {
      if (modo === 'nuevo') {
        const nuevoCombo = await onAdd(comboData);
        setCombos(prev => [...(prev || []), nuevoCombo]);
        alert('✅ Combo agregado correctamente');
      } else {
        const comboActualizado = await onUpdate(formData.id, comboData);
        setCombos(prev => (prev || []).map(c => c.id === formData.id ? comboActualizado : c));
        alert('✅ Combo actualizado correctamente');
      }
      setModo('lista');
      resetForm();
    } catch (error) {
      alert('Error al guardar el combo');
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {modo === 'lista' ? (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
              🎁 Gestión de Combos
            </h3>
            <button
              onClick={handleNuevoCombo}
              style={{
                padding: '10px 20px',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FiPlus /> Nuevo Combo
            </button>
          </div>

          {!combos || combos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'var(--bg-card)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '3rem' }}>🎁</span>
              <p>No hay combos creados todavía</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {combos.map(combo => (
                <div
                  key={combo.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img
                        src={combo.imagen}
                        alt={combo.nombre}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>
                          {combo.nombre}
                        </h4>
                        <span style={{
                          background: combo.activo ? 'var(--success)' : 'var(--text-secondary)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}>
                          {combo.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditarCombo(combo)}
                        style={{
                          padding: '5px 10px',
                          background: 'var(--info)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiEdit /> Editar
                      </button>
                      <button
                        onClick={() => onDelete(combo.id)}
                        style={{
                          padding: '5px 10px',
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiTrash2 /> Eliminar
                      </button>
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--filter-bg)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
                      Productos incluidos:
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {combo.productos && combo.productos.length > 0 ? (
                        combo.productos.map(prod => (
                          <div key={prod.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'var(--text-secondary)'
                          }}>
                            <span>{prod.nombre}</span>
                            <span style={{ fontWeight: 'bold' }}>
                              {prod.cantidad} {prod.tipoUnidad}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>Sin productos</p>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {combo.descripcion}
                    </span>
                    <span style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: 'var(--success)'
                    }}>
                      ${combo.precio.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Formulario de combo
        <div style={{
          background: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            {modo === 'nuevo' ? '➕ Crear Nuevo Combo' : '✏️ Editar Combo'}
          </h3>

          <form onSubmit={handleGuardarCombo}>
            <div style={{ display: 'grid', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Nombre del Combo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Precio del Combo * (CLP)
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  URL de Imagen (opcional)
                </label>
                <input
                  type="url"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Estado
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                  />
                  Combo activo (visible en la tienda)
                </label>
              </div>
            </div>

            {/* Selección de productos para el combo */}
            <div style={{
              background: 'var(--filter-bg)',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Productos del Combo
              </h4>

              {productos && productos.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                  marginBottom: '1rem'
                }}>
                  {productos.map(producto => (
                    <button
                      key={producto.id}
                      type="button"
                      onClick={() => agregarProductoAlCombo(producto)}
                      style={{
                        padding: '8px',
                        background: 'var(--info)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      + {producto.nombre}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  No hay productos disponibles. Creá productos primero.
                </p>
              )}

              {productosSeleccionados.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  <h5 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Productos seleccionados:
                  </h5>
                  {productosSeleccionados.map(prod => (
                    <div key={prod.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px',
                      background: 'var(--bg-card)',
                      borderRadius: '5px',
                      marginBottom: '5px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <img
                          src={prod.imagen}
                          alt={prod.nombre}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '5px',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--text-primary)' }}>
                            {prod.nombre}
                          </div>
                          {editandoCantidad === prod.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                              <input
                                type="number"
                                value={cantidadTemp}
                                onChange={(e) => setCantidadTemp(e.target.value)}
                                min="0.1"
                                step="0.1"
                                style={{
                                  width: '80px',
                                  padding: '4px',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '4px'
                                }}
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => guardarCantidad(prod.id)}
                                style={{
                                  background: 'var(--success)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={cancelarEdicionCantidad}
                                style={{
                                  background: 'var(--text-secondary)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                              <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                                {prod.cantidad} {prod.tipoUnidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => iniciarEdicionCantidad(prod)}
                                style={{
                                  background: 'var(--info)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem'
                                }}
                              >
                                ✎ Editar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => quitarProductoDelCombo(prod.id)}
                        style={{
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          marginLeft: '5px'
                        }}
                      >
                        ✕ Quitar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  No hay productos seleccionados. Hacé clic en los productos para agregarlos al combo.
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setModo('lista')}
                style={{
                  padding: '12px 25px',
                  background: 'var(--filter-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 25px',
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FiSave /> {modo === 'nuevo' ? 'Guardar Combo' : 'Actualizar Combo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GestionCombos;