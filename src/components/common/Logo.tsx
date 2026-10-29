import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
}) => {
  // Size dimensions
  const dimensions = {
    sm: { icon: 28, text: 'text-lg', subtext: 'text-[9px]' },
    md: { icon: 38, text: 'text-2xl', subtext: 'text-xs' },
    lg: { icon: 48, text: 'text-3xl', subtext: 'text-sm' },
    xl: { icon: 64, text: 'text-4xl', subtext: 'text-base' },
  }[size];

  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0B2E26';
  const subtextColor = isDark ? '#A7F432' : '#61736A';

  // The stylized Vyaparo 'V' with upward growth symbol
  const IconSVG = (
    <svg
      width={dimensions.icon}
      height={dimensions.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-200"
    >
      <defs>
        <linearGradient id="vGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B2E26" />
          <stop offset="100%" stopColor="#0F8F5F" />
        </linearGradient>
        <linearGradient id="vLimeGrowth" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F8F5F" />
          <stop offset="60%" stopColor="#A7F432" />
          <stop offset="100%" stopColor="#D9FFA0" />
        </linearGradient>
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F8F5F" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background container for icon variant */}
      {variant === 'icon' && (
        <rect width="100" height="100" rx="26" fill={isDark ? '#0B2E26' : '#0F8F5F'} />
      )}

      {/* Main left downward-swooping anchor wing of 'V' */}
      <path
        d="M20 25 C20 25 32 60 48 82 C51 86 55 86 58 82 L76 46"
        stroke={variant === 'icon' && !isDark ? '#FFFFFF' : 'url(#vGreenGradient)'}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic right upward-growth blade of 'V' reaching higher */}
      <path
        d="M44 54 L62 82 C65 86 69 86 72 80 L88 20"
        stroke="url(#vLimeGrowth)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* Growth spark dot at top-right tip */}
      <circle cx="89" cy="18" r="5" fill="#A7F432" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{IconSVG}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {IconSVG}
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight font-sans ${dimensions.text}`}
          style={{ color: textColor }}
        >
          Vyaparo
        </span>
        {variant === 'full' && (
          <span
            className={`font-medium tracking-wide mt-1 font-sans ${dimensions.subtext}`}
            style={{ color: subtextColor }}
          >
            Your Business. One Smart Platform.
          </span>
        )}
      </div>
    </div>
  );
};
