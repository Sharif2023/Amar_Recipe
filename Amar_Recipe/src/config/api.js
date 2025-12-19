// API Configuration
// In production, use Vercel proxy to bypass Bytehost anti-bot security
// In development, call Bytehost directly

const isDev = import.meta.env.DEV;

// For production, use Vercel API routes as proxy
// For development, use direct Bytehost URLs (or local)
const API_BASE_URL = isDev
    ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/')
    : '/api/proxy?endpoint=';

const ADMIN_API_BASE_URL = isDev
    ? (import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost/Amar_Recipies_Live/Amar_Recipe/admin_api/')
    : '/api/admin-proxy?endpoint=';

// Helper function to build API URL
export function buildApiUrl(endpoint) {
    if (isDev) {
        return API_BASE_URL + endpoint;
    }
    // In production, use proxy
    return `/api/proxy?endpoint=${endpoint}`;
}

export function buildAdminApiUrl(endpoint) {
    if (isDev) {
        return ADMIN_API_BASE_URL + endpoint;
    }
    return `/api/admin-proxy?endpoint=${endpoint}`;
}

export { API_BASE_URL, ADMIN_API_BASE_URL };

