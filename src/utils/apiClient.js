const API_BASE = '/api';

export async function apiPost(path, body, headers = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...headers,
      ...((body && !(body instanceof FormData)) ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data?.message || response.statusText || 'API request failed';
    throw new Error(error);
  }
  return data;
}

export async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, { method: 'GET' });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data?.message || response.statusText || 'API request failed';
    throw new Error(error);
  }
  return data;
}
