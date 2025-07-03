// lib/auth.ts
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // Handle unauthorized (token expired/invalid)
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    throw new Error('Session expired');
  }

  return response;
};