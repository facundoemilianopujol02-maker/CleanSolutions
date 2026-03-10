import emailjs from '@emailjs/browser';

// Inicializar EmailJS con la Public Key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

// Enviar notificación de contacto
export const sendContactNotification = async (contactData) => {
  try {
    console.log('📧 Enviando email de contacto con parámetros:', contactData);

    const templateParams = {
      nombre: contactData.nombre || 'Anónimo',
      email: contactData.email || 'no especificado',
      asunto: contactData.asunto || 'Consulta general',
      mensaje: contactData.mensaje,
      fecha: new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email de contacto enviado exitosamente:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error al enviar email de contacto:', error);
    return { 
      success: false, 
      error: error.text || error.message || 'Error al enviar el mensaje'
    };
  }
};

// Enviar notificación de pedido al admin
export const sendOrderNotification = async (orderData) => {
  try {
    // Formatear productos para el email
    const productosTexto = orderData.productos.map(p => 
      `• ${p.nombre} x${p.cantidad}: $${(p.precio * p.cantidad).toLocaleString('es-CL')}`
    ).join('\n');

    const templateParams = {
      pedido_id: orderData.id || Date.now(),
      nombre: orderData.usuario,
      email: orderData.email,
      telefono: orderData.telefono,
      direccion: orderData.direccion,
      productos: productosTexto,
      total: `$${orderData.total.toLocaleString('es-CL')}`,
      fecha: new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    console.log('📧 Enviando notificación de pedido:', templateParams);

    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_PEDIDOS,
      templateParams
    );

    console.log('✅ Notificación de pedido enviada:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error al enviar notificación de pedido:', error);
    return { success: false, error };
  }
};

// Enviar confirmación al cliente (opcional)
export const sendCustomerConfirmation = async (customerData) => {
  try {
    const templateParams = {
      to_name: customerData.nombre,
      to_email: customerData.email,
      pedido_id: customerData.pedidoId,
      total: `$${customerData.total.toLocaleString('es-CL')}`,
      fecha: new Date().toLocaleString('es-AR')
    };

    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_CLIENTE || process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar confirmación al cliente:', error);
    return { success: false, error };
  }
};