'use server';

import { cookies } from 'next/headers';

export type Locale = (typeof locales)[number];

const locales = ['en', 'de'] as const;

const DEFAULT_LOCALE = 'en';

const COOKIE_NAME = 'lang';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale);
}
