import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MoreMarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  homeTeam: string;
  awayTeam: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function MoreMarketsModal({ 
  isOpen, 
  onClose, 
  eventName, 
  homeTeam, 
  awayTeam, 
  onBetClick 
}: MoreMarketsModalProps) {
  const [activeMarket, setActiveMarket] = useState('full-time');

  const markets = [
    { id: 'full-time', name: 'Full Time Result', icon: '🏆' },
    { id: 'both-teams', name: 'Both Teams to Score', icon: '⚽' },
    { id: 'over-under', name: 'Over/Under Goals', icon: '📊' },
    { id: 'handicap', name: 'Handicap', icon: '⚖️' },
    { id: 'correct-score', name: 'Correct Score', icon: '🎯' },
    { id: 'halftime', name: 'Half Time Result', icon: '⏱️' },
    { id: 'double-chance', name: 'Double Chance', icon: '🎲' },
    { id: 'first-goal', name: 'First Goal Scorer', icon: '🥇' }
  ];

  const getMarketOptions = (marketId: string) => {
    switch (marketId) {
      case 'full-time':
        return [
          { label: homeTeam, odds: '2.15' },
          { label: 'Draw', odds: '3.40' },
          { label: awayTeam, odds: '2.85' }
        ];
      case 'both-teams':
        return [
          { label: 'Yes', odds: '1.85' },
          { label: 'No', odds: '1.95' }
        ];
      case 'over-under':
        return [
          { label: 'Over 2.5', odds: '1.75' },
          { label: 'Under 2.5', odds: '2.05' },
          { label: 'Over 1.5', odds: '1.25' },
          { label: 'Under 1.5', odds: '3.75' },
          { label: 'Over 3.5', odds: '2.95' },
          { label: 'Under 3.5', odds: '1.35' }
        ];
      case 'handicap':
        return [
          { label: `${homeTeam} -1`, odds: '3.20' },
          { label: `${awayTeam} +1`, odds: '1.35' },
          { label: `${homeTeam} -2`, odds: '5.50' },
          { label: `${awayTeam} +2`, odds: '1.15' }
        ];
      case 'correct-score':
        return [
          { label: '1-0', odds: '8.50' },
          { label: '2-1', odds: '9.00' },
          { label: '1-1', odds: '6.50' },
          { label: '0-0', odds: '11.00' },
          { label: '2-0', odds: '10.50' },
          { label: '0-1', odds: '12.00' }
        ];
      case 'halftime':
        return [
          { label: homeTeam, odds: '2.95' },
          { label: 'Draw', odds: '2.10' },
          { label: awayTeam, odds: '3.75' }
        ];
      case 'double-chance':
        return [
          { label: `${homeTeam} or Draw`, odds: '1.35' },
          { label: `${awayTeam} or Draw`, odds: '1.65' },
          { label: `${homeTeam} or ${awayTeam}`, odds: '1.45' }
        ];
      case 'first-goal':
        return [
          { label: 'Player A', odds: '4.50' },
          { label: 'Player B', odds: '5.25' },
          { label: 'Player C', odds: '6.00' },
          { label: 'No Goal', odds: '8.50' }
        ];
      default:
        return [];
    }
  };

  const currentOptions = getMarketOptions(activeMarket);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-slate-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            More Markets - {eventName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[70vh] gap-4">
          {/* Market Categories */}
          <div className="w-64 bg-slate-700 rounded-lg p-3 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Market Categories</h3>
            <div className="space-y-1">
              {markets.map((market) => (
                <button
                  key={market.id}
                  onClick={() => setActiveMarket(market.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeMarket === market.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-slate-600 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{market.icon}</span>
                    <span className="text-sm">{market.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Market Options */}
          <div className="flex-1 bg-slate-700 rounded-lg p-4 overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">
              {markets.find(m => m.id === activeMarket)?.name}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={() => {
                    onBetClick(eventName, option.label, option.odds);
                    onClose();
                  }}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{option.label}</div>
                    <div className="font-bold text-white">{option.odds}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Popular Markets Quick Access */}
            {activeMarket === 'full-time' && (
              <div className="mt-6 pt-4 border-t border-gray-600">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Popular Combinations</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                    onClick={() => {
                      onBetClick(eventName, `${homeTeam} + Over 2.5`, '4.25');
                      onClose();
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-400">{homeTeam} + Over 2.5</div>
                      <div className="font-bold text-white">4.25</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                    onClick={() => {
                      onBetClick(eventName, 'Draw + Under 2.5', '5.80');
                      onClose();
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Draw + Under 2.5</div>
                      <div className="font-bold text-white">5.80</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            {currentOptions.length} markets available
          </div>
          <Button variant="outline" onClick={onClose} className="border-gray-600">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}