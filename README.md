# Árbitro de priorización — Frontend

Frontend React para Árbitro de priorización de Spin.

## Setup

```bash
npm install
cp .env.example .env
# Editar .env con tu token
npm run dev
```

El frontend estará en `http://localhost:5173`.

## Estructura

- `src/main.jsx` - Entry point
- `src/App.jsx` - App principal
- `src/pages/` - Vistas principales
- `src/components/` - Componentes reutilizables
- `src/api.js` - Cliente HTTP
- `src/evaluador.js` - Lógica de evaluación (copiada del preview)
- `src/styles/` - CSS

## Deploy

```bash
npm run build
vercel deploy
```
