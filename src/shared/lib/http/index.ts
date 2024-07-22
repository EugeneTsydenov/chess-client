import { BASE_API_URL } from '../constants';

interface FetchWrapperArgs {
  url?: string;
  method?:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';
  body?: Record<string, unknown>;
  headers?: HeadersInit;
  next?: { revalidate?: number | false; tags?: string[] };
  credentials?: RequestCredentials;
}

type FetchWrapper = (options: FetchWrapperArgs) => Promise<Response>;

type HandleFetchResponse = (response: Response) => Promise<Response>;

type Post = (options: Omit<FetchWrapperArgs, 'method'>) => Promise<Response>;
type Get = (
  options: Omit<FetchWrapperArgs, 'method' | 'body'>,
) => Promise<Response>;
type Put = (options: Omit<FetchWrapperArgs, 'method'>) => Promise<Response>;
type Patch = (options: Omit<FetchWrapperArgs, 'method'>) => Promise<Response>;
type Delete = (
  options: Omit<FetchWrapperArgs, 'method' | 'body'>,
) => Promise<Response>;

const handleFetchResponse: HandleFetchResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
  }
  return response;
};

export const fetchWrapper: FetchWrapper = async ({
  url = '',
  method = 'GET',
  body,
  headers,
  next,
  credentials = 'include',
}) => {
  const response = await fetch(`${BASE_API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials,
    next,
    body: JSON.stringify(body),
  });

  return handleFetchResponse(response);
};

export const post: Post = async (options) =>
  await fetchWrapper({ method: 'POST', ...options });

export const get: Get = async (options) =>
  await fetchWrapper({ method: 'GET', ...options });

export const put: Put = async (options) =>
  await fetchWrapper({ method: 'PUT', ...options });

export const patch: Patch = async (options) =>
  await fetchWrapper({ method: 'PATCH', ...options });

export const del: Delete = async (options) =>
  await fetchWrapper({ method: 'PATCH', ...options });
