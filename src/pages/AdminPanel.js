import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { addProducto, updateProducto, deleteProducto, marcarOferta, quitarOferta, getProductos } from '../services/productosService';
import { getCombos, addCombo, updateCombo, deleteCombo } from '../services/combosService';
import Estadisticas from '../components/Estadisticas';
import GestionPedidos from '../components/GestionPedidos';
import MensajesContacto from '../components/MensajesContacto';
import GestionCombos from '../components/GestionCombos';

function AdminPanel({ user, productos, setProductos }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState('lista');
  const [tabActivo, setTabActivo] = useState('productos');
  const [combos, setCombos] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    precio: '',
    imagen: '',
    categoria: '',
    descripcion: '',
    stock: '',
    tipoUnidad: 'unidades'
  });

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const productosFirestore = await getProductos();
        setProductos(productosFirestore);
        
        const combosFirestore = await getCombos();
        setCombos(combosFirestore);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [setProductos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      precio: '',
      imagen: '',
      categoria: '',
      descripcion: '',
      stock: '',
      tipoUnidad: 'unidades'
    });
  };

  const handleNuevoProducto = () => {
    resetForm();
    setModo('nuevo');
  };

  const handleEditarProducto = (producto) => {
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      descripcion: producto.descripcion || '',
      stock: producto.stock || 10,
      tipoUnidad: producto.tipoUnidad || 'unidades'
    });
    setModo('editar');
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio || !formData.categoria) {
      alert('Por favor completá los campos obligatorios');
      return;
    }

    const productoData = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      imagen: formData.imagen || 'https://via.placeholder.com/400?text=Sin+Imagen',
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      stock: Number(formData.stock) || 10,
      tipoUnidad: formData.tipoUnidad
    };

    try {
      if (modo === 'nuevo') {
        const nuevoProducto = await addProducto(productoData);
        setProductos(prev => [...prev, nuevoProducto]);
        alert('✅ Producto agregado correctamente');
      } else {
        const productoActualizado = await updateProducto(formData.id, productoData);
        setProductos(prev => prev.map(p => 
          p.id === formData.id ? productoActualizado : p
        ));
        alert('✅ Producto actualizado correctamente');
      }
    } catch (error) {
      alert('Error al guardar el producto');
    }

    setModo('lista');
    resetForm();
  };

  const handleEliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProducto(id);
        setProductos(prev => prev.filter(p => p.id !== id));
        alert('✅ Producto eliminado');
      } catch (error) {
        alert('Error al eliminar el producto');
      }
    }
  };

  const marcarProductoOferta = async (id, descuento) => {
    try {
      await marcarOferta(id, descuento);
      const productosActualizados = await getProductos();
      setProductos(productosActualizados);
      alert('✅ Producto marcado como oferta');
    } catch (error) {
      alert('Error al marcar oferta');
    }
  };

  const quitarProductoOferta = async (id) => {
    try {
      await quitarOferta(id);
      const productosActualizados = await getProductos();
      setProductos(productosActualizados);
      alert('✅ Oferta eliminada');
    } catch (error) {
      alert('Error al quitar oferta');
    }
  };

  // Funciones para combos
  const handleAddCombo = async (comboData) => {
    try {
      return await addCombo(comboData);
    } catch (error) {
      alert('Error al agregar combo');
      throw error;
    }
  };

  const handleUpdateCombo = async (id, comboData) => {
    try {
      return await updateCombo(id, comboData);
    } catch (error) {
      alert('Error al actualizar combo');
      throw error;
    }
  };

  const handleDeleteCombo = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este combo?')) {
      try {
        await deleteCombo(id);
        setCombos(prev => prev.filter(c => c.id !== id));
        alert('✅ Combo eliminado');
      } catch (error) {
        alert('Error al eliminar combo');
      }
    }
  };

  const categorias = [...new Set(productos.map(p => p.categoria))];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid var(--border-color)',
            borderTop: '5px solid var(--info)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 20px'
    }}>
      {/* Header del Admin */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        boxShadow: '0 2px 8px var(--shadow-color)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>🧼 CleanSolutions - Panel Admin</h2>
          <span style={{
            background: 'var(--info)',
            color: 'white',
            padding: '3px 10px',
            borderRadius: '15px',
            fontSize: '0.9rem'
          }}>
            {user?.email}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {modo === 'lista' && tabActivo === 'productos' && (
            <button
              onClick={handleNuevoProducto}
              style={{
                padding: '10px 20px',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                fontSize: '1rem'
              }}
            >
              <FiPlus /> Nuevo Producto
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              background: 'var(--filter-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              minHeight: '44px',
              fontSize: '1rem'
            }}
          >
            Ver Tienda
          </button>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '2rem',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '1rem',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <button
          onClick={() => { setTabActivo('productos'); setModo('lista'); }}
          style={{
            padding: '10px 20px',
            background: tabActivo === 'productos' ? 'var(--info)' : 'transparent',
            color: tabActivo === 'productos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }}
        >
          📦 Productos
        </button>
        <button
          onClick={() => { setTabActivo('estadisticas'); setModo('lista'); }}
          style={{
            padding: '10px 20px',
            background: tabActivo === 'estadisticas' ? 'var(--info)' : 'transparent',
            color: tabActivo === 'estadisticas' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }}
        >
          📊 Estadísticas
        </button>
        <button
          onClick={() => { setTabActivo('pedidos'); setModo('lista'); }}
          style={{
            padding: '10px 20px',
            background: tabActivo === 'pedidos' ? 'var(--info)' : 'transparent',
            color: tabActivo === 'pedidos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }}
        >
          📋 Pedidos
        </button>
        <button
          onClick={() => { setTabActivo('contactos'); setModo('lista'); }}
          style={{
            padding: '10px 20px',
            background: tabActivo === 'contactos' ? 'var(--info)' : 'transparent',
            color: tabActivo === 'contactos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }}
        >
          📬 Contactos
        </button>
        <button
          onClick={() => { setTabActivo('combos'); setModo('lista'); }}
          style={{
            padding: '10px 20px',
            background: tabActivo === 'combos' ? 'var(--info)' : 'transparent',
            color: tabActivo === 'combos' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }}
        >
          🎁 Combos
        </button>
      </div>

      {/* Contenido según tab */}
      {tabActivo === 'productos' && (
        <>
          {modo === 'lista' ? (
            <>
              {/* Sección de Ofertas */}
              <div style={{
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: '10px',
                marginBottom: '2rem',
                border: '2px solid var(--warning)'
              }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  🏷️ Gestión de Ofertas
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '15px'
                }}>
                  {productos.map(producto => (
                    <div key={producto.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      background: 'var(--filter-bg)',
                      borderRadius: '8px',
                      border: producto.oferta ? '2px solid var(--success)' : '1px solid var(--border-color)'
                    }}>
                      <img src={producto.imagen} alt={producto.nombre} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{producto.nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          ${producto.precio.toLocaleString('es-CL')}
                        </div>
                      </div>
                      {producto.oferta ? (
                        <button onClick={() => quitarProductoOferta(producto.id)} style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', minHeight: '44px' }}>
                          Quitar {producto.descuento}%
                        </button>
                      ) : (
                        <button onClick={() => {
                          const d = prompt('Descuento:', '20');
                          if (d && !isNaN(d) && d > 0 && d <= 100) marcarProductoOferta(producto.id, Number(d));
                        }} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', minHeight: '44px' }}>
                          Oferta
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de productos */}
              <div style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '10px', 
                border: '1px solid var(--border-color)', 
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 2fr 1fr 1fr 80px 100px 100px 120px',
                  gap: '10px',
                  padding: '15px',
                  background: 'var(--filter-bg)',
                  fontWeight: 'bold',
                  borderBottom: '2px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  minWidth: '900px'
                }}>
                  <div>Img</div>
                  <div>Nombre</div>
                  <div>Categoría</div>
                  <div>Precio</div>
                  <div>Oferta</div>
                  <div>Stock</div>
                  <div>Unidad</div>
                  <div>Acciones</div>
                </div>
                {productos.map(p => (
                  <div key={p.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 2fr 1fr 1fr 80px 100px 100px 120px',
                    gap: '10px',
                    padding: '15px',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center',
                    color: 'var(--text-primary)',
                    minWidth: '900px'
                  }}>
                    <div><img src={p.imagen} alt={p.nombre} style={{ width: '60px', height: '60px', borderRadius: '5px', objectFit: 'cover' }} /></div>
                    <div>{p.nombre}</div>
                    <div><span style={{ background: 'var(--filter-bg)', padding: '3px 8px', borderRadius: '12px' }}>{p.categoria}</span></div>
                    <div>{p.oferta ? <>${p.precioOferta?.toLocaleString('es-CL')}<span style={{ fontSize: '0.8rem', textDecoration: 'line-through', marginLeft: '5px' }}>${p.precio.toLocaleString('es-CL')}</span></> : `$${p.precio.toLocaleString('es-CL')}`}</div>
                    <div>{p.oferta ? <span style={{ background: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>{p.descuento}%</span> : '—'}</div>
                    <div><span style={{ color: p.stock > 10 ? 'var(--success)' : 'var(--warning)' }}>{p.stock || 0}</span></div>
                    <div>{p.tipoUnidad || 'unidades'}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditarProducto(p)} style={{ background: 'var(--info)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', minHeight: '44px' }}><FiEdit /> Editar</button>
                      <button onClick={() => handleEliminarProducto(p.id)} style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', minHeight: '44px' }}><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Formulario de producto
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                {modo === 'nuevo' ? '➕ Agregar Nuevo Producto' : '✏️ Editar Producto'}
              </h3>
              <form onSubmit={handleGuardarProducto}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Nombre *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '16px' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Precio * (CLP)</label>
                    <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required min="0" style={{ width: '100%', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '16px' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Categoría *</label>
                    <select name="categoria" value={formData.categoria} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '16px', minHeight: '44px' }}>
                      <option value="">Seleccionar...</option>
                      <option value="Limpieza">Limpieza</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Cuidado Personal">Cuidado Personal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" style={{ width: '100%', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '16px' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Tipo de unidad</label>
                    <select name="tipoUnidad" value={formData.tipoUnidad} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '2px solid var(--border-color)', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '16px', minHeight: '44px' }}>
                      <option value="unidades">Unidades</option>
                      <option value="litros">Litros</option>
                      <option value="kilos">Kilos</option>
                      <option value="gramos">Gramos</option>
                      <option value="mililitros">Mililitros</option>
                      <option value="pares">Pares</option>
                    </select>
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                      URL de Imagen
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
                        fontSize: '16px',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    {formData.imagen && (
                      <div style={{ marginTop: '10px' }}>
                        <img 
                          src={formData.imagen} 
                          alt="Preview"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '5px',
                            border: '1px solid var(--border-color)'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200?text=Error';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        resize: 'vertical',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setModo('lista')}
                    style={{
                      padding: '12px 25px',
                      background: 'var(--filter-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      minHeight: '44px',
                      fontSize: '16px'
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
                      minHeight: '44px',
                      fontSize: '16px'
                    }}
                  >
                    {modo === 'nuevo' ? 'Guardar Producto' : 'Actualizar Producto'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {tabActivo === 'estadisticas' && <Estadisticas productos={productos} />}
      {tabActivo === 'pedidos' && <GestionPedidos />}
      {tabActivo === 'contactos' && <MensajesContacto />}
      {tabActivo === 'combos' && (
        <GestionCombos
          productos={productos}
          combos={combos}
          setCombos={setCombos}
          onAdd={handleAddCombo}
          onUpdate={handleUpdateCombo}
          onDelete={handleDeleteCombo}
        />
      )}
    </div>
  );
}

export default AdminPanel;