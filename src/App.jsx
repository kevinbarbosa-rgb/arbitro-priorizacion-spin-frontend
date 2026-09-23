import React, { useState, useEffect } from 'react';

export default function App() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Check backend connection
    const checkBackend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/../`);
        if (res.ok) {
          setStatus('connected');
        }
      } catch (err) {
        setStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Árbitro de priorización — Spin</h1>
      <p>Status: {status}</p>
      <p>Frontend is loading. Backend structure is being set up.</p>
    </div>
  );
}
