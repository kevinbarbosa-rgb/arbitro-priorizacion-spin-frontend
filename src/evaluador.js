// Evaluación de PRDs - Spin
// Lógica extraída del preview HTML

// Vocabulario y patrones
const OBJETIVO = /\bMAU|transaccional|recurrencia|adquisici|activaci|retenci|churn|ingreso|comisi|volumen|# ?trx|transaccion|cash ?in|cash ?out|spei|p2p|retiro|dep[óo]sito|soporte|fricci|conversi|objetivo de negocio|negocio/i;

const SENAL = {
  tamano: /\d+\s*%\s*(de\s*)?(los\s*)?(MAU|usuarios activos|usuarios|clientes)|\bMAU|\d[\d.,]*\s*(mil|millones|k\b)\s*(de\s*)?(usuarios|trx|transaccion)|# ?trx|volumen de/i,
  mejora: /\d+\s*(%|puntos|por ciento|percent)|\d[\d.,]{2,}\s*(trx|transaccion|usuarios)|a la mitad|al doble|de \d+\s*a\s*\d+|optimista|conservador/i,
  evidencia: /an[áa]lisis|research|investigaci[óo]n|entrevistas?|encuesta|estudio|rese[ñn]as|tickets|dashboard|tablero|datos de|uplift|piloto|regi[óo]n .{0,20}encendida|resultados/i,
  cifra: /\d[\d.,]*\s*(%|por ciento|usuarios|casos|tickets|trx|transaccion|MAU|mil|millones|personas|tiendas)/i,
  intuicion: /creemos|pensamos|sentimos|nos parece|intuimos|seguramente|deber[íi]a funcionar/i,
  hipotesis: /hip[óo]tesis|si .{5,80} entonces|esperamos (que|lograr)|apostamos/i,
  mandato: /mandato|nos lo pidi|viene de (arriba|direcci[óo]n)|el comit[ée]|regulatori|por normativa|obligatorio por|compliance exige/i,
  desplaza: /desplaza|en vez de|entra en lugar de|sacamos|posterga|se corre|sale del backlog|prioriza sobre/i,
  vanidad: /visitas|descargas|impresiones|clicks|clics|likes|seguidores|usuarios registrados|page ?views/i,
  kpi: /kpi|m[ée]trica|north star|indicador|c[óo]mo sabemos|target/i,
  target: /target|meta|objetivo de \d|optimista|conservador|\d+\s*%|\d[\d.,]{2,}\s*(trx|transaccion)/i,
  medicion: /medici[óo]n|dashboard|tablero|se mide|amplitude|looker|evento|instrumentar|tracking/i,
  plazo: /\d+\s*(d[íi]as|semanas|meses)|trimestre|Q[1-4]|primer semestre|antes de/i,
  base: /hoy (estamos|son|es|el)|l[íi]nea base|actualmente (es|son|estamos)|hoy tenemos|baseline/i,
  fases: /fase \d|fase [a-z]|roll ?-?out|piloto|etapa \d|lanzamiento inicial|primera versi[óo]n|mvp\b|despliegue|por regiones?/i,
  recorte: /si no (alcanza|est[áa] listo|llega)|recortamos|sale sin|dejamos fuera|salimos con|se posterga|queda para (una )?fase/i,
  vago: /cuando (desarrollo|haya|se pueda|tengamos)|lo antes posible|cuanto antes|sin fecha|por definir|TBD/i,
  areas: /\bdata\b|legal|seguridad|riesgos|compliance|operaciones|otro squad|infra|plataforma|tech lead|stakeholder|proveedor|core\b|tiendas? oxxo|oxxo (tiene|debe|habilita|opera)/i,
  instrumenta: /evento|instrumentar|tracking|anal[íi]tica|capturar|dashboard|tablero/i,
  tecnico: /api\b|latencia|core\b|backend|servicio de|integraci[óo]n|deeplink|modelo\b/i,
  competencia: /competencia|competidor|ning[úu]n banco|otros bancos|fintech|diferenciador|frente a la competencia|benchmark|mercado/i,
  existente: /ya (existe|intentamos|hicimos|hay|se intent|contamos)|hoy ya|(modelo|funcionalidad|flujo|motor|herramienta)\s[\wáéíóú\s]{0,20}actual|versi[óo]n anterior|alternativa|evaluamos|consideramos|en vez de/i,
};

const NOMBRES = {
  c1: 'Alineación al negocio',
  c2: 'Evidencia',
  c3: 'Impacto medible',
  c4: 'Plan de entrega',
  c5: 'Dependencias',
  c6: 'Diferenciación',
};

// Utilidades
function frases(t) {
  return t.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 20);
}

function corta(s, n) {
  s = (s || '').replace(/\s+/g, ' ').trim();
  const w = s.split(' ');
  n = n || 16;
  return w.length > n ? w.slice(0, n).join(' ') + '…' : s;
}

function hay(fs, re) {
  return fs.find(s => re.test(s));
}

function mejor(fs, re, extra) {
  const cand = fs.filter(s => re.test(s));
  if (!cand.length) return '';
  return cand.map(s => {
    let p = 0;
    if (/\d/.test(s)) p += 3;
    if (/%|trx|MAU|puntos|mil|millones/.test(s)) p += 2;
    if (extra && extra.test(s)) p += 4;
    if (s.length > 60 && s.length < 220) p += 1;
    return [p, s];
  }).sort((a, b) => b[0] - a[0])[0][1];
}

// Evaluadores de criterios
const EVAL = {
  c1(t, fs) {
    const obj = hay(fs, OBJETIVO);
    if (!obj) return { estado: 'ausente', cita: '', nota: 'Todavía no dice a qué objetivo de negocio le pega ni qué mueve en Spin.' };
    const tam = SENAL.tamano.test(t);
    const mej = SENAL.mejora.test(t);
    if (tam && mej) return { estado: 'sustentado', cita: corta(mejor(fs, SENAL.tamano, OBJETIVO)), nota: 'Dice a qué objetivo le pega, cuánto pesa hoy y cuánto espera moverlo.' };
    if (tam) return { estado: 'sustentado', cita: corta(mejor(fs, SENAL.tamano, OBJETIVO)), nota: 'Nombra el objetivo y el peso del flujo en MAUs o volumen.' };
    if (mej) return { estado: 'débil', cita: corta(mejor(fs, OBJETIVO, SENAL.mejora)), nota: 'Hay objetivo y meta, pero no dice qué porcentaje de MAUs o qué volumen toca.' };
    return { estado: 'débil', cita: corta(obj), nota: 'Menciona el objetivo sin decir cuánto pesa hoy ese flujo.' };
  },

  c2(t, fs) {
    if (SENAL.mandato.test(t)) {
      const cita = corta(mejor(fs, SENAL.mandato));
      if (SENAL.desplaza.test(t)) return { estado: 'sustentado', cita, nota: 'Entra por mandato y dice qué desplaza. Eso basta.', origen: 'mandato' };
      return { estado: 'débil', cita, nota: 'Entra por mandato. No lo cuestiono, pero falta decir qué desplaza.', origen: 'mandato' };
    }
    let evc = fs.find(s => SENAL.evidencia.test(s) && SENAL.cifra.test(s));
    const ev = hay(fs, SENAL.evidencia);
    if (!evc && ev) {
      const pos = t.indexOf(ev.slice(0, 40));
      if (pos >= 0 && SENAL.cifra.test(t.slice(Math.max(0, pos - 260), pos + 420))) evc = ev;
    }
    if (evc) return { estado: 'sustentado', cita: corta(evc), nota: 'Trae análisis con cifra, no una impresión del equipo.', origen: 'evidencia' };
    if (ev) return { estado: 'débil', cita: corta(ev), nota: 'Cita una fuente sin número ni periodo. ¿Cuántos casos y de cuándo?', origen: 'evidencia' };
    if (SENAL.cifra.test(t)) return { estado: 'débil', cita: corta(mejor(fs, SENAL.cifra)), nota: 'Hay cifras, pero no dice de qué análisis o dashboard salen.', origen: 'dato suelto' };
    if (SENAL.intuicion.test(t)) return { estado: 'débil', cita: corta(mejor(fs, SENAL.intuicion)), nota: 'Es una intuición del equipo. Puede ser correcta, pero no es evidencia.', origen: 'supuesto' };
    return { estado: 'ausente', cita: '', nota: 'Todavía no dice con qué datos se sostiene que esto pasa.', origen: 'sin declarar' };
  },

  c3(t, fs) {
    if (SENAL.vanidad.test(t) && !SENAL.mejora.test(t)) return { estado: 'débil', cita: corta(mejor(fs, SENAL.vanidad)), nota: 'Esa métrica sube aunque el producto no sirva. Necesito una que mida valor.' };
    const k = hay(fs, SENAL.kpi) || hay(fs, SENAL.mejora);
    if (!k) return { estado: 'ausente', cita: '', nota: 'Todavía no hay un número que diga si esto funcionó.' };
    const hip = SENAL.hipotesis.test(t);
    const num = SENAL.mejora.test(t);
    const med = SENAL.medicion.test(t);
    const lb = SENAL.base.test(t);
    const cita = corta(mejor(fs, SENAL.kpi, SENAL.mejora));
    if (num && med && hip) return { estado: 'sustentado', cita, nota: lb ? 'Hipótesis, KPI con target, medición declarada y línea base.' : 'Hipótesis, KPI con target y dónde se mide. Falta el valor de hoy.' };
    if (num && med) return { estado: 'sustentado', cita, nota: 'KPI con target y medición declarada. Sin hipótesis explícita no se sabe qué se está probando.' };
    if (num) return { estado: 'débil', cita, nota: 'Hay target, pero no dice dónde se va a medir ni cuánto vale hoy.' };
    return { estado: 'débil', cita: corta(k), nota: 'Nombra qué va a medir, pero sin target no es una meta.' };
  },

  c4(t, fs) {
    const f = hay(fs, SENAL.fases);
    const noEsPlazo = /(m[áa]s de|menos de|hace|[úu]ltim|primer|cada|durante|antig[üu]edad de)\s+\w*\s*(\d+|una?|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|doce)?\s*(semanas?|meses|d[íi]as)/i;
    const plazo = fs.find(s => SENAL.plazo.test(s) && !noEsPlazo.test(s) && !/problema|dejan de|abandonan/i.test(s));
    if (!f && !plazo && SENAL.vago.test(t)) return { estado: 'ausente', cita: corta(mejor(fs, SENAL.vago)), nota: '"Cuando haya espacio" no es un plan. La entrega se decide, no se espera.' };
    if (!f && !plazo) return { estado: 'ausente', cita: '', nota: 'Todavía no dice cómo saldría: ni fases, ni piloto, ni fecha.' };
    if (f && SENAL.recorte.test(t)) return { estado: 'sustentado', cita: corta(f, 22), nota: 'Sale por fases y dice qué pasa si la primera no da los números.' };
    if (f) return { estado: 'sustentado', cita: corta(f, 22), nota: 'Hay plan de entrega por fases. Falta decir qué pasa si la primera no rinde.' };
    return { estado: 'débil', cita: corta(plazo), nota: 'Hay una fecha, pero no un plan de salida por fases ni un piloto.' };
  },

  c5(t, fs) {
    const a = hay(fs, SENAL.areas);
    const inst = SENAL.instrumenta.test(t);
    if (a && inst) return { estado: 'sustentado', cita: corta(mejor(fs, SENAL.areas, SENAL.instrumenta)), nota: 'Nombra las áreas que entran y qué hay que instrumentar.' };
    if (a) return { estado: 'débil', cita: corta(a), nota: 'Nombra áreas, pero no dice qué evento hay que capturar para medir.' };
    if (inst) return { estado: 'débil', cita: corta(mejor(fs, SENAL.instrumenta)), nota: 'Habla de medición, pero no dice con quién se construye.' };
    if (SENAL.tecnico.test(t)) return { estado: 'débil', cita: corta(mejor(fs, SENAL.tecnico)), nota: 'Menciona una pieza técnica, pero no a las áreas que tienen que entrar.' };
    return { estado: 'ausente', cita: '', nota: 'Todavía no menciona a nadie fuera del squad. En Spin casi nunca es cierto.' };
  },

  c6(t, fs) {
    const comp = hay(fs, SENAL.competencia);
    const ex = hay(fs, SENAL.existente);
    if (comp && ex) return { estado: 'sustentado', cita: corta(mejor(fs, SENAL.competencia)), nota: 'Se compara con el mercado y con lo que Spin ya tiene.' };
    if (comp) return { estado: 'sustentado', cita: corta(comp), nota: 'Dice qué hace la competencia y por qué esto diferencia.' };
    if (ex) return { estado: 'débil', cita: corta(ex), nota: 'Revisa lo que ya existe en Spin, pero no mira al mercado.' };
    return { estado: 'ausente', cita: '', nota: 'Todavía no dice qué hace la competencia ni si ya existe algo parecido en Spin.' };
  },
};

// Evaluación completa
export function evaluarPRD(prd) {
  const fs = frases(prd);

  const criterios = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map(id => {
    const r = EVAL[id](prd, fs);
    return {
      id,
      nombre: NOMBRES[id],
      estado: r.estado,
      cita: r.cita,
      nota: r.nota,
      origen: r.origen,
    };
  });

  // Calificación
  const PESOS = { c1: 20, c2: 20, c3: 25, c4: 15, c5: 10, c6: 10 };
  const VALOR = { sustentado: 1, débil: 0.5, ausente: 0 };
  let puntaje = 0;
  criterios.forEach(c => {
    puntaje += (PESOS[c.id] || 0) * (VALOR[c.estado] || 0);
  });
  puntaje = Math.round(puntaje);

  // Semáforo
  const ausentes = criterios.filter(c => c.estado === 'ausente').length;
  const debiles = criterios.filter(c => c.estado === 'débil').length;
  let semaforo = 'verde';
  if (ausentes >= 2) semaforo = 'rojo';
  else if (ausentes === 1 || debiles >= 2) semaforo = 'amarillo';

  return { criterios, puntaje, semaforo };
}

// Niveles
const NIVELES = [
  { min: 80, clave: 'listo', t: 'Lista para la mesa', c: '#1E7A4B' },
  { min: 60, clave: 'casi', t: 'Casi lista', c: '#B07A00' },
  { min: 35, clave: 'construccion', t: 'En construcción', c: '#C24A00' },
  { min: 0, clave: 'cruda', t: 'Todavía es una idea', c: '#B3261E' },
];

export function nivelDe(puntaje) {
  return NIVELES.find(n => puntaje >= n.min) || NIVELES[3];
}
