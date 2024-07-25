import { ComponentWithChildren } from '@shared/types';
import * as React from 'react';

const Layout = ({ children }: ComponentWithChildren) => {
  return <div>authenticated {children}</div>;
};

export default Layout;
