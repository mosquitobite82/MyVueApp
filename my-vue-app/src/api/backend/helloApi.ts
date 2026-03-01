/**
 * In dev we use relative URL so Vite proxies to the backend. In prod use VITE_API_URL.
 */
const API_BASE = import.meta.env.DEV
  ? ''
  : ((import.meta.env.VITE_API_URL as string | undefined) || '');

export interface HelloResponse {
  message: string;
  timestamp: string;
}

/**
 * Calls GET /api/hello on the backend to verify the connection.
 * @throws on network error or non-2xx response
 */
export async function fetchHello(): Promise<HelloResponse> {
  const base = (API_BASE || '').replace(/\/$/, '');
  const url = base ? `${base}/api/hello` : '/api/hello';
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Backend returned ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<HelloResponse>;
}
