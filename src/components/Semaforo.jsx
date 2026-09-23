import React from 'react';

const SemaforoConfig = {
  verde: {
    t: 'Sustentada',
    c: '#1E7A4B',
    bg: '#E6F4EC',
    d: 'Está lista para que la mesa la discuta.',
  },
  amarillo: {
    t: 'Falta información',
    c: '#B07A00',
    bg: '#FDF4DD',
    d: 'Se puede llevar a la mesa sabiendo qué falta.',
  },
  rojo: {
    t: 'No evaluable',
    c: '#B3261E',
    bg: '#FBE9E7',
    d: 'Hay algo que resolver antes de llevarla.',
  },
};

export default function Semaforo({ estado, lectura, grande }) {
  const config = SemaforoConfig[estado] || SemaforoConfig.amarillo;

  return (
    <div
      style={{
        background: config.bg,
        borderRadius: '12px',
        padding: '20px 22px',
        display: 'flex',
        gap: '18px',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: config.c,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '24px',
          flexShrink: 0,
        }}
      >
        {estado === 'verde' && '✓'}
        {estado === 'amarillo' && '!'}
        {estado === 'rojo' && '—'}
      </div>
      <div>
        <b style={{ color: config.c, display: 'block', fontSize: grande ? '18px' : '16px' }}>
          {config.t}
        </b>
        <span style={{ fontSize: grande ? '14.5px' : '13px', color: '#4A4B58', marginTop: '4px', display: 'block' }}>
          {lectura || config.d}
        </span>
        {grande && (
          <small style={{ fontSize: '12px', color: '#999', marginTop: '8px', display: 'block' }}>
            Esto mide qué tan sólida está la sustentación, no qué tan prioritaria es la iniciativa.
          </small>
        )}
      </div>
    </div>
  );
}
