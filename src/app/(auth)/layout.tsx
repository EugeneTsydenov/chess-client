import { ComponentWithChildren } from '@shared/types';
import { Card, Link, Logo } from '@shared/ui';
import * as React from 'react';

const Layout = ({ children }: ComponentWithChildren) => {
  return (
    <main className="bg-background h-screen">
      <div className="container p-[0.7rem]">
        <div className="flex w-full items-center justify-center flex-col gap-10 pt-6">
          <Link
            href="/"
            className="text-4xl font-bold tracking-tight hover:no-underline"
          >
            <Logo />
          </Link>
          <Card className="rounded-xl border bg-card text-card-foreground shadow p-6 w-full sm:w-2/3 lg:w-[48%]">
            {children}
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Layout;
