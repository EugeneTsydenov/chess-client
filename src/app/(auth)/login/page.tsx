import { AuthApi } from '@shared/api';
import { cookies } from 'next/headers';
import * as React from 'react';

const login = async () => {
  try {
    const res = await AuthApi.login({
      username: 'Messi',
      password: 'Messi212_',
      rememberMe: true,
    });

    if (res.ok) {
      const data = res.data;
      cookies().set(data.cookies.accessToken);
      if (data.cookies.refreshToken) {
        cookies().set(data.cookies.refreshToken);
      }

      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

const Page: React.FC = () => {
  const action = async () => {
    'use server';
    await login();
  };

  return (
    <form action={action}>
      <button type="submit">login</button>
    </form>
  );
};

export default Page;
