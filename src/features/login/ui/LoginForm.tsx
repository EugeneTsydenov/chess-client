'use client';

import {
  AuthFormWrapper,
  loginFormSchema,
  LoginFormSchemaType,
} from '@entities/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError, handleValidationError, toast } from '@shared/lib';
import {
  Button,
  Form,
  FormFieldCheckbox,
  FormFieldInput,
  Link,
} from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { loginAction } from '../actions';

const LoginForm = () => {
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
  });
  const t = useTranslations();
  const formT = useTranslations('login_page.form');

  const router = useRouter();
  const locale = useLocale();

  const handleLoginSuccess = () => {
    toast(formT('success_message'));
    router.push('/');
  };

  const handleLoginError = (err: any) => {
    const statusCode = err.statusCode;

    handleError(
      statusCode,
      {
        '[401, 404]': () => {
          const errors: Array<{
            field: 'username' | 'password';
            message: string;
          }> = err.data[locale].errors;
          handleValidationError(errors, form.setError);
        },
        500: () => {
          toast(t('server_error'), { type: 'error' });
        },
      },
      () => {
        toast(t('unknown_error'), {
          type: 'error',
        });
      },
    );
  };

  const onSubmit = async (credentials: LoginFormSchemaType) => {
    try {
      const response = await loginAction(credentials);
      if (response.ok) {
        handleLoginSuccess();
      } else {
        handleLoginError(response);
      }
    } catch (e: any) {
      console.error(e);
      handleLoginError(e);
    }
  };

  return (
    <AuthFormWrapper action="Login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormFieldInput
            control={form.control}
            name="username"
            type="text"
            placeholder={formT('username_input_placeholder')}
            label={formT('username_input_label')}
            className="mb-5"
          />
          <FormFieldInput
            control={form.control}
            name="password"
            type="password"
            placeholder={formT('password_input_placeholder')}
            label={formT('password_input_label')}
          />
          <div className="mt-7 flex items-center justify-between">
            <FormFieldCheckbox
              name="rememberMe"
              className="cursor-pointer"
              label={formT('remember_me_checkbox_label')}
            />
            <Link href="#" className="hover:underline text-base font-medium">
              {formT('forgot_password')}
            </Link>
          </div>
          <Button className="mt-7 w-full" type="submit">
            {formT('login_btn')}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default LoginForm;
