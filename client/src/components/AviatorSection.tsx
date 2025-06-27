import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, TrendingUp, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GameState {
  roundId: string;
  status: 'waiting' | 'flying' | 'crashed';
  currentMultiplier: number;
  startTime: number;
  endTime?: number;
}

interface AviatorBet {
  amount: number;
  multiplier?: number;
  cashedOut: boolean;
  timestamp: number;
}

export function AviatorSection() {
  const [bet1Amount, setBet1Amount] = useState(10);
  const [bet2Amount, setBet2Amount] = useState(25);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [recentResults, setRecentResults] = useState<number[]>([]);
  const [userBets, setUserBets] = useState<AviatorBet[]>([]);
  const [waitingTime, setWaitingTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [bet1Placed, setBet1Placed] = useState(false);
  const [bet2Placed, setBet2Placed] = useState(false);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0, rotation: 45 });
  
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/aviator`;
    
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onopen = () => {
      setIsConnected(true);
    };
    
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'gameState':
          setGameState(message.data.gameState);
          setRecentResults(message.data.recentResults);
          break;
        case 'roundWaiting':
          setGameState(prev => prev ? { ...prev, status: 'waiting' } : null);
          setWaitingTime(5);
          setBet1Placed(false);
          setBet2Placed(false);
          break;
        case 'roundStarted':
          setGameState(prev => prev ? { ...prev, status: 'flying', startTime: message.data.startTime } : null);
          setWaitingTime(0);
          break;
        case 'multiplierUpdate':
          setGameState(prev => prev ? { ...prev, currentMultiplier: message.data.multiplier } : null);
          updatePlanePosition(message.data.multiplier);
          break;
        case 'roundCrashed':
          setGameState(prev => prev ? { ...prev, status: 'crashed', endTime: message.data.endTime } : null);
          setRecentResults(prev => [message.data.crashMultiplier, ...prev.slice(0, 19)]);
          break;
        case 'betPlaced':
          toast({
            title: "Bet Placed",
            description: `$${message.data.amount} bet placed successfully`,
          });
          break;
        case 'betCashedOut':
          toast({
            title: "Cash Out",
            description: `Cashed out at ${message.data.multiplier.toFixed(2)}x for $${message.data.amount.toFixed(2)}`,
            variant: "default",
          });
          break;
      }
    };
    
    ws.current.onclose = () => {
      setIsConnected(false);
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [toast]);

  // Countdown timer for waiting phase
  useEffect(() => {
    if (waitingTime > 0) {
      const timer = setTimeout(() => {
        setWaitingTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [waitingTime]);

  // Update plane position based on multiplier
  const updatePlanePosition = (multiplier: number) => {
    const progress = Math.min((multiplier - 1) / 9, 1); // Normalize to 0-1 for multiplier 1-10x
    const x = progress * 80; // Move across 80% of width
    const y = progress * 60; // Move up 60% of height
    const rotation = 45 + (progress * 15); // Slight rotation change
    
    setPlanePosition({ x, y, rotation });
  };

  const placeBet = async (amount: number, betIndex: number) => {
    try {
      await apiRequest(`/api/aviator/bet`, 'POST', { amount });
      
      if (betIndex === 0) {
        setBet1Placed(true);
      } else {
        setBet2Placed(true);
      }
    } catch (error) {
      toast({
        title: "Bet Failed",
        description: "Unable to place bet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cashOut = async (betIndex: number) => {
    try {
      await apiRequest(`/api/aviator/cashout`, 'POST', { betIndex });
      
      if (betIndex === 0) {
        setBet1Placed(false);
      } else {
        setBet2Placed(false);
      }
    } catch (error) {
      toast({
        title: "Cash Out Failed", 
        description: "Unable to cash out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canBet = gameState?.status === 'waiting' && isConnected;
  const canCashOut = gameState?.status === 'flying' && isConnected;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Plane className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-white">Aviator</h2>
          <div className={`ml-4 px-2 py-1 rounded text-xs ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
            {isConnected ? 'LIVE' : 'DISCONNECTED'}
          </div>
        </div>
        <p className="text-slate-400">Watch the plane fly and cash out before it crashes!</p>
      </div>
      
      {/* Game Status */}
      {gameState && (
        <div className="text-center mb-6">
          {gameState.status === 'waiting' && (
            <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Next round starts in {waitingTime}s
            </div>
          )}
          {gameState.status === 'flying' && (
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Flying - {gameState.currentMultiplier.toFixed(2)}x
            </div>
          )}
          {gameState.status === 'crashed' && (
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
              Crashed at {gameState.currentMultiplier.toFixed(2)}x
            </div>
          )}
        </div>
      )}
      
      {/* Aviator Game Interface */}
      <div className="bg-slate-800 rounded-xl p-8 mb-6 border border-slate-700">
        <div className="relative h-64 bg-gradient-to-t from-blue-900/50 to-transparent rounded-lg mb-6 overflow-hidden">
          {/* Sky background */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-blue-500"></div>
          
          {/* Clouds */}
          <div className="absolute top-4 left-10 w-16 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute top-8 right-16 w-12 h-6 bg-white/15 rounded-full"></div>
          
          {/* Plane with dynamic position */}
          <div 
            className="absolute transition-all duration-100 ease-linear"
            style={{
              left: `${8 + planePosition.x}%`,
              bottom: `${8 + planePosition.y}%`,
              transform: `rotate(${planePosition.rotation}deg)`
            }}
          >
            <Plane className="h-8 w-8 text-white" />
          </div>
          
          {/* Multiplier Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-6xl font-bold transition-colors duration-200 ${
              gameState?.status === 'flying' ? 'text-green-400' : 
              gameState?.status === 'crashed' ? 'text-red-400' : 'text-white'
            }`}>
              {gameState?.currentMultiplier?.toFixed(2) || '1.00'}x
            </div>
          </div>
          
          {/* Trail */}
          {gameState?.status === 'flying' && (
            <div 
              className="absolute bg-white/50 rounded-full transition-all duration-100"
              style={{
                left: `${8 + (planePosition.x * 0.5)}%`,
                bottom: `${12 + (planePosition.y * 0.5)}%`,
                width: `${Math.min(planePosition.x * 2, 100)}px`,
                height: '2px'
              }}
            ></div>
          )}
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
