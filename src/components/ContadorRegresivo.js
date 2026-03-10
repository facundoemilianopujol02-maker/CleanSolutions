import { useState, useEffect } from 'react';

function ContadorRegresivo({ fechaObjetivo: fechaObjetivoProp, editable = false, onFechaChange }) {
  // Si es editable, usar estado local para la fecha, si no, usar la prop
  const [fechaObjetivo, setFechaObjetivo] = useState(
    fechaObjetivoProp || new Date().getTime() + 3 * 24 * 60 * 60 * 1000
  );
  
  const [editando, setEditando] = useState(false);
  const [fechaInput, setFechaInput] = useState('');
  const [horaInput, setHoraInput] = useState('');

  const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  useEffect(() => {
    // Actualizar si cambia la prop
    if (fechaObjetivoProp) {
      setFechaObjetivo(fechaObjetivoProp);
    }
  }, [fechaObjetivoProp]);

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const ahora = new Date().getTime();
      const distancia = fechaObjetivo - ahora;

      if (distancia < 0) {
        setTiempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }

      const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

      setTiempoRestante({ dias, horas, minutos, segundos });
    };

    calcularTiempoRestante();
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(intervalo);
  }, [fechaObjetivo]);

  const handleEditarClick = () => {
    const fecha = new Date(fechaObjetivo);
    setFechaInput(fecha.toISOString().split('T')[0]); // YYYY-MM-DD
    setHoraInput(fecha.toTimeString().split(' ')[0].substring(0, 5)); // HH:MM
    setEditando(true);
  };

  const handleGuardarClick = () => {
    if (fechaInput && horaInput) {
      const [year, month, day] = fechaInput.split('-').map(Number);
      const [hours, minutes] = horaInput.split(':').map(Number);
      
      const nuevaFecha = new Date(year, month - 1, day, hours, minutes, 0).getTime();
      
      if (nuevaFecha > Date.now()) {
        setFechaObjetivo(nuevaFecha);
        if (onFechaChange) onFechaChange(nuevaFecha);
        setEditando(false);
      } else {
        alert('La fecha debe ser futura');
      }
    }
  };

  const estiloCaja = {
    background: 'rgba(255,255,255,0.2)',
    padding: '10px 15px',
    borderRadius: '8px',
    minWidth: '80px'
  };

  const estiloNumero = {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 1
  };

  const estiloTexto = {
    display: 'block',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase'
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--danger) 0%, #ff6b6b 100%)',
      padding: '1rem',
      borderRadius: '10px',
      textAlign: 'center',
      marginBottom: '2rem',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1rem'
      }}>
        <h3 style={{ color: 'white', margin: 0 }}>
          ⏰ Ofertas Flash - Terminan en:
        </h3>
        {editable && !editando && (
          <button
            onClick={handleEditarClick}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ✎ Editar fecha
          </button>
        )}
      </div>

      {editando ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.1)',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <input
            type="date"
            value={fechaInput}
            onChange={(e) => setFechaInput(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{
              padding: '8px',
              borderRadius: '5px',
              border: 'none'
            }}
          />
          <input
            type="time"
            value={horaInput}
            onChange={(e) => setHoraInput(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '5px',
              border: 'none'
            }}
          />
          <button
            onClick={handleGuardarClick}
            style={{
              background: 'white',
              color: 'var(--danger)',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 15px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Guardar
          </button>
          <button
            onClick={() => setEditando(false)}
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px',
              padding: '8px 15px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={estiloCaja}>
            <span style={estiloNumero}>{tiempoRestante.dias}</span>
            <span style={estiloTexto}>Días</span>
          </div>
          
          <div style={estiloCaja}>
            <span style={estiloNumero}>{tiempoRestante.horas}</span>
            <span style={estiloTexto}>Horas</span>
          </div>
          
          <div style={estiloCaja}>
            <span style={estiloNumero}>{tiempoRestante.minutos}</span>
            <span style={estiloTexto}>Minutos</span>
          </div>
          
          <div style={estiloCaja}>
            <span style={estiloNumero}>{tiempoRestante.segundos}</span>
            <span style={estiloTexto}>Segundos</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContadorRegresivo;