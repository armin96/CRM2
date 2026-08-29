
interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
}

export function BrandLogo({ size = 'md', showText = true, tagline, className = '' }: BrandLogoProps) {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 56,
  };

  const titleSizes = {
    sm: '14px',
    md: '16px',
    lg: '22px',
    xl: '26px',
  };

  const currentIconSize = iconSizes[size];

  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: currentIconSize,
          height: currentIconSize,
          borderRadius: size === 'sm' ? 8 : size === 'md' ? 10 : 14,
          background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Glow overlay */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Custom SVG Modern Geometric Logo Icon */}
        <svg
          width={currentIconSize * 0.6}
          height={currentIconSize * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
          />
          <circle cx="12" cy="12" r="1.5" fill="#38bdf8" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: titleSizes[size],
              fontWeight: 800,
              letterSpacing: '-0.4px',
              color: '#0f172a',
              lineHeight: 1.15,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Nexora</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
              }}
            >
              CRM
            </span>
          </div>
          {tagline ? (
            <div style={{ fontSize: size === 'sm' ? 9 : 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              {tagline}
            </div>
          ) : (
            <div style={{ fontSize: size === 'sm' ? 9 : 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>
              SALES PIPELINE • BY ARMIN
            </div>
          )}
        </div>
      )}
    </div>
  );
}
