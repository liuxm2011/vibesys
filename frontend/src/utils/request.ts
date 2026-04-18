/**
 * HTTP request utility with credentials for httpOnly cookie (D-12)
 * Uses fetch API with credentials: 'include' to auto-attach cookies
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Make HTTP request with automatic cookie handling
 * @param url API endpoint path (e.g., '/api/auth/login')
 * @param options Request options
 * @returns Response data
 * @throws Error with message from API if status >= 400
 */
export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: 'include',  // D-12: Auto-attach httpOnly cookies
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (!response.ok) {
    // Throw error with API message for UI display (D-20)
    throw new Error(data.error || '请求失败');
  }

  return data;
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body }),
  put: <T>(url: string, body: unknown) => request<T>(url, { method: 'PUT', body }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};