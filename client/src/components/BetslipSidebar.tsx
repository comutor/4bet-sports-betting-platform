import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BetslipItem } from "@/hooks/useBetslip";
import { useState, useEffect } from "react";

interface BetslipSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: BetslipItem[];
  onRemoveItem: (id: string) => void;
  onUpdateStake: (id: string, stake: number) => void;
  onClearBetslip: () => void;
  totalStake: number;
  totalPotentialReturn: number;
  isLoggedIn: boolean;
  userBalance: number;
  onLoginClick: () => void;
  onDepositClick: () => void;
}

export function BetslipSidebar({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateStake,
  onClearBetslip,
  totalStake,
  totalPotentialReturn,
  isLoggedIn,
  userBalance,
  onLoginClick,
  onDepositClick
}: BetslipSidebarProps) {
  const [betType, setBetType] = useState<'single' | 'accumulator'>('accumulator');
  const [accumulatorStake, setAccumulatorStake] = useState(100);

  // Calculate accumulator odds (multiply all odds together)
  const accumulatorOdds = items.reduce((total, item) => total * parseFloat(item.odds), 1);
  const accumulatorReturn = accumulatorStake * accumulatorOdds;

  // Determine button state and text
  const getButtonConfig = () => {
    if (!isLoggedIn) {
      return {
        text: "LOGIN TO PLACE YOUR BET",
        onClick: onLoginClick,
        className: "w-full bg-primary hover:bg-primary-blue-dark font-bold"
      };
    }

    const requiredBalance = betType === 'single' ? totalStake : accumulatorStake;
    if (userBalance < requiredBalance) {
      return {
        text: "DEPOSIT TO PLACE YOUR BET",
        onClick: onDepositClick,
        className: "w-full bg-primary hover:bg-primary-blue-dark font-bold"
      };
    }

    return {
      text: betType === 'single' 
        ? `Place ${items.length} Single Bet${items.length > 1 ? 's' : ''}`
        : "Place Accumulator",
      onClick: () => {}, // Actual bet placement logic
      className: "w-full bg-primary hover:bg-primary-blue-dark font-bold"
    };
  };

  // Prevent background scroll when betslip is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`fixed inset-0 bg-slate-custom transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
      onTouchMove={handleTouchMove}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Betslip</h3>
          <div className="flex items-center space-x-2">
            {items.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearBetslip}
                className="border-gray-600 text-gray-300 hover:bg-slate-light-custom text-xs px-2 py-1"
              >
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </div>

        {/* Bet Type Selection */}
        {items.length > 1 && (
          <div className="flex mb-4 bg-slate-light-custom rounded-lg p-1">
            <button
              onClick={() => setBetType('single')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                betType === 'single'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Single Bets
            </button>
            <button
              onClick={() => setBetType('accumulator')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                betType === 'accumulator'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Accumulator
            </button>
          </div>
        )}
        
        {/* Betslip Items */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-receipt text-4xl mb-4"></i>
              <p>Your betslip is empty</p>
              <p className="text-sm">Add some bets to get started!</p>
            </div>
          ) : betType === 'single' ? (
            items.map((item) => (
              <div key={item.id} className="bg-slate-light-custom rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{item.eventName}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                <div className="text-sm text-gray-400 mb-2">{item.selection}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{item.odds}</span>
                  <Input
                    type="number"
                    value={item.stake}
                    onChange={(e) => onUpdateStake(item.id, parseFloat(e.target.value) || 0)}
                    className="bg-slate-custom w-16 text-center py-1 px-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="text-right text-sm text-success mt-1">
                  Returns: SSP {item.potentialReturn.toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            // Accumulator view
            <div className="bg-slate-light-custom rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg">Accumulator</span>
                <span className="text-sm text-gray-400">{items.length} selections</span>
              </div>
              
              {/* List of selections */}
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.eventName}</div>
                    <div className="text-xs text-gray-400">{item.selection}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{item.odds}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Accumulator stake and odds */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Combined Odds:</span>
                  <span className="font-bold text-lg">{accumulatorOdds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stake:</span>
                  <Input
                    type="number"
                    value={accumulatorStake}
                    onChange={(e) => setAccumulatorStake(parseFloat(e.target.value) || 0)}
                    className="bg-slate-custom w-24 text-center py-1 px-2"
                    min="0"
                    step="1"
                  />
                </div>
                <div className="text-right text-lg text-success mt-2">
                  Potential Win: SSP {accumulatorReturn.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Betslip Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-600 pt-4">
            {betType === 'single' ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span>Total Stake:</span>
                  <span className="font-bold">SSP {totalStake.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span>Potential Returns:</span>
                  <span className="font-bold text-success">SSP {totalPotentialReturn.toFixed(2)}</span>
                </div>
                
                <Button 
                  className={getButtonConfig().className}
                  onClick={getButtonConfig().onClick}
                >
                  {getButtonConfig().text}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span>Accumulator Stake:</span>
                  <span className="font-bold">SSP {accumulatorStake.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Combined Odds:</span>
                  <span className="font-bold">{accumulatorOdds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span>Potential Win:</span>
                  <span className="font-bold text-success">SSP {accumulatorReturn.toFixed(2)}</span>
                </div>
                
                <Button 
                  className={getButtonConfig().className}
                  onClick={getButtonConfig().onClick}
                >
                  {getButtonConfig().text}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
