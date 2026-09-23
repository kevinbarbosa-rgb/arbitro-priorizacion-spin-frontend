import React, { useState } from 'react';
import { nivelDe } from '../evaluador';
import Semaforo from '../components/Semaforo';
import { updateExpediente } from '../api';

export default function ReportPage({ expediente, onBack }) {
  const [ciclo, setCiclo] = useState(expediente.ciclo || 'Borrador');
  const [saving, setSaving] = useState(false);

  const nivel = nivelDe(expediente.puntaje);

  const handleChangeCiclo = async (newCiclo) => {
    setCiclo(newCiclo);
    setSaving(true);
    try {
      await updateExpediente(expediente.id, { ciclo: newCiclo });
    } catch (err) {
      console.error('Error guardando ciclo:', err);
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '30px 26px 80px' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#6B6C7A',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px 0',
          marginBottom: '24px',
        }}
      >
        ← Ver de nuevo la lectura y los criterios
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '22px' }}>
        <div>
          {/* Calificación */}
          <div
            style={{
              background: 'linear-gradient(120deg, ' + nivel.c + '12, ' + nivel.c + '06)',
              borderRadius: '20px',
              padding: '22px',
              display: 'flex',
              gap: '18px',
              alignItems: 'center',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: `3px solid ${nivel.c}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                flex: '0 0 64px',
              }}
            >
              <b style={{ fontSize: '22px', lineHeight: 1, color: nivel.c }}>
                {expediente.puntaje}
              </b>
              <span style={{ fontSize: '9.5px', color: '#999', marginTop: '1px' }}>
                de 100
              </span>
            </div>
            <div>
              <b style={{ display: 'block', fontSize: '18px', color: nivel.c }}>
                {nivel.t}
              </b>
              <span style={{ fontSize: '13.5px', color: '#4A4B58', marginTop: '4px', display: 'block' }}>
                {nivel.d}
              </span>
            </div>
          </div>

          {/* Prioridad RICE */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #E9E4F5',
              borderRadius: '20px',
              padding: '22px 24px',
              marginBottom: '22px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div>
                <b style={{ display: 'block', fontSize: '15px', color: '#210B50' }}>
                  Prioridad estimada
                </b>
                <span style={{ fontSize: '13px', color: '#6B6C7A', marginTop: '4px', display: 'block' }}>
                  Método RICE, de Intercom. Los números los pones tú; yo solo pongo la confianza.
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6B6C7A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Alcance
                <input type="number" min="0" max="100" placeholder="% de usuarios" style={{ border: '1px solid #E9E4F5', borderRadius: '10px', padding: '8px 11px', fontSize: '13.5px' }} />
                <em style={{ fontSize: '10.5px', color: '#999', fontStyle: 'normal' }}>no lo encontré en el documento</em>
              </label>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6B6C7A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Impacto
                <select style={{ border: '1px solid #E9E4F5', borderRadius: '10px', padding: '8px 11px', fontSize: '13.5px' }}>
                  <option>Elige</option>
                  <option>Masivo (3)</option>
                  <option>Alto (2)</option>
                  <option>Medio (1)</option>
                  <option>Bajo (0.5)</option>
                  <option>Mínimo (0.25)</option>
                </select>
                <em style={{ fontSize: '10.5px', color: '#999', fontStyle: 'normal' }}>cuánto mueve la métrica</em>
              </label>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6B6C7A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Confianza
                <div style={{ border: '1px dashed #C7A1FF', borderRadius: '10px', padding: '8px 11px', fontSize: '13.5px', fontWeight: 700, background: '#EEE3FF', color: '#5601D9' }}>
                  {expediente.criterios.find(c => c.id === 'c2')?.estado === 'sustentado' ? '80%' : expediente.criterios.find(c => c.id === 'c2')?.estado === 'débil' ? '50%' : '20%'}
                </div>
                <em style={{ fontSize: '10.5px', color: '#999', fontStyle: 'normal' }}>hay análisis con cifra detrás</em>
              </label>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6B6C7A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Esfuerzo
                <select style={{ border: '1px solid #E9E4F5', borderRadius: '10px', padding: '8px 11px', fontSize: '13.5px' }}>
                  <option>Muy bajo (1)</option>
                  <option>Bajo (2)</option>
                  <option>Medio (3)</option>
                  <option>Alto (4)</option>
                  <option>Muy alto (5)</option>
                </select>
                <em style={{ fontSize: '10.5px', color: '#999', fontStyle: 'normal' }}>sugerido por fases y áreas</em>
              </label>
            </div>
          </div>

          {/* Ciclo */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #E9E4F5',
              borderRadius: '20px',
              padding: '22px',
            }}
          >
            <b style={{ display: 'block', fontSize: '15px', color: '#210B50', marginBottom: '12px' }}>
              Estado en el proceso
            </b>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Borrador', 'En la mesa', 'Priorizada', 'Descartada'].map(estado => (
                <button
                  key={estado}
                  onClick={() => handleChangeCiclo(estado)}
                  disabled={saving}
                  style={{
                    background: ciclo === estado ? '#EEE3FF' : '#f5f5f5',
                    border: '1px solid ' + (ciclo === estado ? '#C7A1FF' : '#E9E4F5'),
                    borderRadius: '99px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: ciclo === estado ? '#5601D9' : '#6B6C7A',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => (e.target.style.borderColor = '#C7A1FF', e.target.style.background = '#F9F6FF')}
                  onMouseOut={e => (e.target.style.borderColor = ciclo === estado ? '#C7A1FF' : '#E9E4F5', e.target.style.background = ciclo === estado ? '#EEE3FF' : '#f5f5f5')}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel lateral: Documento */}
        <div
          style={{
            position: 'sticky',
            top: '100px',
            maxHeight: '78vh',
            overflow: 'auto',
            background: '#fff',
            border: '1px solid #E9E4F5',
            borderRadius: '20px',
            padding: '22px 24px',
            fontSize: '13.5px',
            lineHeight: '1.7',
            color: '#3A3B47',
          }}
        >
          <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: '#6B6C7A', textTransform: 'uppercase' }}>
            Resumen de la evaluación
          </h4>

          <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.8 }}>
            <p>
              <strong>Iniciativa:</strong> {expediente.iniciativa}
            </p>
            <p>
              <strong>Squad:</strong> {expediente.squad}
            </p>
            <p>
              <strong>Calificación:</strong> {expediente.puntaje}/100 ({nivel.t.toLowerCase()})
            </p>
            <p>
              <strong>Semáforo:</strong> {expediente.semaforo === 'verde' ? '🟢' : expediente.semaforo === 'amarillo' ? '🟡' : '🔴'} {expediente.semaforo.charAt(0).toUpperCase() + expediente.semaforo.slice(1)}
            </p>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Criterios</strong>
              {expediente.criterios.map(c => (
                <div key={c.id} style={{ fontSize: '11px', margin: '4px 0', color: '#666' }}>
                  <span style={{ color: c.estado === 'sustentado' ? '#1E7A4B' : c.estado === 'débil' ? '#C24A00' : '#999' }}>
                    ●
                  </span>
                  {' '}
                  {c.nombre}: <strong>{c.estado}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {saving && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#5601D9', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '12px' }}>
          Guardando...
        </div>
      )}
    </div>
  );
}
