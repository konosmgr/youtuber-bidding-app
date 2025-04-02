// Use environment variable if available, otherwise default to the proxy path
// This ensures it works correctly in both development and production
export const API_BASE = import.meta.env.VITE_PUBLIC_API_URL || '/api';