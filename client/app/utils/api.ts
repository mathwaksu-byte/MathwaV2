import axios from 'axios';

const API_URL = ((import.meta as any)?.env?.PUBLIC_SERVER_BASE_URL ? String((import.meta as any).env.PUBLIC_SERVER_BASE_URL).replace(/\/$/, '') + '/api' : 'http://localhost:3001/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Universities
export const universitiesAPI = {
  getAll: () => api.get('/universities'),
  getBySlug: (slug: string) => api.get(`/universities/${slug}`),
};

// Applications
export const applicationsAPI = {
  submit: (data: unknown) => api.post('/applications', data),
};

// Stats
export const statsAPI = {
  getPublic: () => api.get('/stats/public'),
};

// Testimonials
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
};

// FAQs
export const faqsAPI = {
  getAll: (category?: string) => api.get('/faqs', { params: { category } }),
};

// Blogs
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
};

// Contact
export const contactAPI = {
  submit: (data: unknown) => api.post('/contact', data),
};

// Uploads
export const uploadsAPI = {
  single: (file: File, bucket?: string, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (bucket) formData.append('bucket', bucket);
    if (folder) formData.append('folder', folder);
    
    return api.post('/uploads/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Payments
export const paymentsAPI = {
  createOrder: (amount: number, application_id: string, purpose?: string) =>
    api.post('/payments/create-order', { amount, application_id, purpose }),
  verify: (data: unknown) => api.post('/payments/verify', data),
};

export default api;
