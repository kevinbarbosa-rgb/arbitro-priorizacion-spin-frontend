import React from 'react';

const estadoColors = {
  sustentado: { color: '#5601D9', bg: '#EEE3FF', label: 'sustentado' },
  débil: { color: '#C24A00', bg: '#FFF0E5', label: 'débil' },
  ausente: { color: '#2D2F3A', bg: '#D9DBFD', label: 'ausente' },
};

export default function Criterio({ criterio, onVoto, onVerEjemplo }) {
  const config = estadoColors[criterio.estado];
  const pct = { sustentado: 100, débil: 55, ausente: 12 }[criterio.estado];

  return (
    <div style={{ borderTop: '1px solid #eee', padding: '15px 0', marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <strong style={{ fontSize: '15px', color: '#210B50' }}>{criterio.nombre}</strong>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 600,
            padding: '3px 11px',
            borderRadius: '99px',
            color: config.color,
            background: config.bg,
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          height: '6px',
          borderRadius: '99px',
          background: '#eee',
          marginBottom: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: config.color,
            borderRadius: '99px',
            transition: 'width 0.7s ease',
          }}
        />
      </div>

      {/* Cita */}
      {criterio.cita && (
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '13.5px',
            borderLeft: '3px solid #C7A1FF',
            paddingLeft: '12px',
            marginBottom: '10px',
            color: '#3A3B47',
            fontStyle: 'italic',
          }}
        >
          "{criterio.cita}"
        </div>
      )}

      {/* Nota */}
      <div style={{ fontSize: '13.5px', color: '#6B6C7A', marginBottom: '10px' }}>
        {criterio.nota}
      </div>

      {/* Votación */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '11px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onVoto(criterio.id, 'ok')}
          style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: '99px',
            padding: '7px 15px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#6B6C7A',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => {
            e.target.style.borderColor = '#C7A1FF';
            e.target.style.color = '#5601D9';
          }}
          onMouseOut={e => {
            e.target.style.borderColor = '#eee';
            e.target.style.color = '#6B6C7A';
          }}
        >
          De acuerdo
        </button>
        <button
          onClick={() => onVoto(criterio.id, 'no')}
          style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: '99px',
            padding: '7px 15px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#6B6C7A',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => {
            e.target.style.borderColor = '#C7A1FF';
            e.target.style.color = '#5601D9';
          }}
          onMouseOut={e => {
            e.target.style.borderColor = '#eee';
            e.target.style.color = '#6B6C7A';
          }}
        >
          No estoy de acuerdo
        </button>
        {criterio.estado !== 'sustentado' && (
          <button
            onClick={() => onVerEjemplo(criterio.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#5601D9',
              padding: 0,
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ¿Cómo se ve bien?
          </button>
        )}
      </div>
    </div>
  );
}
