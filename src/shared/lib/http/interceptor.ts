import { deepClone } from '../utils';

import {
  Config,
  HttpResponse,
  RequestInterceptor,
  ResponseInterceptor,
} from './types';

export class Interceptor {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  public useRequest(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  public useResponse(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  public async applyFulfilledRequest(config: Config): Promise<Config> {
    let copiedConfig = deepClone(config);

    for (const interceptor of this.requestInterceptors) {
      copiedConfig = await interceptor.onFulfilled(copiedConfig);
    }

    return copiedConfig;
  }

  public async applyRejectedRequest(err: any): Promise<any> {
    let newError: any = err;

    for (const interceptor of this.requestInterceptors) {
      newError = interceptor.onRejected
        ? await interceptor.onRejected(newError)
        : newError;
    }

    return newError;
  }

  public async applyFulfilledResponse(
    response: HttpResponse<any>,
  ): Promise<HttpResponse<any>> {
    let newResponse: HttpResponse<any> = response;

    for (const interceptor of this.responseInterceptors) {
      newResponse = await interceptor.onFulfilled(newResponse);
    }

    return newResponse;
  }

  public async applyRejectResponse(err: any): Promise<any> {
    let newError: any = err;

    for (const interceptor of this.responseInterceptors) {
      newError = interceptor.onRejected
        ? await interceptor.onRejected(newError)
        : newError;
    }

    return newError;
  }
}
