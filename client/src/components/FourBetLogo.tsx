interface FourBetLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FourBetLogo({ size = 'md', className = '' }: FourBetLogoProps) {
  const sizeConfig = {
    sm: { fontSize: '24px', letterSpacing: '1px' },
    md: { fontSize: '32px', letterSpacing: '1.5px' },
    lg: { fontSize: '42px', letterSpacing: '2px' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${className} flex items-center logo-container`}>
      <span 
        style={{ 
          fontSize: config.fontSize, 
          lineHeight: '1',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 'bold',
          letterSpacing: config.letterSpacing,
        }}
      >
        <span 
          className="text-blue-600 font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-lg filter brightness-110 contrast-125"
          style={{
            fontFamily: 'Orbitron, sans-serif', 
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)',
            letterSpacing: config.letterSpacing
          }}
        >
          4
        </span>
        <span 
          className="text-white font-bold"
          style={{
            fontFamily: 'Orbitron, sans-serif', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            letterSpacing: config.letterSpacing
          }}
        >
          bet
        </span>
      </span>
    </div>
  );
}