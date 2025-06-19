interface TATAbetsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TATAbetsLogo({ size = 'md', className = '' }: TATAbetsLogoProps) {
  const sizeConfig = {
    sm: { container: 'h-8', circleSize: '16px', fontSize: '12px', gap: '4px' },
    md: { container: 'h-10', circleSize: '24px', fontSize: '16px', gap: '6px' },
    lg: { container: 'h-12', circleSize: '32px', fontSize: '20px', gap: '8px' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.container} ${className} flex items-end transition-all duration-300 hover:scale-105`} 
         style={{ gap: config.gap }}>
      {/* Circle letters for "tata" */}
      {['t', 'a', 't', 'a'].map((letter, index) => (
        <div
          key={index}
          className="circle-letter flex items-center justify-center bg-transparent border-2 border-white border-t-transparent rounded-full font-black text-white transition-all duration-300 hover:border-yellow-400"
          style={{
            width: config.circleSize,
            height: config.circleSize,
            fontSize: config.fontSize,
            borderTopWidth: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px'
          }}
        >
          {letter}
        </div>
      ))}
      
      {/* "bets" text in solid rectangle */}
      <div 
        className="font-black text-white lowercase transition-all duration-300 hover:text-yellow-400 bg-white/20 border border-white px-2 py-1 rounded-md"
        style={{ fontSize: config.fontSize, lineHeight: '1' }}
      >
        bets
      </div>
    </div>
  );
}