// API Configuration
// This file provides centralized API URL configuration based on the environment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://amar-recipe.byethost7.com/src/api/';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'https://amar-recipe.byethost7.com/admin_api/';

export { API_BASE_URL, ADMIN_API_BASE_URL };
