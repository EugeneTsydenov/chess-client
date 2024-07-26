'use client';

import { AuthFormWrapper } from '@entities/auth';
import {
  Button,
  Form,
  FormFieldCheckbox,
  FormFieldInput,
  Link,
} from '@shared/ui';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const form = useForm();

  const t = useTranslations('login_page.form');

  return (
    <AuthFormWrapper action="Login">
      <Form {...form}>
        <form>
          <FormFieldInput
            control={form.control}
            name="username"
            type="text"
            placeholder={t('username_input_placeholder')}
            label={t('username_input_label')}
            className="mb-5"
          />
          <FormFieldInput
            control={form.control}
            name="password"
            type="password"
            placeholder={t('password_input_placeholder')}
            label={t('password_input_label')}
          />
          <div className="mt-7 flex items-center justify-between">
            <FormFieldCheckbox
              name="rememberMe"
              className="cursor-pointer"
              label={t('remember_me_checkbox_label')}
            />
            <Link href="#" className="hover:underline text-base font-medium">
              {t('forgot_password')}
            </Link>
          </div>
          <Button className="mt-7 w-full" type="submit">
            {t('login_btn')}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default LoginForm;
