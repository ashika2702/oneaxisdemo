/* ────────────────────────────────────────────────
   ONEAXIS API CLIENT
   Centralized HTTP client for backend integration.
   Wraps fetch with auth, error handling, retries.
   ──────────────────────────────────────────── */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

function getToken(): string | null {
  return localStorage.getItem('oneaxis_token');
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const status = response.status;

    if (status === 401) {
      localStorage.removeItem('oneaxis_token');
      window.location.href = '/#/login';
      return { data: null, error: 'Unauthorized. Please log in again.', status };
    }

    if (status === 204) {
      return { data: null, error: null, status };
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        data: null,
        error: data?.error || data?.message || `HTTP ${status} error`,
        status,
      };
    }

    return { data, error: null, status };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error. Is the backend running?',
      status: 0,
    };
  }
}

// File upload with multipart/form-data
export async function uploadFile(endpoint: string, file: File, extraFields?: Record<string, string>): Promise<ApiResponse<any>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const formData = new FormData();
  formData.append('file', file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return { data: null, error: data?.error || `HTTP ${response.status}`, status: response.status };
    }
    return { data, error: null, status: response.status };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Upload failed', status: 0 };
  }
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/login', { method: 'POST', body: { email, password }, skipAuth: true }),
  register: (name: string, email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/register', { method: 'POST', body: { name, email, password }, skipAuth: true }),
  me: () => apiRequest<any>('/auth/me'),
};

// Project APIs
export const projectApi = {
  list: () => apiRequest<any[]>('/projects'),
  get: (id: string) => apiRequest<any>(`/projects/${id}`),
  create: (data: any) => apiRequest<any>('/projects', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<any>(`/projects/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<void>(`/projects/${id}`, { method: 'DELETE' }),
  updateUnit: (projectId: string, unitId: string, updates: any) =>
    apiRequest<any>(`/projects/${projectId}/units/${unitId}`, { method: 'PATCH', body: updates }),
  getEditHistory: (projectId: string) => apiRequest<any[]>(`/projects/${projectId}/history`),
};

// File APIs
export const fileApi = {
  upload: (projectId: string, file: File) =>
    uploadFile(`/projects/${projectId}/files`, file),
  list: (projectId: string) => apiRequest<any[]>(`/projects/${projectId}/files`),
  delete: (projectId: string, fileId: string) =>
    apiRequest<void>(`/projects/${projectId}/files/${fileId}`, { method: 'DELETE' }),
};

// AI APIs
export const aiApi = {
  parsePlan: (fileId: string) => apiRequest<any>('/ai/parse-plan', { method: 'POST', body: { fileId } }),
  chat: (projectId: string, message: string, history: any[]) =>
    apiRequest<{ response: string }>('/ai/chat', { method: 'POST', body: { projectId, message, history } }),
  generateOptions: (projectId: string, prompt: string) =>
    apiRequest<any>('/ai/generate-options', { method: 'POST', body: { projectId, prompt } }),
};

// Widget APIs
export const widgetApi = {
  create: (projectId: string, config: any) =>
    apiRequest<any>('/widgets', { method: 'POST', body: { projectId, ...config } }),
  list: () => apiRequest<any[]>('/widgets'),
  update: (id: string, config: any) => apiRequest<any>(`/widgets/${id}`, { method: 'PUT', body: config }),
  delete: (id: string) => apiRequest<void>(`/widgets/${id}`, { method: 'DELETE' }),
};

// Proposal APIs
export const proposalApi = {
  create: (projectId: string, config: any) =>
    apiRequest<any>('/proposals', { method: 'POST', body: { projectId, ...config } }),
  list: () => apiRequest<any[]>('/proposals'),
  get: (id: string) => apiRequest<any>(`/proposals/${id}`),
};
