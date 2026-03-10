import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getPedidos } from '../services/pedidosService';

function Estadisticas({ productos }) {
  const [pedidos, setPedidos] = useState([]);
  const [periodo, setPeriodo] = useState('semana'); // 'semana', 'mes', 'año'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedidos = async () => {
      setLoading(true);
      const pedidosData = await getPedidos();
      setPedidos(pedidosData);
      setLoading(false);
    };
    cargarPedidos();
  }, []);

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
        <p style={{ color: 'var(--text-secondary)' }}>Cargando estadísticas...</p>
      </div>
    );
  }

  // Calcular ventas totales
  const ventasTotales = pedidos.reduce((acc, p) => acc + p.total, 0);
  const cantidadPedidos = pedidos.length;
  const productosVendidos = pedidos.reduce((acc, p) => 
    acc + p.productos.reduce((sum, prod) => sum + prod.cantidad, 0), 0
  );

  // Ventas por estado
  const ventasPorEstado = [
    { name: 'Pendientes', value: pedidos.filter(p => p.estado === 'pendiente').length },
    { name: 'Pagados', value: pedidos.filter(p => p.estado === 'pagado').length },
    { name: 'Enviados', value: pedidos.filter(p => p.estado === 'enviado').length },
    { name: 'Entregados', value: pedidos.filter(p => p.estado === 'entregado').length }
  ].filter(item => item.value > 0);

  // Productos más vendidos
  const ventasPorProducto = {};
  pedidos.forEach(pedido => {
    pedido.productos.forEach(prod => {
      if (ventasPorProducto[prod.nombre]) {
        ventasPorProducto[prod.nombre] += prod.cantidad;
      } else {
        ventasPorProducto[prod.nombre] = prod.cantidad;
      }
    });
  });

  const productosMasVendidos = Object.entries(ventasPorProducto)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Ventas por día (últimos 7 días)
  const ventasPorDia = [];
  const hoy = new Date();
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    const fechaStr = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
    
    const ventasDia = pedidos.filter(p => {
      const fechaPedido = new Date(p.fecha);
      return fechaPedido.toDateString() === fecha.toDateString();
    }).reduce((acc, p) => acc + p.total, 0);

    ventasPorDia.push({
      dia: fechaStr,
      ventas: ventasDia
    });
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        📊 Estadísticas Generales
      </h3>

      {/* Tarjetas de resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Ventas Totales</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: 'var(--success)' }}>
            ${ventasTotales.toLocaleString('es-CL')}
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Total Pedidos</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: 'var(--info)' }}>
            {cantidadPedidos}
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛍️</div>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Productos Vendidos</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: 'var(--warning)' }}>
            {productosVendidos}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '2rem'
      }}>
        {/* Gráfico de ventas por día */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Ventas Últimos 7 Días
          </h4>
          <LineChart width={350} height={250} data={ventasPorDia}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="dia" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }} 
            />
            <Line type="monotone" dataKey="ventas" stroke="var(--info)" strokeWidth={2} />
          </LineChart>
        </div>

        {/* Gráfico de productos más vendidos */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Productos Más Vendidos
          </h4>
          <BarChart width={350} height={250} data={productosMasVendidos}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }} 
            />
            <Bar dataKey="value" fill="var(--success)" />
          </BarChart>
        </div>

        {/* Gráfico de estados */}
        {ventasPorEstado.length > 0 && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Estados de Pedidos
            </h4>
            <PieChart width={350} height={250}>
              <Pie
                data={ventasPorEstado}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ventasPorEstado.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }} 
              />
            </PieChart>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Estadisticas;