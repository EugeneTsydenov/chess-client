'use server';

import { login, LoginFormSchemaType } from '@entities/auth';
import { cookies } from 'next/headers';

export const loginAction = async (credentials: LoginFormSchemaType) => {
  const response = await login(credentials);
  const data = response.data;

  if (response.ok) {
    if (data.cookies) {
      cookies().set(data.cookies.accessToken);
      if (data.cookies.refreshToken) {
        cookies().set(data.cookies.refreshToken);
      }
    }

    return {
      statusCode: response.statusCode,
      ok: response.ok,
      data: { user: data.user },
    };
  }

  return {
    statusCode: response.statusCode,
    ok: response.ok,
    data: response.data,
  };
};
