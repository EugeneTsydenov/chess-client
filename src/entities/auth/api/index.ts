import { $authApi } from '@shared/api';
import { cookies } from 'next/headers';

import {
  LoginResponseType,
  RefreshResponseType,
  VerifyResponseType,
} from '../model';

export class AuthApi {
  public static async verify() {
    return await $authApi.get<VerifyResponseType>('/verify');
  }

  public static async refresh() {
    const refreshToken = cookies().get('refreshToken');

    return await $authApi.post<RefreshResponseType>('/refresh', {
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
    return await $authApi.post<LoginResponseType>('/login', {
      body: credentials,
    });
  }
}
