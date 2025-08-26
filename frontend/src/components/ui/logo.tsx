interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  onClick?: () => void;
}

export function Logo({
  className = '',
  size = 'md',
  variant = 'dark',
  onClick,
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-neutral-950';
  const accentColor = '#f8de00'; // sonnengelb

  return (
    <div className={`flex items-center ${className}`} onClick={onClick}>
      <div className={`${sizeClasses[size]} mr-2 flex items-center`}>
        {/* Simple geometric logo with car wash theme */}
        <svg
          viewBox="0 0 40 40"
          className={sizeClasses[size]}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Car silhouette */}
          <path
            d="M6 28c0-1.1.9-2 2-2h24c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-2z"
            fill={variant === 'light' ? 'white' : '#374151'}
          />
          <path
            d="M10 26c0-2 1-4 3-5l2-1h10l2 1c2 1 3 3 3 5v2H10v-2z"
            fill={variant === 'light' ? 'white' : '#374151'}
          />

          {/* Wash bubbles/drops */}
          <circle cx="12" cy="15" r="2" fill={accentColor} opacity="0.8" />
          <circle cx="20" cy="12" r="1.5" fill={accentColor} opacity="0.6" />
          <circle cx="28" cy="16" r="1.8" fill={accentColor} opacity="0.7" />
          <circle cx="16" cy="8" r="1.2" fill={accentColor} opacity="0.5" />
          <circle cx="24" cy="6" r="1" fill={accentColor} opacity="0.4" />

          {/* Shine effect */}
          <path
            d="M10 22c2-1 4-1 6 0s4 1 6 0 4-1 6 0"
            stroke={accentColor}
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className={`font-bold ${textColor}`}>
        <span className="text-lg">CLEAN</span>
        <span className="text-lg" style={{ color: accentColor }}>
          tastic
        </span>
      </div>
    </div>
  );
}
