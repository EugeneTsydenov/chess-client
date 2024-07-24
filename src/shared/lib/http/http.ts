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
  };
  interceptor: Interceptor = new Interceptor();

  create(defaultConfig?: Config): HttpInstance {
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

  async fetch<ReturnedData>(
    url: string,
    config?: Omit<Config, 'baseUrl'>,
  ): Promise<HttpResponse<ReturnedData>> {
    const controller = new AbortController();
    const timeout = config?.timeout ?? this.defaultConfig.timeout;

    const timeoutId = timeout
      ? setTimeout(() => controller.abort(), timeout)
      : null;

    try {
      const requestConfig = this.mergeConfigs(this.defaultConfig, config);
      const modifiedConfig =
        await this.interceptor.applyFulfilledRequest(requestConfig);
      const mergedUrls = `${this.defaultConfig.baseUrl ?? ''}${url}`;
      const response = await fetch(mergedUrls, {
        headers: modifiedConfig.headers,
        credentials: modifiedConfig.credentials,
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
}

export const http = new HttpInstance();
