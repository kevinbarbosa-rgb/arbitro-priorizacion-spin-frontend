import React, { useState } from 'react';
import { updateExpediente } from '../api';

const BANCO_PREGUNTAS = {
  c1: [
    '¿A qué objetivo de negocio le pega esto y cómo se vería en los números de Spin?',
    '¿A cuántos MAUs les pasa esto hoy? Necesito el porcentaje o el volumen, no "muchos usuarios".',
  ],
  c2: [
    '¿Qué análisis, dashboard o piloto respalda que esto pasa? Dime la cifra y de cuándo es.',
    '¿Esto sale de datos, de un mandato o de una intuición del equipo? ¿Qué te hace estar seguro?',
  ],
  c3: [
    '¿Cuál es el KPI primario, con qué target y en cuánto tiempo?',
    '¿Cuánto vale hoy ese número y dónde se va a medir? Sin línea base no vas a poder demostrar que mejoró.',
  ],
  c4: [
    '¿Cómo sale esto: en fases, con piloto, por región? ¿Y qué entra en la primera?',
    'Si la primera fase no da los números, ¿qué haces? ¿Sigues, ajustas o lo apagas?',
  ],
  c5: [
    '¿Qué necesitas de Data, Legal, Riesgos, del core o de OXXO para que esto salga?',
    '¿Qué evento hay que capturar para poder medir esto, y ya existe o hay que crearlo?',
  ],
  c6: [
    '¿Qué hace hoy la competencia con esto? ¿Esto nos diferencia o nos empareja?',
    '¿Ya existe algo en Spin que resuelva parte de esto? ¿Qué pasó con ello?',
  ],
};

export default function QuestionsPage({ expediente, onBack, onNext }) {
  const [respuestas, setRespuestas] = useState(expediente.respuestas || {});
  const [saving, setSaving] = useState(false);

  // Generar preguntas basadas en criterios débiles
  const preguntasNeeded = expediente.criterios
    .filter(c => c.estado !== 'sustentado')
    .sort((a, b) => {
      const orden = { ausente: 0, débil: 1, sustentado: 2 };
      return orden[a.estado] - orden[b.estado];
    })
    .slice(0, 4);

  const preguntas = preguntasNeeded.map((criterio, idx) => {
    const textos = BANCO_PREGUNTAS[criterio.id] || ['¿Algo que añadir?'];
    return {
      id: `p${idx}`,
      criterio: criterio.id,
      nombre: criterio.nombre,
      texto: textos[Math.floor(Math.random() * textos.length)],
    };
  });

  const handleRespuesta = (preguntaId, valor) => {
    setRespuestas({ ...respuestas, [preguntaId]: valor });
  };

  const handleGuardar = async () => {
    setSaving(true);
    try {
      await updateExpediente(expediente.id, { respuestas });
      onNext();
    } catch (err) {
      console.error('Error guardando respuestas:', err);
    }
    setSaving(false);
  };

  const completadas = Object.values(respuestas).filter(r => r && r.trim().length > 0).length;

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '30px 26px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#6B6C7A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ← Volver a la lectura
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '22px' }}>
        <div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #E9E4F5',
              borderRadius: '20px',
              padding: '22px',
              marginBottom: '22px',
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: '16.5px', color: '#210B50' }}>
              Por qué estas preguntas y no otras
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#6B6C7A' }}>
              Salen de los vacíos que encontré en tu iniciativa. Primero pregunto por lo que no está escrito, después por lo que está a medias.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {expediente.criterios.filter(c => c.estado === 'ausente').length > 0 && (
                <span style={{ fontSize: '12.5px', fontWeight: 600, padding: '5px 12px', borderRadius: '99px', background: '#FBE9E7', color: '#B3261E' }}>
                  Falta: {expediente.criterios.filter(c => c.estado === 'ausente').map(c => c.nombre.toLowerCase()).join(', ')}
                </span>
              )}
              {expediente.criterios.filter(c => c.estado === 'débil').length > 0 && (
                <span style={{ fontSize: '12.5px', fontWeight: 600, padding: '5px 12px', borderRadius: '99px', background: '#FFF0E5', color: '#C24A00' }}>
                  A medias: {expediente.criterios.filter(c => c.estado === 'débil').map(c => c.nombre.toLowerCase()).join(', ')}
                </span>
              )}
            </div>
          </div>

          {preguntas.map((preg, idx) => (
            <div
              key={preg.id}
              style={{
                background: '#fff',
                border: '1px solid #E9E4F5',
                borderRadius: '20px',
                padding: '22px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#6B6C7A' }}>
                  Pregunta {idx + 1} de {preguntas.length}
                </span>
                <span style={{ fontSize: '11px', color: '#999' }}>
                  sobre {preg.nombre.toLowerCase()}
                </span>
              </div>

              <div
                style={{
                  height: '7px',
                  background: '#E9E4F5',
                  borderRadius: '99px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(completadas / preguntas.length) * 100}%`,
                    background: 'linear-gradient(90deg, #5601D9, #FC630E)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              <h3 style={{ margin: '0 0 14px', fontSize: '21px', lineHeight: 1.3, color: '#210B50' }}>
                {preg.texto}
              </h3>

              <textarea
                value={respuestas[preg.id] || ''}
                onChange={e => handleRespuesta(preg.id, e.target.value)}
                placeholder="Tu respuesta. Mientras más concreta, más se mueve."
                rows={5}
                style={{
                  width: '100%',
                  border: '1px solid #E9E4F5',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '14.5px',
                  lineHeight: '1.6',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  marginTop: '14px',
                }}
              />

              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                Retira el riesgo de: <strong>valor</strong>
              </div>
            </div>
          ))}

          <button
            onClick={handleGuardar}
            disabled={saving || completadas === 0}
            style={{
              width: '100%',
              background: completadas === preguntas.length ? 'linear-gradient(120deg, #5601D9, #7B2BEA 62%, #FC630E)' : '#E9E4F5',
              color: completadas === preguntas.length ? '#fff' : '#999',
              border: 'none',
              borderRadius: '20px',
              padding: '24px 28px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: completadas === preguntas.length ? 'pointer' : 'not-allowed',
              marginTop: '22px',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => completadas === preguntas.length && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 14px 34px rgba(86, 1, 217, 0.32)')}
            onMouseOut={e => (e.target.style.transform = 'none', e.target.style.boxShadow = '0 8px 26px rgba(86, 1, 217, 0.26)')}
          >
            {saving ? 'Guardando...' : `Entregar (${completadas}/${preguntas.length})`}
          </button>
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
            Documento original
          </h4>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', fontSize: '12px', color: '#555' }}>
            {expediente.prd}
          </pre>
        </div>
      </div>
    </div>
  );
}
