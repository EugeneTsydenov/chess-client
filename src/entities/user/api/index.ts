'use server';

import { $authApi } from '@shared/api';

const USER_ROUTE = '/users';

export const session = async () => {
  return await $authApi.get(`${USER_ROUTE}/me`);
};
