interface ApiOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(status: number, data: any, message: string) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { data, params, headers, ...customConfig } = options;

  let origin = '';
  if (typeof window !== 'undefined') {
    origin = window.location.origin;
  } else {
    origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  const path = endpoint.startsWith('http') ? endpoint : `${origin}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const url = new URL(path);

  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, String(params[key]));
      }
    });
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url.toString(), config);

  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    responseData = null;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status, 
      responseData, 
      responseData?.message || response.statusText || 'An error occurred during the API request'
    );
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'data'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'method' | 'data'>) =>
    request<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'method' | 'data'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', data }),
  patch: <T>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'method' | 'data'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', data }),
  delete: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'data'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
