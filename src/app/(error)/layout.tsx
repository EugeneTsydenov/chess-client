import { ComponentWithChildren } from '@shared/lib';
import * as React from 'react';

const Layout = ({ children }: ComponentWithChildren) => {
  return <div>error {children}</div>;
};

export default Layout;
