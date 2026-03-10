import { useNavigate } from 'react-router-dom';

function Privacidad() {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'var(--bg-card)',
      borderRadius: '15px',
      border: '1px solid var(--border-color)'
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--info)',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ← Volver
      </button>

      <h1 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>
        🔐 Política de Privacidad
      </h1>

      <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}</p>

        <h2>1. Información que recopilamos</h2>
        <p>En CleanSolutions, recopilamos los siguientes tipos de información: </p>
        <ul>
          <li><strong>Información de cuenta:</strong> nombre, email, teléfono (cuando se registra)</li>
          <li><strong>Información de compras:</strong> dirección, historial de pedidos, preferencias</li>
          <li><strong>Información de navegación:</strong> páginas visitadas, tiempo de sesión, productos vistos (a través de cookies)</li>
          <li><strong>Información de contacto:</strong> mensajes enviados a través del formulario</li>
        </ul>

        <h2>2. Cómo utilizamos su información</h2>
        <p>Utilizamos la información recopilada para: </p>
        <ul>
          <li>Procesar y gestionar sus pedidos</li>
          <li>Comunicarnos con usted sobre su compra</li>
          <li>Mejorar nuestros productos y servicios</li>
          <li>Enviar promociones y ofertas (solo si usted lo autoriza)</li>
          <li>Cumplir con obligaciones legales</li>
        </ul>

        <h2>3. Cookies y tecnologías similares</h2>
        <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo. Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.</p>

        <h2>4. Compartir información con terceros</h2>
        <p>No vendemos su información personal a terceros. Podemos compartir información limitada con: </p>
        <ul>
          <li><strong>Procesadores de pago:</strong> Mercado Pago (para procesar pagos)</li>
          <li><strong>Servicios de envío:</strong> para entregar sus pedidos</li>
          <li><strong>Autoridades judiciales:</strong> cuando sea requerido por ley</li>
        </ul>

        <h2>5. Seguridad de los datos</h2>
        <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún método de transmisión por Internet es 100% seguro.</p>

        <h2>6. Sus derechos</h2>
        <p>De acuerdo con la Ley de Protección de Datos Personales N° 25.326, usted tiene derecho a: </p>
        <ul>
          <li><strong>Acceso:</strong> conocer qué información tenemos sobre usted</li>
          <li><strong>Rectificación:</strong> corregir información inexacta</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de sus datos (cuando corresponda)</li>
          <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos para ciertos fines</li>
        </ul>
        <p>Para ejercer estos derechos, contáctenos a info@cleansolutions.com.</p>

        <h2>7. Conservación de datos</h2>
        <p>Conservamos su información mientras sea necesaria para los fines descritos en esta política, a menos que la ley requiera un período de conservación más largo.</p>

        <h2>8. Menores de edad</h2>
        <p>Nuestros servicios no están dirigidos a menores de 18 años. Si descubrimos que hemos recopilado información de un menor sin consentimiento parental, eliminaremos dicha información.</p>

        <h2>9. Cambios en la política de privacidad</h2>
        <p>Podemos actualizar esta política periódicamente. Le notificaremos cualquier cambio publicando la nueva versión en esta página. Le recomendamos revisar esta política regularmente.</p>

        <h2>10. Contacto</h2>
        <p>Si tiene preguntas sobre esta Política de Privacidad, puede contactarnos en:</p>
        <p>
          📧 info@cleansolutions.com<br />
          📱 WhatsApp: +54 3794 034489<br />
          📍 Corrientes, Argentina
        </p>
      </div>
    </div>
  );
}

export default Privacidad;