
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://uvremjs67f.execute-api.ap-south-2.amazonaws.com/dev';

export async function fetchWithAuth(endpoint: string, idToken: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${idToken}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  // Health check or endpoints returning empty bodies
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }
  
  return response.json();
}
