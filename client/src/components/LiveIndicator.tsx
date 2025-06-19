interface LiveIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LiveIndicator({ size = 'md', className = '' }: LiveIndicatorProps) {
  const sizeConfig = {
    sm: { container: 'w-3 h-3', dot: 'w-1 h-1', arc1: 'w-2 h-2', arc2: 'w-2.5 h-2.5' },
    md: { container: 'w-4 h-4', dot: 'w-1.5 h-1.5', arc1: 'w-3 h-3', arc2: 'w-4 h-4' },
    lg: { container: 'w-5 h-5', dot: 'w-2 h-2', arc1: 'w-4 h-4', arc2: 'w-5 h-5' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`relative ${config.container} ${className}`}>
      {/* Central red dot */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full ${config.dot}`}></div>
      
      {/* First radiating arc */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-500 rounded-full ${config.arc1} animate-ping opacity-75`}
        style={{ animationDuration: '1.5s' }}
      ></div>
      
      {/* Second radiating arc */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-red-500 rounded-full ${config.arc2} animate-ping opacity-50`}
        style={{ animationDuration: '2s', animationDelay: '0.3s' }}
      ></div>
    </div>
  );
}