const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cpaas_auth_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && typeof window !== 'undefined' && !endpoint.includes('/auth/')) {
      console.warn('Session expired or unauthorized. Please log in.');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    throw err;
  }
}
