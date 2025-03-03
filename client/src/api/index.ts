const baseURL = 'http://localhost:4000'; // TODO

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  search?: Record<string, string | number | boolean>;

  onSettled?: () => void;
  onError?: (error: unknown) => void;
}

interface RequestEndpointConfig {
  requireAuth?: boolean;
  method?: RequestMethod;
  raw?: boolean;
  priority?: RequestPriority;
  dissociateWindow?: boolean;
  headers?: Record<string, string>;
}

type ApiReturnType<T, Options> = (Options extends { raw: true } ? Response : T) | undefined;

export function apiClient<T = unknown>(endpoint: string, config?: RequestEndpointConfig) {
  return async function (options?: RequestOptions): Promise<ApiReturnType<T, typeof options>> {
    let endpointUrl = endpoint;
    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        endpointUrl = endpointUrl.replace(`:${key}`, value.toString());
      }
    }

    if (options?.search) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(options.search)) {
        searchParams.append(key, value.toString());
      }
      endpointUrl += `?${searchParams.toString()}`;
    }

    const token = window.localStorage.getItem('token');
    if (config?.requireAuth && !token) {
      const details = { endpointUrl, error: 'You are not logged in, please log in and try again' };
      if (!options?.onError) throw new Error(details.error);
      options.onError(details.error);
    }

    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
      ...config?.headers,
    });

    const res = await fetch(baseURL + endpointUrl, {
      headers,
      credentials: 'include',
      method: config?.method ?? 'GET',
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      ...(config?.priority ? { priority: config.priority } : {}),
      ...(config?.dissociateWindow ? { window: null } : {}),
    });

    if (!res.ok) {
      console.error(res);
      if (!options?.onError) throw new Error("Couldn't fetch data from the server");
      options.onError(res);
      return undefined;
    }

    if (config?.raw) return res as ApiReturnType<T, typeof options>;

    const resJson: unknown = await res.json();
    if (resJson instanceof Error) {
      if (!options?.onError) throw resJson;

      options.onError(resJson);
      return undefined;
    }

    return resJson as T;
  };
}
