'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@shared/ui';
import { clsx } from 'clsx';
import { useLocale } from 'next-intl';
import * as React from 'react';

import { Locale, setUserLocale } from '../lib';

const LanguageSelector = () => {
  const locale = useLocale();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Select
      defaultValue={locale}
      onValueChange={async (value: string) => {
        const locale = value as Locale;
        await setUserLocale(locale);
      }}
    >
      <SelectTrigger
        className={clsx(
          'rounded-sm p-2 transition-colors hover:bg-slate-200 w-[200px]',
          isPending && 'pointer-events-none opacity-60',
        )}
      >
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ru">Russian</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
