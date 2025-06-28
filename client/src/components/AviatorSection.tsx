import { useState } from "react";
import { Plane, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AviatorSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setError(true);
  };
  
  const refreshGame = () => {
    setIsLoading(true);
    setError(false);
    // Force iframe reload
    const iframe = document.getElementById('aviator-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Plane className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-white">Aviator</h2>
          <div className="ml-4 px-2 py-1 rounded text-xs bg-red-600 text-white">
            LIVE BY SPRIBE
          </div>
        </div>
        <p className="text-slate-400">Watch the plane fly and cash out before it crashes!</p>
      </div>

      {/* Game Container */}
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-white">Loading Aviator...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10">
            <div className="text-center">
              <Plane className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-white mb-4">Failed to load Aviator game</p>
              <Button onClick={refreshGame} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Spribe Aviator Iframe */}
        <iframe
          id="aviator-iframe"
          src="https://luckyjet.spribe.io/aviator"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full min-h-[600px]"
          title="Spribe Aviator Game"
        />
      </div>

      {/* Game Information */}
      <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">RTP</div>
            <div className="text-slate-400">97%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">Max Win</div>
            <div className="text-slate-400">10,000x</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">Provider</div>
            <div className="text-slate-400">Spribe</div>
          </div>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">1. Place Your Bet</h4>
            <p className="text-slate-400 text-sm">Choose your bet amount before the plane takes off. You can place up to 2 bets simultaneously.</p>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-2">2. Watch the Multiplier</h4>
            <p className="text-slate-400 text-sm">The plane flies higher and the multiplier increases. The longer it flies, the bigger your potential win.</p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">3. Cash Out in Time</h4>
            <p className="text-slate-400 text-sm">Click "Cash Out" before the plane flies away to secure your winnings at the current multiplier.</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-2">4. Don't Wait Too Long</h4>
            <p className="text-slate-400 text-sm">If you don't cash out before the plane flies away, you lose your bet. Timing is everything!</p>
          </div>
        </div>
      </div>

      {/* External Link */}
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={() => window.open('https://luckyjet.spribe.io/aviator', '_blank')}
          className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Window
        </Button>
      </div>
    </div>
  );
}