import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const WiperIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m20,3.25H4c-.96,0-1.75.79-1.75,1.75v2c0,.96.79,1.75,1.75,1.75h2.46l.6,1.8c.24.72.91,1.2,1.66,1.2h.53v7.25c0,1.52,1.23,2.75,2.75,2.75s2.75-1.23,2.75-2.75v-7.25h.53c.75,0,1.42-.48,1.66-1.2l.6-1.8h2.46c.96,0,1.75-.79,1.75-1.75v-2c0-.96-.79-1.75-1.75-1.75Zm-6.75,15.75c0,.69-.56,1.25-1.25,1.25s-1.25-.56-1.25-1.25v-7.25h2.5v7.25Zm2.27-8.92c-.03.1-.13.17-.24.17h-6.56c-.11,0-.2-.07-.24-.17l-.44-1.33h7.92l-.44,1.33Zm4.73-3.08c0,.14-.11.25-.25.25H4c-.14,0-.25-.11-.25-.25v-2c0-.14.11-.25.25-.25h16c.14,0,.25.11.25.25v2Z" />
  </svg>
);

export default WiperIcon;