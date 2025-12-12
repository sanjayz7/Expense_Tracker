// API Configuration from environment variables
// Vite requires VITE_ prefix for environment variables to be exposed to client-side code
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// Remove trailing slash if present
export const API = apiUrl.replace(/\/$/, '');

// Debug: Log the API URL being used (remove in production)
console.log('API URL:', API);
console.log('Environment variable:', import.meta.env.VITE_API_URL);

