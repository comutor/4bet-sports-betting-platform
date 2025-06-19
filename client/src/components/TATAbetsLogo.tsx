interface TATAbetsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TATAbetsLogo({ size = 'md', className = '' }: TATAbetsLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-20 h-10',
    lg: 'w-24 h-12'
  };

  const circleRadius = size === 'sm' ? 8 : size === 'md' ? 10 : 12;
  const fontSize = size === 'sm' ? 6 : size === 'md' ? 7 : 8;
  const rectWidth = circleRadius * 1.8;
  const rectHeight = circleRadius * 1.6;

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <svg
        viewBox="0 0 120 40"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="rectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* Four overlapping circles for "tata" */}
        <circle
          cx="12"
          cy="20"
          r={circleRadius}
          fill="url(#circleGradient)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <circle
          cx="24"
          cy="20"
          r={circleRadius}
          fill="url(#circleGradient)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <circle
          cx="36"
          cy="20"
          r={circleRadius}
          fill="url(#circleGradient)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <circle
          cx="48"
          cy="20"
          r={circleRadius}
          fill="url(#circleGradient)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        
        {/* Letters inside circles */}
        <text x="12" y="24" textAnchor="middle" fontSize={fontSize} fill="white" fontWeight="bold" fontFamily="Nunito">t</text>
        <text x="24" y="24" textAnchor="middle" fontSize={fontSize} fill="white" fontWeight="bold" fontFamily="Nunito">a</text>
        <text x="36" y="24" textAnchor="middle" fontSize={fontSize} fill="white" fontWeight="bold" fontFamily="Nunito">t</text>
        <text x="48" y="24" textAnchor="middle" fontSize={fontSize} fill="white" fontWeight="bold" fontFamily="Nunito">a</text>
        
        {/* Rectangle for "bets" - half the size of last circle and joined */}
        <rect
          x="56"
          y={20 - rectHeight/2}
          width={rectWidth}
          height={rectHeight}
          rx="4"
          fill="url(#rectGradient)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        
        {/* "bets" text in rectangle */}
        <text 
          x={56 + rectWidth/2} 
          y="24" 
          textAnchor="middle" 
          fontSize={fontSize} 
          fill="white" 
          fontWeight="bold" 
          fontFamily="Nunito"
        >
          bets
        </text>
      </svg>
    </div>
  );
}