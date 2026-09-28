const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('trackops_token') || localStorage.getItem('cpaas_auth_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // If endpoint already starts with /api, don't duplicate
  const urlPath = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;

  const url = cleanEndpoint.startsWith('http')
    ? cleanEndpoint
    : `${API_BASE}${urlPath}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies
    });

    if (res.status === 401 && typeof window !== 'undefined' && !cleanEndpoint.includes('/auth/')) {
      console.warn('Session expired or unauthorized.');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error || data?.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    throw err;
  }
}
