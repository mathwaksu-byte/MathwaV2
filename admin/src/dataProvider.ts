import type { DataProvider, RaRecord } from 'react-admin';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function http(path: string, init?: RequestInit) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...init, headers: { ...headers, ...(init?.headers as any) } });
  return res;
}

const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 25 } = (params as any).pagination || {};
    if (resource === 'universities') {
      const res = await http('/universities/admin/all');
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const rows = (j.universities || []).map((u: any) => ({ ...u, id: u.id })) as RaRecord[];
      return { data: rows, total: rows.length } as any;
    }
    if (resource === 'applications') {
      const res = await http(`/applications/admin?page=${page}&limit=${perPage}`);
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const rows = (j.applications || []).map((u: any) => ({ ...u, id: u.id })) as RaRecord[];
      const total = j.pagination?.total || rows.length;
      return { data: rows, total } as any;
    }
    if (resource === 'testimonials') {
      const res = await http('/testimonials/admin');
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const rows = (j.testimonials || []).map((u: any) => ({ ...u, id: u.id })) as RaRecord[];
      return { data: rows, total: rows.length } as any;
    }
    if (resource === 'faqs') {
      const res = await http('/faqs/admin');
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const rows = (j.faqs || []).map((u: any) => ({ ...u, id: u.id })) as RaRecord[];
      return { data: rows, total: rows.length } as any;
    }
    if (resource === 'blogs') {
      const res = await http('/blogs/admin/all');
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const rows = (j.blogs || []).map((u: any) => ({ ...u, id: u.id })) as RaRecord[];
      return { data: rows, total: rows.length } as any;
    }
    if (resource === 'settings') {
      const res = await http('/settings/admin');
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const s = j.settings || { key: 'default' };
      const rows = [{ ...s, id: s.key }] as RaRecord[];
      return { data: rows, total: rows.length } as any;
    }
    throw new Error('Not supported');
  },
  getOne: async (resource, params) => {
    if (resource === 'universities') {
      const id = (params as any).id as string;
      const res = await http(`/universities/admin/${id}`);
      if (!res.ok) throw new Error('Not found');
      const j = await res.json();
      const u = j.university;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'applications') {
      const id = (params as any).id as string;
      const res = await http(`/applications/admin/${id}`);
      if (!res.ok) throw new Error('Not found');
      const j = await res.json();
      const u = j.application;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'testimonials') {
      const id = (params as any).id as string;
      const res = await http(`/testimonials/admin/${id}`);
      if (!res.ok) throw new Error('Not found');
      const j = await res.json();
      const u = j.testimonial;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'faqs') {
      const id = (params as any).id as string;
      const res = await http(`/faqs/admin/${id}`);
      if (!res.ok) throw new Error('Not found');
      const j = await res.json();
      const u = j.faq;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'blogs') {
      const id = (params as any).id as string;
      const res = await http(`/blogs/admin/${id}`);
      if (!res.ok) throw new Error('Not found');
      const j = await res.json();
      const u = j.blog;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'settings') {
      const res = await http('/settings/admin');
      if (!res.ok) throw new Error('Not found');
      const j = await res.json();
      const s = j.settings || { key: 'default' };
      return { data: { ...s, id: s.key } as any } as any;
    }
    throw new Error('Not supported');
  },
  create: async (resource, params) => {
    const body = JSON.stringify((params as any).data);
    if (resource === 'universities') {
      const res = await http('/universities/admin', { method: 'POST', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.university;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'testimonials') {
      const res = await http('/testimonials/admin', { method: 'POST', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.testimonial;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'faqs') {
      const res = await http('/faqs/admin', { method: 'POST', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.faq;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'blogs') {
      const res = await http('/blogs/admin', { method: 'POST', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.blog;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'settings') {
      const res = await http('/settings/admin', { method: 'PUT', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const s = j.settings;
      return { data: { ...s, id: s.key } as any } as any;
    }
    throw new Error('Not supported');
  },
  update: async (resource, params) => {
    const id = (params as any).id as string;
    const data = (params as any).data;
    const body = JSON.stringify(data);
    if (resource === 'universities') {
      const res = await http(`/universities/admin/${id}`, { method: 'PUT', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.university;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'applications') {
      const payload = JSON.stringify({ status: data.status, notes: data.notes });
      const res = await http(`/applications/admin/${id}/status`, { method: 'PATCH', body: payload });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.application;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'testimonials') {
      const res = await http(`/testimonials/admin/${id}`, { method: 'PUT', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.testimonial;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'faqs') {
      const res = await http(`/faqs/admin/${id}`, { method: 'PUT', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.faq;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'blogs') {
      const res = await http(`/blogs/admin/${id}`, { method: 'PUT', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const u = j.blog;
      return { data: { ...u, id: u.id } as any } as any;
    }
    if (resource === 'settings') {
      const res = await http('/settings/admin', { method: 'PUT', body });
      if (!res.ok) throw new Error('Failed');
      const j = await res.json();
      const s = j.settings;
      return { data: { ...s, id: s.key } as any } as any;
    }
    throw new Error('Not supported');
  },
  delete: async (resource, params) => {
    const id = (params as any).id as string;
    if (resource === 'universities') {
      const res = await http(`/universities/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return { data: ({ id } as any) } as any;
    }
    if (resource === 'applications') {
      const res = await http(`/applications/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return { data: ({ id } as any) } as any;
    }
    if (resource === 'testimonials') {
      const res = await http(`/testimonials/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return { data: ({ id } as any) } as any;
    }
    if (resource === 'faqs') {
      const res = await http(`/faqs/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return { data: ({ id } as any) } as any;
    }
    if (resource === 'blogs') {
      const res = await http(`/blogs/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      return { data: ({ id } as any) } as any;
    }
    throw new Error('Not supported');
  },
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] })
};

export default dataProvider;
