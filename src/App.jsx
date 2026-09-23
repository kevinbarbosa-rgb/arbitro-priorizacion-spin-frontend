import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EvaluationPage from './pages/EvaluationPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [currentExpediente, setCurrentExpediente] = useState(null);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#999' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F4FB' }}>
      {/* Header */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E9E4F5',
          padding: '12px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#210B50' }}>
            Árbitro
          </h1>
          <span style={{ fontSize: '11px', color: '#FC630E', background: '#FFF0E5', padding: '4px 11px', borderRadius: '99px', fontWeight: 600, border: '1px solid #FFD9BF' }}>
            MVP
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#6B6C7A' }}>
            {user.nombre} · {user.squad}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              window.location.reload();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B6C7A',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      {currentPage === 'home' && <HomePage onEvaluated={exp => { setCurrentExpediente(exp); setCurrentPage('evaluation'); }} />}
      {currentPage === 'evaluation' && currentExpediente && (
        <EvaluationPage expediente={currentExpediente} onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
