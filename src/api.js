const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

let token = localStorage.getItem('auth_token') || import.meta.env.VITE_AUTH_TOKEN;

export function setToken(newToken) {
  token = newToken;
  localStorage.setItem('auth_token', newToken);
}

export function getToken() {
  return token;
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Auth
export async function login(email, nombre, squad) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, nombre, squad }),
  });
  setToken(data.token);
  return data;
}

export async function verifyToken() {
  return request('/auth/verify', { method: 'GET' });
}

// Expedientes
export async function createExpediente(expediente) {
  return request('/expedientes', {
    method: 'POST',
    body: JSON.stringify(expediente),
  });
}

export async function getExpedientes(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/expedientes${query ? '?' + query : ''}`);
}

export async function getExpediente(id) {
  return request(`/expedientes/${id}`);
}

export async function updateExpediente(id, data) {
  return request(`/expedientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteExpediente(id) {
  return request(`/expedientes/${id}`, { method: 'DELETE' });
}

// Corpus
export async function getCorpus(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/corpus${query ? '?' + query : ''}`);
}

export async function createInitiativa(iniciativa) {
  return request('/corpus', {
    method: 'POST',
    body: JSON.stringify(iniciativa),
  });
}

export async function getInitiativa(id) {
  return request(`/corpus/${id}`);
}

export async function updateInitiativa(id, data) {
  return request(`/corpus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteInitiativa(id) {
  return request(`/corpus/${id}`, { method: 'DELETE' });
}
