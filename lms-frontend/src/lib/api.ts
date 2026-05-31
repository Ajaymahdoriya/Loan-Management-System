interface CustomRequestInit extends Omit<RequestInit, 'body'> {
  body?: any;
}

export async function apiFetch(endpoint: string, options: CustomRequestInit = {}) {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const baseUrl = envBaseUrl
    ? (envBaseUrl.replace(/\/$/, '').endsWith('/api')
        ? envBaseUrl.replace(/\/$/, '')
        : `${envBaseUrl.replace(/\/$/, '')}/api`)
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? '/api'
        : 'http://localhost:5000/api');
  
  // Ensure endpoint starts with '/'
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;
  
  const headers = new Headers(options.headers || {});
  
  // Automatically grab the JWT token from localStorage on the client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  let body = options.body;
  
  // Handle JSON bodies automatically if the body is a plain object and not FormData
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    body = JSON.stringify(body);
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });
  
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  
  return response;
}

export function getUploadsUrl(uploadPath: string) {
  const envBase = process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/$/, '');
  const origin = (typeof window !== 'undefined') ? window.location.origin.replace(/\/$/, '') : '';
  const base = envBase || origin || 'http://localhost:5000';
  const path = uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`;
  return `${base}${path}`;
}
