import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const PulleyIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m20.58,12.36l-.95-2.86c-.65-1.94-2.46-3.25-4.51-3.25h-6.23c-2.05,0-3.86,1.31-4.51,3.25l-.95,2.86c-.68.24-1.17.88-1.17,1.64v2c0,.96.79,1.75,1.75,1.75h16c.96,0,1.75-.79,1.75-1.75v-2c0-.76-.49-1.41-1.17-1.64Zm-14.78-2.38c.44-1.33,1.68-2.22,3.08-2.22h6.23c1.4,0,2.64.89,3.08,2.22l.76,2.28h-2.42l-.6-1.8c-.24-.72-.91-1.2-1.66-1.2h-4.56c-.75,0-1.42.48-1.66,1.2l-.6,1.8h-2.42l.76-2.28Zm9.16,2.28h-5.92l.44-1.33c.03-.1.13-.17.24-.17h4.56c.11,0,.2.07.24.17l.44,1.33Zm5.29,3.75c0,.14-.11.25-.25.25H4c-.14,0-.25-.11-.25-.25v-2c0-.14.11-.25.25-.25h16c.14,0,.25.11.25.25v2Z" />
  </svg>
);

export default PulleyIcon;