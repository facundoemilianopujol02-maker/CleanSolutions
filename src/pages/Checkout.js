import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPedido } from '../services/pedidosService';
import { sendOrderNotification } from '../services/emailService';

// Zonas de envío disponibles
const ZONAS_ENVIO = [
  { nombre: 'Corrientes Capital', codigo: 'corrientes' },
  { nombre: 'Riachuelo', codigo: 'riachuelo' },
  { nombre: 'San Cayetano', codigo: 'sancayetano' }
];

function Checkout({ carrito, totalCarrito, vaciarCarrito }) {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [procesando, setProcesando] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  
  // Estados para envío
  const [envioHabilitado, setEnvioHabilitado] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    metodoPago: 'transferencia',
    montoEfectivo: '',
    necesitaCambio: 'no',
    notas: ''
  });

  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');

  // Calcular total (sin envío por ahora)
  const calcularTotal = () => {
    return totalCarrito;
  };

  // Si el carrito está vacío y no es compra exitosa, redirigir
  if (carrito.length === 0 && !compraExitosa) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '4rem auto',
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--bg-card)',
        borderRadius: '15px',
        boxShadow: '0 4px 12px var(--shadow-color)',
        border: '1px solid var(--border-color)'
      }}>
        <span style={{ fontSize: '4rem' }}>🛒</span>
        <h2 style={{ color: 'var(--text-primary)' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Agregá productos antes de finalizar la compra.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '15px 30px',
            background: 'var(--info)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          ← Volver a la tienda
        </button>
      </div>
    );
  }

  // Validar campo específico
  const validarCampo = (name, value) => {
    switch (name) {
      case 'nombre':
        return value.length < 3 ? 'Nombre muy corto' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : '';
      case 'telefono':
        return !/^[0-9]{9,}$/.test(value.replace(/\D/g, '')) ? 'Teléfono inválido (mínimo 9 dígitos)' : '';
      case 'montoEfectivo':
        if (formData.metodoPago === 'efectivo') {
          if (!value) return 'Este campo es requerido';
          const monto = Number(value);
          const total = calcularTotal();
          if (isNaN(monto) || monto < total) {
            return `El monto debe ser al menos $${total.toLocaleString('es-CL')}`;
          }
        }
        return '';
      default:
        return '';
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real
    const error = validarCampo(name, value);
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  // Validar todo el formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Validar campos del paso 1
    if (paso === 1) {
      const camposRequeridos = ['nombre', 'email', 'telefono'];
      
      // Si el envío está habilitado, validar que se haya seleccionado zona
      if (envioHabilitado && !zonaSeleccionada) {
        nuevosErrores.zona = 'Debés seleccionar una zona de envío';
      }

      camposRequeridos.forEach(campo => {
        if (!formData[campo]) {
          nuevosErrores[campo] = 'Este campo es requerido';
        } else {
          const error = validarCampo(campo, formData[campo]);
          if (error) nuevosErrores[campo] = error;
        }
      });
    }

    // Validar campos del paso 2 según método de pago
    if (paso === 2 && formData.metodoPago === 'efectivo') {
      const error = validarCampo('montoEfectivo', formData.montoEfectivo);
      if (error) nuevosErrores.montoEfectivo = error;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Avanzar al siguiente paso
  const siguientePaso = () => {
    const esValido = validarFormulario();
    if (esValido) {
      setPaso(paso + 1);
    }
  };

  // Procesar compra
  const procesarCompra = async () => {
    if (!validarFormulario()) return;

    setProcesando(true);

    try {
      // Crear objeto del pedido
      const nuevoPedido = {
        usuario: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        envioHabilitado: envioHabilitado,
        zonaEnvio: envioHabilitado ? {
          zona: ZONAS_ENVIO.find(z => z.codigo === zonaSeleccionada)?.nombre
        } : null,
        productos: carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad
        })),
        subtotal: totalCarrito,
        costoEnvio: 0,
        total: calcularTotal(),
        metodoPago: formData.metodoPago,
        datosPago: formData.metodoPago === 'efectivo' ? {
          montoEfectivo: Number(formData.montoEfectivo),
          necesitaCambio: formData.necesitaCambio,
          vuelto: Number(formData.montoEfectivo) - calcularTotal()
        } : null,
        notas: formData.notas,
        estado: 'pendiente',
        fecha: new Date().toISOString()
      };

      await addPedido(nuevoPedido);
      
      // Enviar notificación por email al admin
      await sendOrderNotification({
        ...nuevoPedido,
        id: Date.now()
      });
      
      vaciarCarrito();
      setCompraExitosa(true);
    } catch (error) {
      alert('Error al procesar la compra');
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  // Calcular vuelto
  const calcularVuelto = () => {
    if (!formData.montoEfectivo) return 0;
    const vuelto = Number(formData.montoEfectivo) - calcularTotal();
    return vuelto > 0 ? vuelto : 0;
  };

  // Copiar al portapapeles
  const copiarAlPortapapeles = (texto, mensaje) => {
    navigator.clipboard.writeText(texto);
    alert(`✅ ${mensaje} copiado`);
  };

  // Si la compra fue exitosa
  if (compraExitosa) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '4rem auto',
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--bg-card)',
        borderRadius: '15px',
        boxShadow: '0 4px 12px var(--shadow-color)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--success)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '3rem',
          color: 'white'
        }}>
          ✓
        </div>
        <h2 style={{ color: 'var(--text-primary)' }}>¡Compra exitosa! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Gracias por tu compra, {formData.nombre}.
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Te enviaremos un email a <strong>{formData.email}</strong> con los detalles.
        </p>
        {envioHabilitado && (
          <p style={{ color: 'var(--info)', marginBottom: '1rem' }}>
            📱 Te contactaremos por WhatsApp para acordar el costo de envío.
          </p>
        )}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '15px 30px',
            background: 'var(--info)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Seguir comprando
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '0 20px'
    }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>🛍️ Finalizar Compra</h2>

      {/* Barra de progreso */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '3rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          right: '0',
          height: '2px',
          background: 'var(--border-color)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          width: `${(paso / 3) * 100}%`,
          height: '2px',
          background: 'var(--success)',
          zIndex: 2,
          transition: 'width 0.3s'
        }} />

        {[1, 2, 3].map(num => (
          <div key={num} style={{
            zIndex: 3,
            textAlign: 'center',
            flex: 1
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: paso >= num ? 'var(--success)' : 'var(--bg-card)',
              border: `2px solid ${paso >= num ? 'var(--success)' : 'var(--border-color)'}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              color: paso >= num ? 'white' : 'var(--text-secondary)',
              fontWeight: 'bold'
            }}>
              {num}
            </div>
            <div style={{ fontSize: '0.9rem', color: paso >= num ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {num === 1 && '📦 Datos de contacto'}
              {num === 2 && '💳 Pago'}
              {num === 3 && '✅ Confirmación'}
            </div>
          </div>
        ))}
      </div>

      {/* Contenido según paso */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 2px 8px var(--shadow-color)',
        border: '1px solid var(--border-color)'
      }}>
        {/* PASO 1: Datos de contacto */}
        {paso === 1 && (
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>📞 Datos de contacto</h3>
            
            {/* Opción de envío */}
            <div style={{
              background: 'var(--filter-bg)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={envioHabilitado}
                  onChange={(e) => setEnvioHabilitado(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  🚚 Necesito envío a domicilio
                </span>
              </label>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Si no marcás esta opción, podés retirar tu pedido por nuestro local sin costo adicional.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Datos de contacto */}
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errores.nombre ? 'var(--danger)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
                {errores.nombre && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errores.nombre}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errores.email ? 'var(--danger)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {errores.email && (
                    <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errores.email}</span>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 3794034489"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errores.telefono ? 'var(--danger)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {errores.telefono && (
                    <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errores.telefono}</span>
                  )}
                </div>
              </div>

              {/* Selección de zona de envío (solo si está habilitado) */}
              {envioHabilitado && (
                <>
                  <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                      Zona de envío *
                    </label>
                    <select
                      value={zonaSeleccionada}
                      onChange={(e) => setZonaSeleccionada(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errores.zona ? 'var(--danger)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="">Seleccionar zona...</option>
                      {ZONAS_ENVIO.map(zona => (
                        <option key={zona.codigo} value={zona.codigo}>
                          {zona.nombre}
                        </option>
                      ))}
                    </select>
                    {errores.zona && (
                      <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errores.zona}</span>
                    )}
                  </div>

                  {/* Mensaje sobre costo de envío */}
                  <div style={{
                    background: 'var(--info)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginTop: '1rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                      📱 El costo del envío varía según la distancia. Te lo enviaremos por WhatsApp a la brevedad.
                    </p>
                  </div>
                </>
              )}

              {/* Resumen de totales */}
              <div style={{
                background: 'var(--filter-bg)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Total productos:</span>
                  <span>${totalCarrito.toLocaleString('es-CL')}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '2px solid var(--border-color)'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ color: 'var(--success)' }}>${calcularTotal().toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Método de pago - SOLO TRANSFERENCIA Y EFECTIVO */}
        {paso === 2 && (
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>💳 Método de pago</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={formData.metodoPago === 'transferencia'}
                    onChange={handleChange}
                  />
                  🏦 Transferencia bancaria
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="efectivo"
                    checked={formData.metodoPago === 'efectivo'}
                    onChange={handleChange}
                  />
                  💵 Efectivo
                </label>
              </div>

              {formData.metodoPago === 'transferencia' && (
                <div style={{
                  background: 'var(--filter-bg)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>🏦 Transferencia bancaria</h4>
                  
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                  }}>
                    <p><strong>Banco:</strong> Mercado Pago</p>
                    <p><strong>Alias:</strong> <code style={{ 
                      background: 'var(--filter-bg)', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      color: 'var(--text-primary)',
                      fontWeight: 'bold'
                    }}>cleans.mp</code></p>
                    <p><strong>CBU:</strong> <code style={{ 
                      background: 'var(--filter-bg)', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      color: 'var(--text-primary)',
                      fontWeight: 'bold'
                    }}>0000003100014458797564</code></p>
                    <p><strong>Titular:</strong> Noelia Patricia Maciel</p>
                    <p><strong>Monto a transferir:</strong> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>${calcularTotal().toLocaleString('es-CL')}</span></p>

                    {/* 👇 NUEVO MENSAJE DE WHATSAPP */}
                    <div style={{
                      background: 'var(--info)',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>
                        📱 Se te solicitará el comprobante de pago a través de WhatsApp en la brevedad.
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => copiarAlPortapapeles('cleans.mp', 'Alias')}
                        style={{
                          padding: '8px 15px',
                          background: 'var(--info)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          minHeight: '44px',
                          fontSize: '16px'
                        }}
                      >
                        📋 Copiar alias
                      </button>
                      <button
                        onClick={() => copiarAlPortapapeles('0000003100014458797564', 'CBU')}
                        style={{
                          padding: '8px 15px',
                          background: 'var(--info)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          minHeight: '44px',
                          fontSize: '16px'
                        }}
                      >
                        📋 Copiar CBU
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formData.metodoPago === 'efectivo' && (
                <div style={{
                  background: 'var(--filter-bg)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>💵 Pago en Efectivo</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                      Total a pagar: <span style={{ color: 'var(--success)' }}>${calcularTotal().toLocaleString('es-CL')}</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                      ¿Con cuánto vas a pagar? *
                    </label>
                    <input
                      type="number"
                      name="montoEfectivo"
                      value={formData.montoEfectivo}
                      onChange={handleChange}
                      min={calcularTotal()}
                      placeholder={`Mínimo $${calcularTotal().toLocaleString('es-CL')}`}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errores.montoEfectivo ? 'var(--danger)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    {errores.montoEfectivo && (
                      <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errores.montoEfectivo}</span>
                    )}
                  </div>

                  {formData.montoEfectivo && Number(formData.montoEfectivo) >= calcularTotal() && (
                    <div style={{
                      background: 'var(--success)',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: '0 0 5px 0' }}>Vuelto estimado:</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        ${calcularVuelto().toLocaleString('es-CL')}
                      </p>
                    </div>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                      ¿Necesitás cambio?
                    </label>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="radio"
                          name="necesitaCambio"
                          value="si"
                          checked={formData.necesitaCambio === 'si'}
                          onChange={handleChange}
                        />
                        Sí
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="radio"
                          name="necesitaCambio"
                          value="no"
                          checked={formData.necesitaCambio === 'no'}
                          onChange={handleChange}
                        />
                        No, tengo el monto exacto
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                📝 Notas adicionales (opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="3"
                placeholder="¿Alguna indicación especial?"
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
          </div>
        )}

        {/* PASO 3: Confirmación */}
        {paso === 3 && (
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>✅ Confirmar compra</h3>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Resumen de productos */}
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>🛒 Productos</h4>
                {carrito.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}>
                    <div>
                      <span>{item.nombre}</span>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>
                        x{item.cantidad}
                      </span>
                    </div>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  </div>
                ))}
                
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Subtotal:</span>
                    <span>${totalCarrito.toLocaleString('es-CL')}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '2px solid var(--border-color)',
                    color: 'var(--success)'
                  }}>
                    <span>Total:</span>
                    <span>${calcularTotal().toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>

              {/* Resumen de contacto */}
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>📞 Datos de contacto</h4>
                <p><strong>Nombre:</strong> {formData.nombre}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Teléfono:</strong> {formData.telefono}</p>
                
                {envioHabilitado && (
                  <>
                    <h4 style={{ color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '0.5rem' }}>📍 Envío</h4>
                    <p><strong>Zona:</strong> {ZONAS_ENVIO.find(z => z.codigo === zonaSeleccionada)?.nombre}</p>
                    <p style={{ color: 'var(--info)' }}>
                      📱 Te contactaremos por WhatsApp para coordinar el costo de envío.
                    </p>
                  </>
                )}
              </div>

              {/* Resumen de pago */}
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>💳 Método de pago</h4>
                {formData.metodoPago === 'transferencia' ? (
                  <p>Transferencia bancaria a Mercado Pago</p>
                ) : (
                  <div>
                    <p>Pago en efectivo - Monto: ${Number(formData.montoEfectivo).toLocaleString('es-CL')}</p>
                    <p>{formData.necesitaCambio === 'si' 
                      ? `Necesita cambio de $${calcularVuelto().toLocaleString('es-CL')}`
                      : 'Paga con monto exacto'}</p>
                  </div>
                )}
                {formData.notas && (
                  <div>
                    <p><strong>Notas:</strong> {formData.notas}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div style={{
          display: 'flex',
          justifyContent: paso === 1 ? 'flex-end' : 'space-between',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {paso > 1 && (
            <button
              onClick={() => setPaso(paso - 1)}
              style={{
                padding: '12px 25px',
                background: 'var(--filter-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                minHeight: '44px',
                flex: '1 1 auto'
              }}
            >
              ← Anterior
            </button>
          )}

          {paso < 3 ? (
            <button
              onClick={siguientePaso}
              disabled={paso === 1 && envioHabilitado && !zonaSeleccionada}
              style={{
                padding: '12px 25px',
                background: (paso === 1 && envioHabilitado && !zonaSeleccionada) 
                  ? 'var(--text-secondary)' 
                  : 'var(--info)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (paso === 1 && envioHabilitado && !zonaSeleccionada) 
                  ? 'not-allowed' 
                  : 'pointer',
                fontSize: '1rem',
                minHeight: '44px',
                flex: '1 1 auto'
              }}
            >
              Continuar →
            </button>
          ) : (
            <button
              onClick={procesarCompra}
              disabled={procesando}
              style={{
                padding: '12px 30px',
                background: procesando ? 'var(--text-secondary)' : 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: procesando ? 'wait' : 'pointer',
                fontSize: '1rem',
                minWidth: '150px',
                minHeight: '44px',
                flex: '1 1 auto'
              }}
            >
              {procesando ? 'Procesando...' : '💰 Confirmar compra'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;