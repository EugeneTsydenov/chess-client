'use server';

import { register, RegisterFormSchemaType } from '@entities/auth';

export const registerAction = async (
  data: Omit<RegisterFormSchemaType, 'terms'>,
) => {
  const res = await register(data);
  console.log(res);
  return { ok: res.ok, data: res.data, statusCode: res.statusCode };
};
