import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BetslipItem } from "@/hooks/useBetslip";

interface BetslipSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: BetslipItem[];
  onRemoveItem: (id: string) => void;
  onUpdateStake: (id: string, stake: number) => void;
  totalStake: number;
  totalPotentialReturn: number;
}

export function BetslipSidebar({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateStake,
  totalStake,
  totalPotentialReturn
}: BetslipSidebarProps) {
  return (
    <div className={`fixed inset-0 bg-slate-custom transform transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Betslip</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <i className="fas fa-times"></i>
          </Button>
        </div>
        
        {/* Betslip Items */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-receipt text-4xl mb-4"></i>
              <p>Your betslip is empty</p>
              <p className="text-sm">Add some bets to get started!</p>
            </div>
          ) : (
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
                  <span className="font-bold">@{item.odds}</span>
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
                  Returns: ${item.potentialReturn.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Betslip Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-600 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span>Total Stake:</span>
              <span className="font-bold">${totalStake.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span>Potential Returns:</span>
              <span className="font-bold text-success">${totalPotentialReturn.toFixed(2)}</span>
            </div>
            
            <Button className="w-full bg-success hover:bg-green-600 font-bold">
              Place Bets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
