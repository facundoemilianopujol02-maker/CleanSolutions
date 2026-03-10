import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';

// Verificar si analytics está disponible
const isAnalyticsAvailable = () => {
  return analytics !== null && process.env.NODE_ENV === 'production';
};

// Función genérica para loguear eventos
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  if (!isAnalyticsAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [Analytics Dev]', eventName, eventParams);
    }
    return;
  }

  try {
    logEvent(analytics, eventName, eventParams);
    console.log('📊 [Analytics] Evento enviado:', eventName);
  } catch (error) {
    console.error('Error al enviar evento a Analytics:', error);
  }
};

// ============================================
// EVENTOS DE E-COMMERCE
// ============================================

// Ver un producto
export const logViewItem = (producto) => {
  logAnalyticsEvent('view_item', {
    currency: 'ARS',
    value: producto.precio,
    items: [{
      item_id: producto.id?.toString() || 'unknown',
      item_name: producto.nombre,
      item_category: producto.categoria,
      price: producto.precio
    }]
  });
};

// Agregar al carrito
export const logAddToCart = (producto, cantidad = 1) => {
  logAnalyticsEvent('add_to_cart', {
    currency: 'ARS',
    value: producto.precio * cantidad,
    items: [{
      item_id: producto.id?.toString() || 'unknown',
      item_name: producto.nombre,
      item_category: producto.categoria,
      price: producto.precio,
      quantity: cantidad
    }]
  });
};

// Iniciar checkout
export const logBeginCheckout = (carrito, total) => {
  logAnalyticsEvent('begin_checkout', {
    currency: 'ARS',
    value: total,
    items: carrito.map(item => ({
      item_id: item.id?.toString() || 'unknown',
      item_name: item.nombre,
      item_category: item.categoria,
      price: item.precio,
      quantity: item.cantidad
    }))
  });
};

// Compra completada
export const logPurchase = (pedido, carrito) => {
  logAnalyticsEvent('purchase', {
    transaction_id: pedido.id?.toString() || Date.now().toString(),
    currency: 'ARS',
    value: pedido.total,
    tax: 0,
    shipping: pedido.costoEnvio || 0,
    items: carrito.map(item => ({
      item_id: item.id?.toString() || 'unknown',
      item_name: item.nombre,
      item_category: item.categoria,
      price: item.precio,
      quantity: item.cantidad
    }))
  });
};

// Login
export const logLogin = (metodo = 'email') => {
  logAnalyticsEvent('login', { method: metodo });
};