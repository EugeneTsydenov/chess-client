import { cookies } from 'next/headers';

import { $baseApi } from '../base';

export const $authApi = $baseApi.create({
  baseUrl: '/auth',
});

$authApi.interceptor.useRequest({
  async onFulfilled(config) {
    const accessToken =
      typeof window === 'undefined'
        ? cookies().get('accessToken')?.value
        : 'accessToken';

    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken}` };
    }

    return config;
  },
});
