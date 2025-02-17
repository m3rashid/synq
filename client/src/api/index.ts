import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:4000';
const API_URL = import.meta.env.BASE_URL || DEFAULT_API_URL;

export async function apiClient(endpoint: string, options?: AxiosRequestConfig & { requireAuth?: boolean }) {
  const requireAuth = options?.requireAuth === undefined ? true : options.requireAuth;

  const token = localStorage.getItem('token');
  if (requireAuth && !token) {
    const details = { endpoint, error: 'You are not logged in, please log in and try again' };
    console.error(details);
    // TODO: we can explicitly redirect the user to the login page, or reset the state, etc.
    return Promise.reject(new Error(details.error));
  }

  return axios({
    baseURL: options?.baseURL || API_URL,
    url: endpoint,
    method: options?.method ?? 'GET',
    withCredentials: true,
    ...(options || {}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
      ...(requireAuth ? { Authorization: token } : {}),
    },
  });
}

export type ApiClientParams = Parameters<typeof apiClient>;
