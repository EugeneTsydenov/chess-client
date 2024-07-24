import { HTTP_METHOD } from 'next/dist/server/web/http';

export interface IHttp<instance> {
  defaultConfig: Config;
  create(defaultConfig: Omit<Config, 'method'>): instance;
  fetch<returnedData>(
    url: string,
    config?: Omit<Config, 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  post<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  get<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  put<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  patch<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  delete<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  head<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
  options<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>>;
}

export interface FetchNext {
  revalidate?: number | false;
  tag: string[];
}

export interface Config {
  baseUrl?: string;
  credentials?: RequestCredentials;
  next?: FetchNext;
  mode?: RequestMode;
  cache?:
    | 'default'
    | 'no-store'
    | 'reload'
    | 'no-cache'
    | 'force-cache'
    | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  timeout?: number;
  headers?: HeadersInit;
  body?: Record<string, unknown>;
  priority?: RequestPriority;
  method?: HTTP_METHOD;
  retry?: {
    retries: number;
    delay: number;
  };
}

export interface OriginalConfig {
  url: string;
  config: Omit<Config, 'baseUrl'>;
}

export interface HttpResponse<returnedData> {
  ok: boolean;
  headers: Headers;
  redirected: boolean;
  statusCode: number;
  statusText: string;
  type: ResponseType;
  url: string;
  data: returnedData;
  originalRequest: OriginalConfig;
  clone(): Response;
}

export interface RequestInterceptor {
  onFulfilled(config: Config): Promise<Config>;
  onRejected?: (err: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled(response: HttpResponse<any>): Promise<HttpResponse<any>>;
  onRejected?: (err: any) => any;
}
