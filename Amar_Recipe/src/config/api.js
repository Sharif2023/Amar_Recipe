// API Configuration
// In production (Vercel), call Render backend directly
// In development, call localhost

const isDev = import.meta.env.DEV;

// Production: Render backend URL
// Development: local XAMPP server
const RENDER_BACKEND = 'https://amar-recipe-backend.onrender.com/';

const API_BASE_URL = isDev
    ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/')
    : RENDER_BACKEND + 'src/api/';

const ADMIN_API_BASE_URL = isDev
    ? (import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/')
    : RENDER_BACKEND + 'src/api/';

// Helper function to build API URL
export function buildApiUrl(endpoint) {
    return API_BASE_URL + endpoint;
}

export function buildAdminApiUrl(endpoint) {
    return ADMIN_API_BASE_URL + endpoint;
}

export { API_BASE_URL, ADMIN_API_BASE_URL };


