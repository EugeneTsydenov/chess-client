'use client';

import { AuthFormWrapper } from '@entities/auth';
import { Button, Form, FormFieldCheckbox, FormFieldInput } from '@shared/ui';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';

const RegisterForm = () => {
  const form = useForm();

  const t = useTranslations('register_page.form');

  return (
    <AuthFormWrapper action="Registration">
      <Form {...form}>
        <form className="w-full">
          <div className="flex-col gap-4 flex">
            <div className="xl:flex xl:justify-between gap-2">
              <FormFieldInput
                control={form.control}
                name="username"
                type="text"
                placeholder={t('username_input_placeholder')}
                label={t('username_input_label')}
                description={t('username_input_description')}
                className="xl:w-2/3"
              />
              <FormFieldInput
                control={form.control}
                name="displayName"
                type="text"
                placeholder={t('display_name_input_placeholder')}
                label={t('display_name_input_label')}
                description={t('display_name_input_description')}
                className="xl:w-2/4"
              />
            </div>
            <FormFieldInput
              control={form.control}
              name="email"
              type="text"
              label={t('email_input_label')}
              description={t('email_input_description')}
              placeholder={t('email_input_placeholder')}
            />
            <div className="xl:flex xl:justify-between gap-2">
              <FormFieldInput
                control={form.control}
                name="password"
                label={t('password_input_label')}
                placeholder={t('password_input_placeholder')}
                type="text"
                className="xl:w-1/2"
              />
              <FormFieldInput
                control={form.control}
                name="confirmPassword"
                label={t('confirm_password_input_label')}
                placeholder={t('confirm_password_input_placeholder')}
                type="text"
                className="xl:w-1/2"
              />
            </div>
            <FormFieldCheckbox
              name="terms"
              control={form.control}
              className="mt-3"
              label={t('terms_checkbox_label')}
              description={t('terms_checkbox_description')}
            />
            <Button type="submit">{t('register_btn')}</Button>
          </div>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default RegisterForm;
