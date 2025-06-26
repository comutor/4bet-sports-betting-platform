interface FourBetLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FourBetLogo({ size = 'md', className = '' }: FourBetLogoProps) {
  const sizeConfig = {
    sm: { container: 'h-8', circleSize: '20px', fontSize: '14px', gap: '2px' },
    md: { container: 'h-10', circleSize: '28px', fontSize: '18px', gap: '2px' },
    lg: { container: 'h-12', circleSize: '36px', fontSize: '22px', gap: '2px' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.container} ${className} flex items-center logo-container`} 
         style={{ gap: config.gap }}>
      {/* Circle for "4" */}
      <div className="relative">
        <div
          className="circle-letter flex items-center justify-center bg-transparent border-2 border-white rounded-full font-black text-white"
          style={{
            width: config.circleSize,
            height: config.circleSize,
            fontSize: config.fontSize
          }}
        >
          4
        </div>
      </div>
      
      {/* "bet" text in solid rectangle */}
      <div 
        className="font-black text-white lowercase bg-white/20 border border-white px-2 py-1 rounded-md bet-text"
        style={{ fontSize: config.fontSize, lineHeight: '1' }}
      >
        bet
      </div>
    </div>
  );
}