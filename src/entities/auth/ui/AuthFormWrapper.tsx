import { ComponentWithChildren } from '@shared/types';
import { CardContent, CardFooter, CardTitle, Link } from '@shared/ui';
import { useTranslations } from 'next-intl';
import * as React from 'react';

interface AuthFormWrapperProps extends ComponentWithChildren {
  action: 'Registration' | 'Login';
}

const AuthFormWrapper = ({ action, children }: AuthFormWrapperProps) => {
  const t = useTranslations();
  return (
    <>
      <CardTitle className="font-semibold tracking-tight text-2xl mb-5">
        {action === 'Registration'
          ? t('register_page.title')
          : t('login_page.title')}
      </CardTitle>
      <CardContent>{children}</CardContent>
      <CardFooter>
        {action === 'Registration' && (
          <p className="text-base mt-5">
            {t('register_page.have_account')}
            <Link href="/login" className="text-base ml-1">
              {t('login')}
            </Link>
          </p>
        )}
        {action === 'Login' && (
          <p className="text-base mt-5">
            {t('login_page.not_have_account')}
            <Link href="/register" className="text-base ml-1">
              {t('register')}
            </Link>
          </p>
        )}
      </CardFooter>
    </>
  );
};

export default AuthFormWrapper;
