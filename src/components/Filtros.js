import React, { useState } from 'react';

function Filtros({ 
  busqueda, 
  setBusqueda, 
  categoriaSeleccionada, 
  setCategoriaSeleccionada,
  orden,
  setOrden,
  categorias,
  totalResultados = 0
}) {
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // NUEVAS búsquedas populares
  const sugerencias = [
    "cloro", "jabon liquido", "detergente", "suavizante"
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Contenedor principal: input + botón */}
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* INPUT DE BÚSQUEDA */}
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: 1,
            padding: '15px 20px',
            border: `2px solid ${busqueda ? 'var(--info)' : 'var(--border-color)'}`,
            borderRadius: '30px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)'
          }}
        />
        
        {/* BOTÓN FILTROS */}
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          style={{
            padding: '15px 25px',
            background: mostrarFiltros ? 'var(--info)' : 'var(--filter-bg)',
            color: mostrarFiltros ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <span>⚡ Filtros</span>
          <span>{mostrarFiltros ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* SUGERENCIAS (NUEVAS) */}
      {!busqueda && (
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '15px'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Búsquedas populares:
          </span>
          {sugerencias.map(sug => (
            <button
              key={sug}
              onClick={() => setBusqueda(sug)}
              style={{
                background: 'var(--filter-bg)',
                border: '1px solid var(--border-color)',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--info)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--filter-bg)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* PANEL DE FILTROS (igual que antes) */}
      {mostrarFiltros && (
        <div style={{
          background: 'var(--filter-bg)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {/* CATEGORÍA */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                📁 Categoría
              </label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* ORDEN */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                🔄 Ordenar
              </label>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="default">Por defecto</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre-asc">A - Z</option>
                <option value="nombre-desc">Z - A</option>
              </select>
            </div>
          </div>

          {/* BOTÓN LIMPIAR */}
          <div style={{ marginTop: '15px', textAlign: 'right' }}>
            <button
              onClick={() => {
                setCategoriaSeleccionada('');
                setOrden('default');
              }}
              style={{
                padding: '8px 16px',
                background: 'var(--filter-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE FILTROS ACTIVOS (igual que antes) */}
      {(busqueda || categoriaSeleccionada) && (
        <div style={{
          marginTop: '15px',
          padding: '10px 15px',
          background: 'var(--filter-bg)',
          borderRadius: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {busqueda && (
              <span style={{
                background: 'var(--info)',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                "{busqueda}"
              </span>
            )}
            {categoriaSeleccionada && (
              <span style={{
                background: 'var(--warning)',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                {categoriaSeleccionada}
              </span>
            )}
          </div>
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {totalResultados} resultados
          </span>
        </div>
      )}
    </div>
  );
}

export default Filtros;