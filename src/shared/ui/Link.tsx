import NextLink from 'next/link';
import * as React from 'react';

import { cn } from '../lib';
import { ComponentWithChildren } from '../types';

interface LinkProps extends ComponentWithChildren {
  href: string;
  className?: string;
}

const Link = ({ href, children, className }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={cn(
        'text-primary transition-all hover:underline ease-in-out delay-200',
        className,
      )}
    >
      {children}
    </NextLink>
  );
};

export default Link;
