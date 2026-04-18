import { runtimeStubApiFetch } from './runtimeStubApi';

const useBackendIntegration = import.meta.env.VITE_ENABLE_BACKEND_INTEGRATION === 'true';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (!useBackendIntegration) {
    return runtimeStubApiFetch<T>(path, options);
  }

  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) {
    return null as T;
  }
  const text = await res.text().catch(() => '');
  if (!text) {
    return null as T;
  }
  return JSON.parse(text) as T;
}
