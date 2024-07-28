import { cookies } from 'next/headers';

import { $baseApi } from '../base';

export const $authApi = $baseApi.create();

$authApi.interceptor.useRequest({
  async onFulfilled(config) {
    const accessToken =
      typeof window === 'undefined' && cookies().get('accessToken');

    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken.value}` };
    } else {
      config.headers = { Authorization: `Bearer huo` };
    }

    return config;
  },
});
