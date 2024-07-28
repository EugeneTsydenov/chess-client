'use server';

import { $authApi } from '@shared/api';
import { cookies } from 'next/headers';

import {
  LoginResponseType,
  RefreshResponseType,
  VerifyResponseType,
} from '../model';

const AUTH_ROUTE = '/auth';

export const verify = async () =>
  await $authApi.get<VerifyResponseType>(`${AUTH_ROUTE}/verify`);

export const refresh = async () => {
  const refreshToken = cookies().get('refreshToken');

  return await $authApi.post<RefreshResponseType>(`${AUTH_ROUTE}/refresh`, {
    headers: {
      Cookie: `refreshToken=${refreshToken?.value}; httpOnly=true;`,
    },
  });
};

export const login = async (credentials: {
  username: string;
  password: string;
  rememberMe: boolean;
}) =>
  await $authApi.post<LoginResponseType>(`${AUTH_ROUTE}/login`, {
    body: credentials,
  });
