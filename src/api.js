// LocalStorage-based API client (no backend needed)

export async function login(email, nombre, squad) {
  const user = {
    id: `user_${Date.now()}`,
    email,
    nombre,
    squad,
  };

  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', `token_${Date.now()}`);

  return {
    token: localStorage.getItem('token'),
    user,
  };
}

export async function getExpedientes() {
  const email = JSON.parse(localStorage.getItem('user') || '{}').email;
  const allExpedientes = JSON.parse(localStorage.getItem('expedientes') || '[]');
  return allExpedientes.filter(e => e.email === email);
}

export async function createExpediente(data) {
  const expediente = {
    id: `exp_${Date.now()}`,
    email: JSON.parse(localStorage.getItem('user') || '{}').email,
    ...data,
  };

  const expedientes = JSON.parse(localStorage.getItem('expedientes') || '[]');
  expedientes.push(expediente);
  localStorage.setItem('expedientes', JSON.stringify(expedientes));

  return expediente;
}

export async function getExpedienteById(id) {
  const expedientes = JSON.parse(localStorage.getItem('expedientes') || '[]');
  return expedientes.find(e => e.id === id);
}

export async function updateExpediente(id, updates) {
  const expedientes = JSON.parse(localStorage.getItem('expedientes') || '[]');
  const idx = expedientes.findIndex(e => e.id === id);
  if (idx !== -1) {
    expedientes[idx] = { ...expedientes[idx], ...updates };
    localStorage.setItem('expedientes', JSON.stringify(expedientes));
    return expedientes[idx];
  }
  return null;
}

export async function deleteExpediente(id) {
  const expedientes = JSON.parse(localStorage.getItem('expedientes') || '[]');
  const filtered = expedientes.filter(e => e.id !== id);
  localStorage.setItem('expedientes', JSON.stringify(filtered));
  return true;
}
