import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-mi-tienda-login.cloudfunctions.net'
  : 'http://localhost:5001/mi-tienda-login/us-central1';

initMercadoPago(process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY, {
  locale: 'es-AR'
});

function MercadoPagoCheckout({ amount, description, onSuccess, onError, userEmail }) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createPreference = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('💰 Creando preferencia...');
      const response = await axios.post(`${API_URL}/createPreference`, {
        items: [{
          title: description,
          quantity: 1,
          price: amount
        }],
        payerEmail: userEmail || 'cliente@email.com',
        externalReference: `pedido_${Date.now()}`
      });

      console.log('✅ Preferencia creada:', response.data);
      setPreferenceId(response.data.id);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error al conectar con Mercado Pago');
      setLoading(false);
      if (onError) onError(err);
    }
  };

  return (
    <div style={{ padding: '20px', background: 'var(--filter-bg)', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '20px' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.3/mercadopago/logo__small.png" alt="Mercado Pago" style={{ height: '24px' }} />
        Pagar con Mercado Pago
      </h3>

      {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}

      {!preferenceId ? (
        <button onClick={createPreference} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? 'var(--text-secondary)' : '#009EE3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Procesando...' : 'Continuar con Mercado Pago'}
        </button>
      ) : (
        <div style={{ minHeight: '400px', padding: '20px 0' }}>
          <Wallet 
            initialization={{ preferenceId }}
            onReady={() => console.log('✅ Wallet listo')}
            onError={(err) => console.error('❌ Error en Wallet:', err)}
            onSuccess={(data) => {
              console.log('🎉 Pago exitoso:', data);
              if (onSuccess) onSuccess(data);
            }}
          />
        </div>
      )}

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '15px', textAlign: 'center' }}>
        🔒 Pagos 100% seguros procesados por Mercado Pago
      </p>
    </div>
  );
}

export default MercadoPagoCheckout;