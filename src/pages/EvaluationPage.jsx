import React, { useState } from 'react';
import { nivelDe } from '../evaluador';
import Semaforo from '../components/Semaforo';
import Criterio from '../components/Criterio';
import { updateExpediente } from '../api';

export default function EvaluationPage({ expediente, onBack, onNext }) {
  const [currentStep, setCurrentStep] = useState('lectura');
  const [votos, setVotos] = useState(expediente.votos || {});
  const [preguntas, setPreguntas] = useState(expediente.preguntas || []);
  const [saving, setSaving] = useState(false);

  const nivel = nivelDe(expediente.puntaje);

  const handleVoto = async (criterioId, voto) => {
    const newVotos = { ...votos, [criterioId]: voto === 'ok' };
    setVotos(newVotos);

    // Guardar en backend
    setSaving(true);
    try {
      await updateExpediente(expediente.id, { votos: newVotos });
    } catch (err) {
      console.error('Error guardando voto:', err);
    }
    setSaving(false);
  };

  const handleVerEjemplo = (criterioId) => {
    // TODO: Mostrar ejemplo del criterio
    console.log('Ver ejemplo de:', criterioId);
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '30px 26px 80px' }}>
      {/* Breadcrumb/Proceso */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
          ← Nueva evaluación
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            background: '#fff',
            border: '1px solid #E9E4F5',
            borderRadius: '99px',
            padding: '6px',
            flexWrap: 'wrap',
          }}
        >
          {['Lectura', 'Preguntas', 'Informe'].map((step, idx) => {
            const stepKey = idx === 0 ? 'lectura' : idx === 1 ? 'preguntas' : 'informe';
            const isActive = currentStep === stepKey;
            const isDone = idx < ['lectura', 'preguntas', 'informe'].indexOf(currentStep);

            return (
              <React.Fragment key={stepKey}>
                {idx > 0 && <span style={{ width: '26px', height: '2px', background: isActive || isDone ? 'linear-gradient(90deg, #5601D9, #FC630E)' : '#E9E4F5', borderRadius: '2px', flex: '0 0 26px' }} />}
                <button
                  onClick={() => setCurrentStep(stepKey)}
                  disabled={idx > ['lectura', 'preguntas', 'informe'].indexOf(currentStep)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: isActive ? 'linear-gradient(120deg, #EFE6FF, #F6F1FF)' : 'none',
                    border: 'none',
                    borderRadius: '99px',
                    padding: '8px 16px 8px 9px',
                    cursor: idx <= ['lectura', 'preguntas', 'informe'].indexOf(currentStep) ? 'pointer' : 'not-allowed',
                    textAlign: 'left',
                    transition: 'all 0.18s',
                    opacity: idx > ['lectura', 'preguntas', 'informe'].indexOf(currentStep) ? 0.45 : 1,
                  }}
                >
                  <i
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isDone ? '#E6F4EC' : isActive ? 'linear-gradient(135deg, #5601D9, #FC630E)' : '#f0f0f0',
                      color: isDone ? '#1E7A4B' : isActive ? '#fff' : '#999',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      fontStyle: 'normal',
                      flex: '0 0 26px',
                    }}
                  >
                    {isDone ? '✓' : idx + 1}
                  </i>
                  <div>
                    <b style={{ display: 'block', fontSize: '13.5px', color: isActive ? '#5601D9' : '#6B6C7A', letterSpacing: '-0.01em' }}>
                      {step}
                    </b>
                    <span style={{ display: 'block', fontSize: '11px', color: '#999', marginTop: '1px' }}>
                      {step === 'Lectura' && 'Qué tienes y qué falta'}
                      {step === 'Preguntas' && 'Lo que falta por definir'}
                      {step === 'Informe' && 'Calificación y prioridad'}
                    </span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Contenido por paso */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '22px', alignItems: 'start' }}>
        <div>
          {currentStep === 'lectura' && (
            <>
              {/* Semáforo */}
              <Semaforo estado={expediente.semaforo} lectura="Evaluación completada" grande={true} />

              {/* Criterios */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #E9E4F5',
                  borderRadius: '20px',
                  padding: '22px',
                  marginTop: '22px',
                  marginBottom: '22px',
                }}
              >
                <h3 style={{ margin: '0 0 16px', fontSize: '16.5px', color: '#210B50' }}>
                  Cómo quedó cada criterio
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#6B6C7A' }}>
                  Cada juicio va con la frase tuya en la que me apoyé.
                </p>

                <div>
                  {expediente.criterios.map(c => (
                    <Criterio
                      key={c.id}
                      criterio={c}
                      onVoto={handleVoto}
                      onVerEjemplo={handleVerEjemplo}
                    />
                  ))}
                </div>
              </div>

              {/* Botón siguiente */}
              <button
                onClick={onNext}
                style={{
                  width: '100%',
                  background: 'linear-gradient(120deg, #5601D9, #7B2BEA 62%, #FC630E)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 26px rgba(86, 1, 217, 0.26)',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 14px 34px rgba(86, 1, 217, 0.32)')}
                onMouseOut={e => (e.target.style.transform = 'none', e.target.style.boxShadow = '0 8px 26px rgba(86, 1, 217, 0.26)')}
              >
                Responder las preguntas →
              </button>
            </>
          )}

          {currentStep === 'preguntas' && (
            <div style={{ background: '#fff', border: '1px solid #E9E4F5', borderRadius: '20px', padding: '22px' }}>
              <h3 style={{ margin: 0, fontSize: '16.5px', color: '#210B50' }}>
                Preguntas (próximamente)
              </h3>
              <p style={{ margin: '10px 0 0', color: '#6B6C7A' }}>
                En esta versión del MVP, las preguntas estarán disponibles pronto.
              </p>
            </div>
          )}

          {currentStep === 'informe' && (
            <div style={{ background: '#fff', border: '1px solid #E9E4F5', borderRadius: '20px', padding: '22px' }}>
              <h3 style={{ margin: 0, fontSize: '16.5px', color: '#210B50' }}>
                Informe (próximamente)
              </h3>
              <p style={{ margin: '10px 0 0', color: '#6B6C7A' }}>
                En esta versión del MVP, el informe detallado estará disponible pronto.
              </p>
            </div>
          )}
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

      {saving && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#5601D9', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '12px' }}>Guardando...</div>}
    </div>
  );
}
