import _ from 'lodash';

import { Interceptor } from './interceptor';
import { Config, HttpResponse, IHttp, OriginalConfig } from './types';

class HttpInstance implements IHttp<HttpInstance> {
  defaultConfig: Config = {
    baseUrl: '',
    credentials: 'same-origin',
    next: {
      revalidate: false,
      tag: [],
    },
    mode: 'cors',
    cache: 'default',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    priority: 'auto',
    method: 'GET',
    retry: {
      retries: 3, // Number of retries
      delay: 1000, // Delay between retries in milliseconds
    },
  };
  interceptor: Interceptor = new Interceptor();

  create(defaultConfig?: Omit<Config, 'method'>): HttpInstance {
    const mergedConfig = this.mergeConfigs(this.defaultConfig, defaultConfig);
    const newInstance = new HttpInstance();
    newInstance.defaultConfig = mergedConfig;
    return newInstance;
  }

  private mergeConfigs(baseConfig: Config, overrideConfig?: Config): Config {
    const newConfig = _.cloneDeep(baseConfig);
    const newHeaders = {
      ...newConfig.headers,
      ...overrideConfig?.headers,
    };
    const newBaseUrl = `${baseConfig.baseUrl ?? ''}${overrideConfig?.baseUrl ?? ''}`;
    return Object.assign(newConfig, overrideConfig, {
      baseUrl: newBaseUrl,
      headers: newHeaders,
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchWithRetry<ReturnedData>(
    url: string,
    config: Config,
    retries: number,
    delay: number,
  ): Promise<HttpResponse<ReturnedData>> {
    try {
      return await this.performFetch<ReturnedData>(url, config);
    } catch (error) {
      if (retries > 0) {
        await this.delay(delay);
        return this.fetchWithRetry(url, config, retries - 1, delay);
      } else {
        throw error;
      }
    }
  }

  private async performFetch<ReturnedData>(
    url: string,
    config: Config,
  ): Promise<HttpResponse<ReturnedData>> {
    const controller = new AbortController();
    const timeout = config.timeout ?? this.defaultConfig.timeout;
    const timeoutId = timeout
      ? setTimeout(() => controller.abort(), timeout)
      : null;

    try {
      const requestConfig = this.mergeConfigs(this.defaultConfig, config);
      const modifiedConfig = this.mergeConfigs(
        requestConfig,
        await this.interceptor.applyFulfilledRequest(requestConfig),
      );

      const mergedUrls = `${this.defaultConfig.baseUrl ?? ''}${url}`;

      const response = await fetch(mergedUrls, {
        headers: modifiedConfig.headers,
        credentials: modifiedConfig.credentials,
        method: modifiedConfig.method,
        mode: modifiedConfig.mode,
        cache: modifiedConfig.cache,
        redirect: modifiedConfig.redirect,
        referrerPolicy: modifiedConfig.referrerPolicy,
        integrity: modifiedConfig.integrity,
        priority: modifiedConfig.priority,
        body: modifiedConfig.body
          ? JSON.stringify(modifiedConfig.body)
          : undefined,
        next: modifiedConfig.next,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      const convertedResponse = await this.convertResponse<ReturnedData>(
        response,
        {
          url: mergedUrls,
          config: requestConfig,
        },
      );

      return convertedResponse.ok
        ? await this.interceptor.applyFulfilledResponse(convertedResponse)
        : await this.interceptor.applyRejectResponse(convertedResponse);
    } catch (e: any) {
      if (timeoutId) clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return await this.interceptor.applyRejectedRequest(
          new Error('Request timed out'),
        );
      }
      return await this.interceptor.applyRejectedRequest(e);
    }
  }

  async fetch<ReturnedData>(
    url: string,
    config?: Omit<Config, 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    const finalConfig = this.mergeConfigs(this.defaultConfig, config);
    const retries = finalConfig.retry?.retries ?? 0;
    const delay = finalConfig.retry?.delay ?? 0;
    return this.fetchWithRetry(url, finalConfig, retries, delay);
  }

  private async convertResponse<ReturnedData>(
    response: Response,
    config: OriginalConfig,
  ): Promise<HttpResponse<ReturnedData>> {
    return {
      ok: response.ok,
      data: (await response.json()) as ReturnedData,
      statusCode: response.status,
      statusText: response.statusText,
      clone: response.clone.bind(response),
      type: response.type,
      url: response.url,
      headers: response.headers,
      redirected: response.redirected,
      originalRequest: config,
    };
  }

  async post<ReturnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    return await this.fetch(url, { ...config, method: 'POST' });
  }

  async delete<ReturnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    return await this.fetch(url, {
      ...config,
      method: 'DELETE',
    });
  }

  async get<ReturnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    return await this.fetch(url, { ...config, method: 'GET' });
  }

  async patch<ReturnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    return await this.fetch(url, { ...config, method: 'PATCH' });
  }

  async put<ReturnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    return await this.fetch(url, { ...config, method: 'PUT' });
  }

  async head<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>> {
    return await this.fetch(url, { ...config, method: 'HEAD' });
  }

  async options<returnedData>(
    url: string,
    config?: Omit<Config, 'method' | 'body' | 'baseUrl'>,
  ): Promise<HttpResponse<returnedData>> {
    return await this.fetch(url, { ...config, method: 'OPTIONS' });
  }
}

export const $http = new HttpInstance();
