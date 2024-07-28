'use client';

import {
  AuthFormWrapper,
  registerFormSchema,
  RegisterFormSchemaType,
} from '@entities/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError, handleValidationError, toast } from '@shared/lib';
import { Button, Form, FormFieldCheckbox, FormFieldInput } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { registerAction } from '../actions';

const RegisterForm = () => {
  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
  });
  const t = useTranslations();
  const formT = useTranslations('register_page.form');
  const locale = useLocale();
  const router = useRouter();

  const handleSuccessRegister = () => {
    toast(formT('success_message'));
    router.push('/login');
  };

  const handleRegisterError = (err: any) => {
    const statusCode = err.statusCode;
    console.log(err.data);
    handleError(
      statusCode,
      {
        409: () => {
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

  const onSubmit = async (data: RegisterFormSchemaType) => {
    try {
      const res = await registerAction(data);

      if (res.ok) {
        handleSuccessRegister();
        return;
      }

      handleRegisterError({ statusCode: res.statusCode, data: res.data });
    } catch (e) {
      console.log(e, 'error');
      handleRegisterError(e);
    }
  };

  return (
    <AuthFormWrapper action="Registration">
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-col gap-4 flex">
            <div className="xl:flex xl:justify-between gap-2">
              <FormFieldInput
                control={form.control}
                name="username"
                type="text"
                placeholder={formT('username_input_placeholder')}
                label={formT('username_input_label')}
                description={formT('username_input_description')}
                className="xl:w-2/3"
              />
              <FormFieldInput
                control={form.control}
                name="displayName"
                type="text"
                placeholder={formT('display_name_input_placeholder')}
                label={formT('display_name_input_label')}
                description={formT('display_name_input_description')}
                className="xl:w-2/4"
              />
            </div>
            <FormFieldInput
              control={form.control}
              name="email"
              type="text"
              label={formT('email_input_label')}
              description={formT('email_input_description')}
              placeholder={formT('email_input_placeholder')}
            />
            <div className="xl:flex xl:justify-between gap-2">
              <FormFieldInput
                control={form.control}
                name="password"
                label={formT('password_input_label')}
                placeholder={formT('password_input_placeholder')}
                type="password"
                className="xl:w-1/2"
              />
              <FormFieldInput
                control={form.control}
                name="confirmPassword"
                label={formT('confirm_password_input_label')}
                placeholder={formT('confirm_password_input_placeholder')}
                type="password"
                className="xl:w-1/2"
              />
            </div>
            <FormFieldCheckbox
              name="terms"
              control={form.control}
              className="mt-3"
              label={formT('terms_checkbox_label')}
              description={formT('terms_checkbox_description')}
            />
            <Button type="submit">{formT('register_btn')}</Button>
          </div>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default RegisterForm;
