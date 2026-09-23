# Árbitro de priorización — Frontend

Frontend React para Árbitro de priorización de Spin.  
**React 18 + Vite + Firebase**

## 🚀 Quick Start (3 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env
```

Edita `.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_TOKEN=spin-pilot-token-2024
```

### 3. Ejecutar
```bash
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

---

## 🏗️ Estructura

```
src/
├── main.jsx                   Entry point
├── App.jsx                    App principal + navegación
├── api.js                     Cliente HTTP (todas las calls a backend)
├── evaluador.js               Lógica de 6 criterios (del preview)
├── AuthContext.jsx            Autenticación global
├── pages/
│   ├── LoginPage.jsx          Login con email/nombre/squad
│   ├── HomePage.jsx           Entrada de PRD
│   ├── DashboardPage.jsx      Tablero con filtros
│   ├── EvaluationPage.jsx     Paso 1: Lectura
│   ├── QuestionsPage.jsx      Paso 2: Preguntas
│   └── ReportPage.jsx         Paso 3: Informe (RICE + estado)
└── components/
    ├── Semaforo.jsx           Verde/Amarillo/Rojo
    └── Criterio.jsx           Card de criterio con votos
```

---

## 🔄 Flujo de usuario

1. **Login** → email + nombre + squad
2. **Dashboard** → ver evaluaciones existentes, crear nueva
3. **Paso 1 (Lectura)** → semáforo + 6 criterios evaluados
4. **Paso 2 (Preguntas)** → preguntas basadas en criterios débiles
5. **Paso 3 (Informe)** → calificación RICE y estado
6. **Volver a Dashboard** → guardar todo automáticamente

---

## 📚 Features

✅ Evaluación local de 6 criterios  
✅ Semáforo automático (verde/amarillo/rojo)  
✅ Calificación 0-100  
✅ Preguntas dinámicas  
✅ RICE (Reach, Impact, Confidence, Effort)  
✅ Estado (Borrador/En la mesa/Priorizada/Descartada)  
✅ Tablero con filtros  
✅ Persistencia en Firestore  

---

## 🔑 Autenticación

**Para el piloto:**
- **Token:** `spin-pilot-token-2024` (ya en `.env.example`)
- **Login:** Usa cualquier email, nombre y squad

El token se guarda en `localStorage` automáticamente.

---

## 🚢 Deploy a Vercel

### Build
```bash
npm run build
```

### Deploy
```bash
vercel deploy
```

Necesita:
1. Vercel CLI: `npm i -g vercel`
2. Variables de entorno en Vercel Dashboard:
   ```
   VITE_API_URL=https://tu-backend.vercel.app/api
   VITE_AUTH_TOKEN=spin-pilot-token-2024
   ```
3. GitHub conectado (ya hecho)

---

## 🧪 Testing

1. **npm run dev** en frontend y backend
2. Abre `http://localhost:5173`
3. Login con cualquier email
4. Copia un PRD y evalúa
5. Navega por los 3 pasos
6. Verifica que los datos se guardan en Firestore

---

## 📝 Notas

- Frontend usa **evaluación local** (sin Claude API aún)
- Token compartido para el piloto (usuarios separados después)
- Todos los datos se sincronizan con Firestore automáticamente
- Los componentes usan **inline styles** (sin CSS externo)
