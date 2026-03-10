import { useNavigate } from 'react-router-dom';

function Terminos() {
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
        📝 Términos y Condiciones
      </h1>

      <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}</p>

        <h2>1. Aceptación de los términos</h2>
        <p>Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al sitio ni utilizar nuestros servicios.</p>

        <h2>2. Uso del sitio web</h2>
        <p>CleanSolutions ofrece productos de limpieza para hogar y comercio. Usted se compromete a utilizar este sitio únicamente para fines legales y de acuerdo con estos términos. Queda prohibido: </p>
        <ul>
          <li>Utilizar el sitio para actividades fraudulentas o ilícitas</li>
          <li>Intentar acceder sin autorización a áreas restringidas del sitio</li>
          <li>Publicar información falsa o engañosa</li>
          <li>Realizar actos que puedan dañar la imagen de CleanSolutions</li>
        </ul>

        <h2>3. Cuentas de usuario</h2>
        <p>Para realizar compras, deberá crear una cuenta proporcionando información precisa y completa. Es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran en su cuenta.</p>

        <h2>4. Productos y precios</h2>
        <p>Nos esforzamos por mostrar los productos con la mayor precisión posible. Sin embargo, no garantizamos que las descripciones, imágenes o precios estén libres de errores. Nos reservamos el derecho de modificar precios sin previo aviso.</p>

        <h2>5. Envíos y entregas</h2>
        <p>Actualmente realizamos envíos a Riachuelo, San Cayetano y Corrientes Capital. Para otras localidades, el retiro es en nuestro local sin costo adicional. Los plazos de entrega son aproximados y pueden variar por circunstancias ajenas a nuestra voluntad.</p>

        <h2>6. Pagos</h2>
        <p>Aceptamos los siguientes métodos de pago: </p>
        <ul>
          <li>Tarjetas de crédito/débito (a través de Mercado Pago)</li>
          <li>Transferencia bancaria</li>
          <li>Efectivo (solo en puntos de encuentro acordados)</li>
        </ul>

        <h2>7. Cambios y devoluciones</h2>
        <p>✅ Los cambios y devoluciones son gratuitos dentro de los 30 días posteriores a la compra, siempre que el producto esté en su estado original. Para gestionar un cambio o devolución, contactanos a través del formulario de contacto o por WhatsApp.</p>

        <h2>8. Botón de arrepentimiento</h2>
        <p>De acuerdo con la legislación argentina, usted tiene derecho a revocar la compra dentro de los 10 días hábiles posteriores a la recepción del producto, sin necesidad de justificar su decisión. Para ejercer este derecho, debe notificarnos por escrito a info@cleansolutions.com.</p>

        <h2>9. Propiedad intelectual</h2>
        <p>Todos los contenidos del sitio (textos, imágenes, logotipos, diseños) son propiedad de CleanSolutions o de sus licenciantes y están protegidos por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa.</p>

        <h2>10. Limitación de responsabilidad</h2>
        <p>CleanSolutions no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar nuestros productos o servicios.</p>

        <h2>11. Modificaciones</h2>
        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio. El uso continuado del sitio después de los cambios constituye su aceptación.</p>

        <h2>12. Ley aplicable y jurisdicción</h2>
        <p>Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia será sometida a los tribunales ordinarios de Corrientes, Capital.</p>

        <h2>13. Contacto</h2>
        <p>Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:</p>
        <p>
          📧 info@cleansolutions.com<br />
          📱 WhatsApp: +54 3794 034489<br />
          📍 Corrientes, Argentina
        </p>
      </div>
    </div>
  );
}

export default Terminos;