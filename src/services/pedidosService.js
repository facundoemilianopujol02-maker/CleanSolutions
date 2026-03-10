// Servicio de pedidos MOCK (usa localStorage)

// Obtener todos los pedidos
export const getPedidos = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  return pedidos;
};

// Agregar un pedido (cuando se finaliza la compra)
export const addPedido = async (pedido) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const nuevoPedido = {
    ...pedido,
    id: Date.now(),
    fecha: new Date().toISOString(),
    estado: 'pendiente'
  };
  pedidos.push(nuevoPedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  return nuevoPedido;
};

// Actualizar estado de un pedido
export const updatePedidoEstado = async (id, nuevoEstado) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const index = pedidos.findIndex(p => p.id == id);
  
  if (index !== -1) {
    pedidos[index].estado = nuevoEstado;
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    return pedidos[index];
  }
  throw new Error('Pedido no encontrado');
};

// Eliminar un pedido
export const deletePedido = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const nuevosPedidos = pedidos.filter(p => p.id != id);
  localStorage.setItem('pedidos', JSON.stringify(nuevosPedidos));
  return id;
};

// Obtener pedidos de un usuario específico
export const getPedidosByUser = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  return pedidos.filter(p => p.email === email);
};