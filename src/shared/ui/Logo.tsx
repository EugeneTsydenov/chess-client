import * as React from 'react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return <span className={className}>ChessHub.com</span>;
};

export default Logo;
