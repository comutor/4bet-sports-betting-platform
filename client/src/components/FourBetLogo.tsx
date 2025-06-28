interface FourBetLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FourBetLogo({ size = 'md', className = '' }: FourBetLogoProps) {
  const sizeConfig = {
    sm: { fontSize: '22px', letterSpacing: '1px' },
    md: { fontSize: '28px', letterSpacing: '1.5px' },
    lg: { fontSize: '36px', letterSpacing: '2px' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${className} flex items-center logo-container`}>
      <span 
        style={{ 
          fontSize: config.fontSize, 
          lineHeight: '1',
          fontFamily: '"Orbitron", "Arial Black", system-ui, sans-serif',
          fontWeight: '900',
          letterSpacing: config.letterSpacing,
          textTransform: 'uppercase'
        }}
      >
        <span 
          style={{
            color: '#1E40AF',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(30, 64, 175, 0.5)',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          4
        </span>
        <span 
          style={{
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          bet
        </span>
      </span>
    </div>
  );
}