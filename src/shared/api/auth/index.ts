import { cookies } from 'next/headers';

import { $baseApi } from '../base';

const $authApi = $baseApi.create({
  baseUrl: '/auth',
});

$authApi.interceptor.useRequest({
  async onFulfilled(config) {
    const accessToken =
      typeof window === 'undefined' && cookies().get('accessToken');

    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken.value}` };
    }

    return config;
  },
});

export class AuthApi {
  public static async verify() {
    return await $authApi.get<{ message: string; isAuth: boolean }>('/verify');
  }

  public static async refresh() {
    const refreshToken = cookies().get('refreshToken');

    return await $authApi.post<RefreshData>('/refresh', {
      headers: {
        Cookie: `refreshToken=${refreshToken?.value}; httpOnly=true;`,
      },
    });
  }

  public static async login(credentials: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) {
    return await $authApi.post<RefreshData>('/login', { body: credentials });
  }
}

interface RefreshData {
  message: string;
  cookies: {
    accessToken: {
      value: string;
      httpOnly: boolean;
      name: string;
    };
    refreshToken: {
      value: string;
      httpOnly: boolean;
      name: string;
      maxAge: number;
    };
  };
}
