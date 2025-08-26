import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const ShowerIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m19.71,17.27c-.3-2.79-2.31-5.07-4.96-5.78v-6.49c0-1.52-1.23-2.75-2.75-2.75s-2.75,1.23-2.75,2.75v6.49c-2.65.71-4.66,2.99-4.96,5.78-1.14.11-2.04,1.06-2.04,2.23,0,1.24,1.01,2.25,2.25,2.25h15c1.24,0,2.25-1.01,2.25-2.25,0-1.17-.9-2.12-2.04-2.23ZM10.75,5c0-.69.56-1.25,1.25-1.25s1.25.56,1.25,1.25v6.26c-.08,0-.17-.01-.25-.01h-2c-.08,0-.17,0-.25.01v-6.26Zm.25,7.75h2c2.64,0,4.83,1.96,5.2,4.5H5.8c.37-2.54,2.56-4.5,5.2-4.5Zm8.5,7.5H4.5c-.41,0-.75-.34-.75-.75s.34-.75.75-.75h15c.41,0,.75.34.75.75s-.34.75-.75.75Z" />
  </svg>
);

export default ShowerIcon;