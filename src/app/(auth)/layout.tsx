import { ComponentWithChildren } from '@shared/lib';
import * as React from 'react';

const Layout = ({ children }: ComponentWithChildren) => {
  return <div>authenticated {children}</div>;
};

export default Layout;
