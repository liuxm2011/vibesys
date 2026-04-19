/**
 * HTTP request utility with credentials for httpOnly cookie (D-12)
 * Uses fetch API with credentials: 'include' to auto-attach cookies
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

function getApiBaseUrl(): string {
  const rawBase = import.meta.env.VITE_API_BASE_URL?.trim() || '';
  return rawBase.replace(/\/+$/, '');
}

export function resolveApiUrl(url: string): string {
  if (!url.startsWith('/api')) {
    return url;
  }

  const base = getApiBaseUrl();
  // Default to relative /api so Vite dev proxy can handle local development.
  return base ? `${base}${url}` : url;
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

  const apiUrl = resolveApiUrl(url);

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

  try {
    const response = await fetch(apiUrl, fetchOptions);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('服务器响应格式错误');
    }

    const data = await response.json();

    if (!response.ok) {
      // Throw error with API message for UI display (D-20)
      throw new Error(data.error || '请求失败');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络');
    }
    throw error;
  }
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
