interface FourBetLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FourBetLogo({ size = 'md', className = '' }: FourBetLogoProps) {
  const sizeConfig = {
    sm: { fontSize: '18px' },
    md: { fontSize: '24px' },
    lg: { fontSize: '32px' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${className} flex items-center logo-container`}>
      <span 
        className="font-black text-white"
        style={{ fontSize: config.fontSize, lineHeight: '1' }}
      >
        4bet
      </span>
    </div>
  );
}