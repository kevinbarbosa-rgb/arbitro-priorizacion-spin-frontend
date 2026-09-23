import React, { useState, useEffect } from 'react';
import { getExpedientes } from '../api';
import { nivelDe } from '../evaluador';

export default function DashboardPage({ onSelectExpediente, onNewEval }) {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [squad, setSquad] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getExpedientes({ squad: squad || undefined, limit: 50 });
        setExpedientes(data.expedientes || []);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    cargar();
  }, [squad]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#999' }}>
        Cargando expedientes...
      </div>
    );
  }

  const expedientesFiltrados = expedientes.filter(e => {
    if (filtro === 'todas') return true;
    if (filtro === 'listo') return e.puntaje >= 80;
    if (filtro === 'casi') return e.puntaje >= 60 && e.puntaje < 80;
    if (filtro === 'construccion') return e.puntaje >= 35 && e.puntaje < 60;
    if (filtro === 'cruda') return e.puntaje < 35;
    return true;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#210B50' }}>
          Tablero de evaluaciones
        </h2>
        <button
          onClick={onNewEval}
          style={{
            background: '#5601D9',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(86, 1, 217, 0.22)',
          }}
          onMouseOver={e => (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 18px rgba(86, 1, 217, 0.28)')}
          onMouseOut={e => (e.target.style.transform = 'none', e.target.style.boxShadow = '0 2px 10px rgba(86, 1, 217, 0.22)')}
        >
          + Nueva evaluación
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['todas', 'listo', 'casi', 'construccion', 'cruda'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              background: filtro === f ? '#EEE3FF' : '#fff',
              border: `1px solid ${filtro === f ? '#C7A1FF' : '#E9E4F5'}`,
              borderRadius: '99px',
              padding: '8px 15px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: filtro === f ? '#5601D9' : '#6B6C7A',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f === 'todas' && 'Todas'}
            {f === 'listo' && 'Listas para la mesa'}
            {f === 'casi' && 'Casi listas'}
            {f === 'construccion' && 'En construcción'}
            {f === 'cruda' && 'Todavía son ideas'}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#FFF0E5', color: '#C24A00', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {expedientesFiltrados.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: '1.5px dashed #C7A1FF',
            borderRadius: '20px',
            padding: '40px 30px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#210B50' }}>
            No hay evaluaciones aún
          </h3>
          <p style={{ margin: 0, color: '#6B6C7A', fontSize: '14px' }}>
            Crea tu primera evaluación para ver cómo quedan aquí
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {expedientesFiltrados.map(e => {
            const nivel = nivelDe(e.puntaje || 0);
            return (
              <button
                key={e.id}
                onClick={() => onSelectExpediente(e)}
                style={{
                  background: '#fff',
                  border: '1px solid #E9E4F5',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                }}
                onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(33, 11, 80, 0.07)')}
                onMouseOut={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: nivel.c,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flex: '0 0 52px',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ fontSize: '18px' }}>{e.puntaje || '—'}</div>
                  <div style={{ fontSize: '9px', marginTop: '2px' }}>de 100</div>
                </div>

                <div style={{ flex: 1 }}>
                  <b style={{ display: 'block', fontSize: '15px', color: '#210B50' }}>
                    {e.iniciativa}
                  </b>
                  <span style={{ fontSize: '12px', color: '#6B6C7A' }}>
                    {e.squad} · {e.createdAt ? new Date(e.createdAt).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </span>
                </div>

                <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                  <div
                    style={{
                      background: nivel.c,
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                    }}
                  >
                    {nivel.t}
                  </div>
                  <span style={{ fontSize: '11px', color: '#999', marginTop: '4px', display: 'block' }}>
                    {e.ciclo || 'Borrador'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
