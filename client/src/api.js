const ADMIN_KEY = 'quizly_admin_password';

export function getAdminPassword() {
  try { return sessionStorage.getItem(ADMIN_KEY) || ''; } catch (e) { return ''; }
}
export function setAdminPassword(p) {
  try { sessionStorage.setItem(ADMIN_KEY, p); } catch (e) {}
}
export function clearAdminPassword() {
  try { sessionStorage.removeItem(ADMIN_KEY); } catch (e) {}
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const pwd = getAdminPassword();
  if (pwd) headers['X-Admin-Password'] = pwd;

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    const err = new Error('Admin password required.');
    err.code = 401;
    throw err;
  }

  let body = null;
  try { body = await res.json(); } catch (e) {}

  if (!res.ok) {
    const err = new Error((body && body.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export const api = {
  health: () => request('/api/health'),
  login: (password) => request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),

  listVariants: () => request('/api/admin/variants'),
  getVariant: (id) => request(`/api/admin/variants/${id}`),
  createVariant: (data) => request('/api/admin/variants', { method: 'POST', body: JSON.stringify(data) }),
  deleteVariant: (id) => request(`/api/admin/variants/${id}`, { method: 'DELETE' }),

  getQuiz: (id) => request(`/api/quiz/${id}`),
  submitAttempt: (id, data) => request(`/api/quiz/${id}/attempts`, { method: 'POST', body: JSON.stringify(data) }),
};
