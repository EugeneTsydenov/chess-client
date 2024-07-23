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
  signal?: AbortSignal;
}

interface EnhancedResponse<returnedData> {
  ok: boolean;
  headers: Headers;
  redirected: boolean;
  statusCode: number;
  statusText: string;
  type: ResponseType;
  url: string;
  data: returnedData;
  clone(): Response;
}

type FetchWrapper = <returnedData>(
  options: FetchWrapperArgs,
) => Promise<EnhancedResponse<returnedData>>;

type Post = <returnedData>(
  options: Omit<FetchWrapperArgs, 'method'>,
) => Promise<EnhancedResponse<returnedData>>;
type Get = <returnedData>(
  options: Omit<FetchWrapperArgs, 'method' | 'body'>,
) => Promise<EnhancedResponse<returnedData>>;
type Put = <returnedData>(
  options: Omit<FetchWrapperArgs, 'method'>,
) => Promise<EnhancedResponse<returnedData>>;
type Patch = <returnedData>(
  options: Omit<FetchWrapperArgs, 'method'>,
) => Promise<EnhancedResponse<returnedData>>;
type Delete = <returnedData>(
  options: Omit<FetchWrapperArgs, 'method' | 'body'>,
) => Promise<EnhancedResponse<returnedData>>;

interface HTTP {
  fetch: FetchWrapper;
  post: Post;
  get: Get;
  put: Put;
  patch: Patch;
  delete: Delete;
}

const fetchWrapper: FetchWrapper = async <returnedData>({
  url = '',
  method = 'GET',
  body,
  headers,
  next,
  credentials = 'include',
  signal,
}: FetchWrapperArgs) => {
  const controller = new AbortController();
  const { signal: controllerSignal } = controller;

  const fetchSignal = signal || controllerSignal;

  const response = await fetch(`${BASE_API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials,
    next,
    body: body ? JSON.stringify(body) : undefined,
    signal: fetchSignal,
  });

  const parsedResponse: EnhancedResponse<returnedData> = {
    ok: response.ok,
    data: (await response.json()) as returnedData,
    statusCode: response.status,
    statusText: response.statusText,
    clone: response.clone,
    type: response.type,
    url: response.url,
    headers: response.headers,
    redirected: response.redirected,
  };

  return parsedResponse;
};

const post: Post = async <returnedData>(
  options: Omit<FetchWrapperArgs, 'method'>,
) => await fetchWrapper<returnedData>({ method: 'POST', ...options });

const get: Get = async <returnedData>(
  options: Omit<FetchWrapperArgs, 'method' | 'body'>,
) => await fetchWrapper<returnedData>({ method: 'GET', ...options });

const put: Put = async <returnedData>(
  options: Omit<FetchWrapperArgs, 'method'>,
) => await fetchWrapper<returnedData>({ method: 'PUT', ...options });

const patch: Patch = async <returnedData>(
  options: Omit<FetchWrapperArgs, 'method'>,
) => await fetchWrapper<returnedData>({ method: 'PATCH', ...options });

const del: Delete = async <returnedData>(
  options: Omit<FetchWrapperArgs, 'method' | 'body'>,
) => await fetchWrapper<returnedData>({ method: 'DELETE', ...options });

export const http: HTTP = {
  post,
  get,
  put,
  patch,
  delete: del,
  fetch: fetchWrapper,
};
