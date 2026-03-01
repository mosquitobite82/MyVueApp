/**
 * Base URL for the .NET backend. Loaded from workspace root .env (VITE_API_URL).
 */
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5215';

export interface HelloResponse {
  message: string;
  timestamp: string;
}

/**
 * Calls GET /api/hello on the backend to verify the connection.
 * @throws on network error or non-2xx response
 */
export async function fetchHello(): Promise<HelloResponse> {
  const res = await fetch(`${API_BASE}/api/hello`, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Backend returned ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<HelloResponse>;
}
