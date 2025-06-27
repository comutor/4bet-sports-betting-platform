import { FourBetLogo } from "./FourBetLogo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        {/* Thin blue spinning circle */}
        <div className="absolute rounded-full border border-transparent border-t-blue-600 animate-spin w-20 h-20"></div>
        
        {/* Logo in the center */}
        <div className="flex items-center justify-center">
          <FourBetLogo size="md" />
        </div>
      </div>
      
      {/* Optional loading text */}
      <div className="absolute bottom-1/3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}