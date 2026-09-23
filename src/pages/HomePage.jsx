import React, { useState } from 'react';
import { createExpediente } from '../api';
import { evaluarPRD } from '../evaluador';

export default function HomePage({ onEvaluated }) {
  const [prd, setPrd] = useState('');
  const [iniciativa, setIniciativa] = useState('');
  const [squad, setSquad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEvaluar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!prd.trim()) {
        throw new Error('Por favor, pega o escribe tu iniciativa');
      }

      // Evaluar localmente
      const evaluacion = evaluarPRD(prd);

      // Crear en backend
      const expediente = await createExpediente({
        iniciativa: iniciativa || 'Sin nombre',
        squad: squad || 'Sin squad',
        prd,
        criterios: evaluacion.criterios,
        semaforo: evaluacion.semaforo,
        puntaje: evaluacion.puntaje,
        prioridad: {},
      });

      // Pasar a la siguiente página
      onEvaluated(expediente);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 26px' }}>
      <div
        style={{
          background: 'linear-gradient(120deg, #F3ECFF 0%, #EEE3FF 45%, #FFF0E5 100%)',
          borderRadius: '28px',
          padding: '40px 42px',
          marginBottom: '26px',
        }}
      >
        <h1 style={{ margin: '10px 0 16px', fontSize: '40px', lineHeight: 1.2, color: '#210B50' }}>
          Trae tu idea como esté y te digo qué le falta
        </h1>
        <p style={{ margin: 0, color: '#4A4B58', fontSize: '15.5px', lineHeight: 1.65, maxWidth: '58ch' }}>
          No hace falta que sea un PRD terminado. Escribe tu iniciativa como la contarías en voz alta, aunque esté a medias, y te digo qué tiene, qué le falta y qué preguntas responder para completarla.
        </p>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #E9E4F5',
          borderRadius: '20px',
          padding: '22px',
        }}
      >
        {error && (
          <div
            style={{
              background: '#FFF0E5',
              color: '#C24A00',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13.5px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleEvaluar}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6C7A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              Iniciativa
              <input
                type="text"
                value={iniciativa}
                onChange={e => setIniciativa(e.target.value)}
                placeholder="Alertas de consumo"
                style={{
                  border: '1px solid #E9E4F5',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  fontSize: '13.5px',
                  fontFamily: 'inherit',
                }}
              />
            </label>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6C7A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              Squad
              <input
                type="text"
                value={squad}
                onChange={e => setSquad(e.target.value)}
                placeholder="Card Experience"
                style={{
                  border: '1px solid #E9E4F5',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  fontSize: '13.5px',
                  fontFamily: 'inherit',
                }}
              />
            </label>
          </div>

          <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '8px', color: '#210B50' }}>
            Tu iniciativa
          </label>

          <textarea
            value={prd}
            onChange={e => setPrd(e.target.value)}
            placeholder="Qué problema viste, a quién le pasa, qué se te ocurrió hacer… lo que tengas por ahora"
            rows={8}
            style={{
              width: '100%',
              border: '1px solid #E9E4F5',
              borderRadius: '14px',
              padding: '14px',
              fontSize: '14.5px',
              lineHeight: '1.6',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginBottom: '16px',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#5601D9',
              color: '#fff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '99px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 2px 10px rgba(86, 1, 217, 0.22)',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => !loading && (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 18px rgba(86, 1, 217, 0.28)')}
            onMouseOut={e => (e.target.style.transform = 'none', e.target.style.boxShadow = '0 2px 10px rgba(86, 1, 217, 0.22)')}
          >
            {loading ? 'Evaluando...' : 'Evaluar iniciativa'}
          </button>
        </form>
      </div>
    </div>
  );
}
