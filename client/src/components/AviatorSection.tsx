import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recentAviatorResults } from "@/lib/betting-data";

export function AviatorSection() {
  const [bet1Amount, setBet1Amount] = useState(10);
  const [bet2Amount, setBet2Amount] = useState(25);
  const [currentMultiplier] = useState(2.45);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <i className="fas fa-plane text-live mr-3"></i>
          Aviator
        </h2>
        <p className="text-gray-400">Watch the plane fly and cash out before it crashes!</p>
      </div>
      
      {/* Aviator Game Interface */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-custom rounded-xl p-8 mb-6">
        <div className="relative h-64 bg-gradient-to-t from-blue-900/50 to-transparent rounded-lg mb-6 overflow-hidden">
          {/* Sky background */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-blue-500"></div>
          
          {/* Clouds */}
          <div className="absolute top-4 left-10 w-16 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute top-8 right-16 w-12 h-6 bg-white/15 rounded-full"></div>
          
          {/* Plane */}
          <div className="absolute bottom-8 left-8 transform transition-all duration-1000">
            <i className="fas fa-plane text-4xl text-white transform rotate-45"></i>
          </div>
          
          {/* Multiplier Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white">{currentMultiplier}x</div>
          </div>
          
          {/* Trail */}
          <div className="absolute bottom-12 left-16 w-32 h-1 bg-white/50 rounded-full"></div>
        </div>
        
        {/* Game Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bet 1 */}
          <div className="bg-slate-light-custom rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Bet 1</span>
              <span className="text-success">Active</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => setBet1Amount(Math.max(1, bet1Amount - 1))}
                  className="bg-slate-custom hover:bg-gray-600"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  value={bet1Amount} 
                  onChange={(e) => setBet1Amount(parseFloat(e.target.value) || 0)}
                  className="bg-slate-custom text-center flex-1" 
                />
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => setBet1Amount(bet1Amount + 1)}
                  className="bg-slate-custom hover:bg-gray-600"
                >
                  +
                </Button>
              </div>
              
              <Button className="w-full bg-success hover:bg-green-600 font-bold transition-colors">
                CASH OUT ${(bet1Amount * currentMultiplier).toFixed(2)}
              </Button>
            </div>
          </div>
          
          {/* Bet 2 */}
          <div className="bg-slate-light-custom rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Bet 2</span>
              <span className="text-gray-400">Inactive</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => setBet2Amount(Math.max(1, bet2Amount - 1))}
                  className="bg-slate-custom hover:bg-gray-600"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  value={bet2Amount} 
                  onChange={(e) => setBet2Amount(parseFloat(e.target.value) || 0)}
                  className="bg-slate-custom text-center flex-1" 
                />
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => setBet2Amount(bet2Amount + 1)}
                  className="bg-slate-custom hover:bg-gray-600"
                >
                  +
                </Button>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary-blue-dark font-bold transition-colors">
                BET ${bet2Amount.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Results */}
      <div className="bg-slate-custom rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Recent Results</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {recentAviatorResults.map((result, index) => (
            <div 
              key={index} 
              className={`text-center py-2 rounded font-bold text-sm ${
                parseFloat(result) >= 2 ? 'bg-success' : 'bg-danger'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
