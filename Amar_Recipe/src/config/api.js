// API Configuration
// Production: remote Render backend
// Development: use a local PHP backend unless a specific Vite env is provided

const DEFAULT_PROD_API = 'https://amar-recipe-backend.onrender.com/src/api/';
const DEFAULT_LOCAL_API = 'http://127.0.0.1:8000/src/api/';

const isDev = import.meta.env.DEV;

const API_BASE_URL = isDev
  ? (import.meta.env.VITE_API_BASE_URL || DEFAULT_LOCAL_API)
  : (import.meta.env.VITE_API_BASE_URL || DEFAULT_PROD_API);

const ADMIN_API_BASE_URL = isDev
  ? (import.meta.env.VITE_ADMIN_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || DEFAULT_LOCAL_API)
  : (import.meta.env.VITE_ADMIN_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || DEFAULT_PROD_API);

export function buildApiUrl(endpoint) {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '') + '/';
  return normalizedBase + endpoint.replace(/^\/+/, '');
}

export function buildAdminApiUrl(endpoint) {
  const normalizedBase = ADMIN_API_BASE_URL.replace(/\/+$/, '') + '/';
  return normalizedBase + endpoint.replace(/^\/+/, '');
}

export function getUserAuthHeaders(extra = {}) {
  const token = localStorage.getItem('amar_recipe_token');
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}`, 'X-Auth-Token': token } : {}),
  };
}

export { API_BASE_URL, ADMIN_API_BASE_URL };


