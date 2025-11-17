// API client utilities

const API_BASE_URL = process.env.API_URL || 'http://localhost:8787';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  universities: {
    getAll: (filters?: { country?: string; city?: string }) => {
      const params = new URLSearchParams(filters as any);
      return apiRequest(`/api/universities?${params}`);
    },
    getById: (id: string) => apiRequest(`/api/universities/${id}`),
  },
  
  programs: {
    getAll: (universityId?: string) => {
      const params = universityId ? `?universityId=${universityId}` : '';
      return apiRequest(`/api/programs${params}`);
    },
    getById: (id: string) => apiRequest(`/api/programs/${id}`),
  },
  
  gallery: {
    getAll: (universityId?: string) => {
      const params = universityId ? `?universityId=${universityId}` : '';
      return apiRequest(`/api/gallery${params}`);
    },
  },
  
  content: {
    getAll: () => apiRequest('/api/content'),
    getByKey: (key: string) => apiRequest(`/api/content?key=${key}`),
  },
  
  prices: {
    get: () => apiRequest('/api/prices'),
  },
  
  messages: {
    create: (data: { name: string; email: string; phone?: string; message: string }) =>
      apiRequest('/api/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
