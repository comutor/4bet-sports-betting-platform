interface TATAbetsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TATAbetsLogo({ size = 'md', className = '' }: TATAbetsLogoProps) {
  const sizeConfig = {
    sm: { container: 'h-8', circleSize: '16px', fontSize: '12px', gap: '0px' },
    md: { container: 'h-10', circleSize: '24px', fontSize: '16px', gap: '0px' },
    lg: { container: 'h-12', circleSize: '32px', fontSize: '20px', gap: '0px' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.container} ${className} flex items-end logo-container`} 
         style={{ gap: config.gap }}>
      {/* Circle letters for "tata" */}
      {['t', 'a', 't', 'a'].map((letter, index) => (
        <div key={index} className="relative">
          <div
            className="circle-letter flex items-center justify-center bg-transparent border-2 border-white rounded-full font-black text-white"
            style={{
              width: config.circleSize,
              height: config.circleSize,
              fontSize: config.fontSize
            }}
          >
            {letter}
          </div>
          {/* T cross-bar extension for "t" letters */}
          {letter === 't' && (
            <div 
              className="absolute bg-white t-crossbar"
              style={{
                width: size === 'sm' ? '8px' : size === 'md' ? '12px' : '16px',
                height: '2px',
                top: size === 'sm' ? '6px' : size === 'md' ? '8px' : '10px',
                right: '-2px'
              }}
            />
          )}
        </div>
      ))}
      
      {/* "bets" text in solid rectangle */}
      <div 
        className="font-black text-white lowercase bg-white/20 border border-white px-2 py-1 rounded-md bets-text"
        style={{ fontSize: config.fontSize, lineHeight: '1' }}
      >
        bets
      </div>
    </div>
  );
}