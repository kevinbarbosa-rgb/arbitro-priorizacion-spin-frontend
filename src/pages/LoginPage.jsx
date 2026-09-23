import React, { useState } from 'react';
import { login } from '../api';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [squad, setSquad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, nombre, squad);
      authLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #F3ECFF 0%, #EEE3FF 45%, #FFF0E5 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 30px rgba(33, 11, 80, 0.07)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1 style={{ margin: '0 0 10px', fontSize: '28px', color: '#210B50' }}>
          Árbitro de priorización
        </h1>
        <p style={{ margin: '0 0 30px', fontSize: '14px', color: '#6B6C7A' }}>
          Spin · Evalúa tu iniciativa antes de llevarla a la mesa
        </p>

        {error && (
          <div
            style={{
              background: '#FFF0E5',
              color: '#C24A00',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6C7A', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                border: '1px solid #E9E4F5',
                borderRadius: '99px',
                padding: '11px 16px',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6C7A', marginBottom: '6px' }}>
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
              style={{
                width: '100%',
                border: '1px solid #E9E4F5',
                borderRadius: '99px',
                padding: '11px 16px',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6C7A', marginBottom: '6px' }}>
              Squad
            </label>
            <input
              type="text"
              value={squad}
              onChange={e => setSquad(e.target.value)}
              placeholder="Card Experience"
              required
              style={{
                width: '100%',
                border: '1px solid #E9E4F5',
                borderRadius: '99px',
                padding: '11px 16px',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#5601D9',
              color: '#fff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '99px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.15s',
              boxShadow: '0 2px 10px rgba(86, 1, 217, 0.22)',
            }}
            onMouseOver={e => !loading && (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 18px rgba(86, 1, 217, 0.28)')}
            onMouseOut={e => (e.target.style.transform = 'none', e.target.style.boxShadow = '0 2px 10px rgba(86, 1, 217, 0.22)')}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#9B9CA9', textAlign: 'center' }}>
          Para el piloto, puedes usar cualquier email y squad
        </div>
      </div>
    </div>
  );
}
