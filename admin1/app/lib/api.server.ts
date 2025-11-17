const API_URL = process.env.API_URL || "http://localhost:8787";

export async function apiRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

export const adminApi = {
  universities: {
    getAll: (token: string) => apiRequest("/api/universities", token),
    getById: (id: string, token: string) => apiRequest(`/api/universities/${id}`, token),
    create: (data: any, token: string) =>
      apiRequest("/api/universities", token, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/universities/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      apiRequest(`/api/universities/${id}`, token, {
        method: "DELETE",
      }),
  },

  programs: {
    getAll: (token: string) => apiRequest("/api/programs", token),
    create: (data: any, token: string) =>
      apiRequest("/api/programs", token, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/programs/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      apiRequest(`/api/programs/${id}`, token, {
        method: "DELETE",
      }),
  },

  gallery: {
    getAll: (token: string) => apiRequest("/api/gallery", token),
    create: (data: any, token: string) =>
      apiRequest("/api/gallery", token, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      apiRequest(`/api/gallery/${id}`, token, {
        method: "DELETE",
      }),
  },

  applications: {
    getAll: (token: string, status?: string) => {
      const params = status ? `?status=${status}` : "";
      return apiRequest(`/api/applications${params}`, token);
    },
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/applications/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  messages: {
    getAll: (token: string) => apiRequest("/api/messages", token),
    markAsRead: (id: string, token: string) =>
      apiRequest(`/api/messages/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ isRead: true }),
      }),
    delete: (id: string, token: string) =>
      apiRequest(`/api/messages/${id}`, token, {
        method: "DELETE",
      }),
  },

  content: {
    getAll: (token: string) => apiRequest("/api/content", token),
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/content/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  prices: {
    get: (token: string) => apiRequest("/api/prices", token),
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/prices/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};
