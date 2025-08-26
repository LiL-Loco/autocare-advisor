import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const Brush2Icon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m13,2.25h-2c-.4,0-.72.32-.74.71l-2.02-.67c-.23-.08-.48-.04-.68.1s-.31.37-.31.61v9c0,.24.12.47.31.61.13.09.28.14.44.14.08,0,.16-.01.24-.04l2.02-.67c.02.4.34.71.74.71h1c.69,0,1.25.56,1.25,1.25v5.5c0,1.24,1.01,2.25,2.25,2.25s2.25-1.01,2.25-2.25V7c0-2.62-2.13-4.75-4.75-4.75Zm-4.25,1.79l1.5.5v5.92l-1.5.5v-6.92Zm7.5,15.46c0,.41-.34.75-.75.75s-.75-.34-.75-.75v-5.5c0-1.52-1.23-2.75-2.75-2.75h-.25V3.75h1.25c1.79,0,3.25,1.46,3.25,3.25v12.5Z" />
  </svg>
);

export default Brush2Icon;
