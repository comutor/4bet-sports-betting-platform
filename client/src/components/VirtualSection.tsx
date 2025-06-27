import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VirtualFootballSection } from "./VirtualFootballSection";
import { VirtualHorseRacingSection } from "./VirtualHorseRacingSection";
import { VirtualBasketballSection } from "./VirtualBasketballSection";
import { VirtualTennisSection } from "./VirtualTennisSection";

interface VirtualSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function VirtualSection({ onBetClick }: VirtualSectionProps) {
  const [selectedGame, setSelectedGame] = useState('virtual-football');

  const virtualGames = [
    { 
      id: 'virtual-football', 
      name: 'Virtual Football', 
      icon: '⚽', 
      description: 'Fast-paced virtual football matches every 3 minutes',
      nextMatch: '2 min 30 sec'
    },
    { 
      id: 'virtual-horse-racing', 
      name: 'Virtual Horse Racing', 
      icon: '🐎', 
      description: 'Exciting horse races with realistic odds',
      nextMatch: '1 min 45 sec'
    },
    { 
      id: 'virtual-basketball', 
      name: 'Virtual Basketball', 
      icon: '🏀', 
      description: 'Non-stop basketball action',
      nextMatch: '3 min 15 sec'
    },
    { 
      id: 'virtual-tennis', 
      name: 'Virtual Tennis', 
      icon: '🎾', 
      description: 'Quick tennis matches',
      nextMatch: '4 min 20 sec'
    }
  ];

  const sampleMatches = [
    {
      id: 1,
      homeTeam: "Virtual FC United",
      awayTeam: "Digital City FC",
      time: "Next: 2:30",
      odds: { home: "2.15", draw: "3.40", away: "2.85" }
    },
    {
      id: 2,
      homeTeam: "Cyber Rangers",
      awayTeam: "Tech Warriors",
      time: "Next: 5:30", 
      odds: { home: "1.95", draw: "3.20", away: "3.10" }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Virtual Sports</h2>
        <p className="text-gray-400">Fast-paced virtual games running 24/7</p>
      </div>

      {/* Game Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {virtualGames.map((game) => (
          <Button
            key={game.id}
            variant={selectedGame === game.id ? "default" : "outline"}
            className={`h-20 flex flex-col items-center justify-center p-3 ${
              selectedGame === game.id 
                ? 'bg-primary text-white border-primary' 
                : 'border-gray-600 text-gray-300 hover:bg-slate-700'
            }`}
            onClick={() => setSelectedGame(game.id)}
          >
            <span className="text-2xl mb-1">{game.icon}</span>
            <span className="text-xs text-center leading-tight">{game.name}</span>
          </Button>
        ))}
      </div>

      {/* Selected Game Info */}
      {selectedGame && (
        <div className="bg-slate-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {virtualGames.find(g => g.id === selectedGame)?.name}
              </h3>
              <p className="text-sm text-gray-400">
                {virtualGames.find(g => g.id === selectedGame)?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Next Match</div>
              <div className="text-lg font-bold text-primary">
                {virtualGames.find(g => g.id === selectedGame)?.nextMatch}
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-400 font-medium">LIVE NOW</span>
          </div>
        </div>
      )}

      {/* Virtual Game Content */}
      {selectedGame === 'virtual-football' && (
        <VirtualFootballSection onBetClick={onBetClick} />
      )}
      
      {selectedGame === 'virtual-horse-racing' && (
        <VirtualHorseRacingSection onBetClick={onBetClick} />
      )}
      
      {selectedGame === 'virtual-basketball' && (
        <VirtualBasketballSection onBetClick={onBetClick} />
      )}
      
      {selectedGame === 'virtual-tennis' && (
        <VirtualTennisSection onBetClick={onBetClick} />
      )}
      
      {selectedGame !== 'virtual-football' && selectedGame !== 'virtual-horse-racing' && selectedGame !== 'virtual-basketball' && selectedGame !== 'virtual-tennis' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Matches</h3>
          {sampleMatches.map((match) => (
            <div key={match.id} className="bg-slate-800 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-white">
                    {match.homeTeam} vs {match.awayTeam}
                  </div>
                  <div className="text-sm text-gray-400">{match.time}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={() => onBetClick(`${match.homeTeam} vs ${match.awayTeam}`, match.homeTeam, match.odds.home)}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400">1</div>
                    <div className="font-bold">{match.odds.home}</div>
                  </div>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={() => onBetClick(`${match.homeTeam} vs ${match.awayTeam}`, "Draw", match.odds.draw)}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400">X</div>
                    <div className="font-bold">{match.odds.draw}</div>
                  </div>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={() => onBetClick(`${match.homeTeam} vs ${match.awayTeam}`, match.awayTeam, match.odds.away)}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400">2</div>
                    <div className="font-bold">{match.odds.away}</div>
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-info text-white text-sm"></i>
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">Virtual Sports Info</h4>
            <p className="text-sm text-gray-300">
              Virtual sports use advanced algorithms to simulate real sporting events. 
              Results are generated randomly and fairly, with matches running continuously 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}