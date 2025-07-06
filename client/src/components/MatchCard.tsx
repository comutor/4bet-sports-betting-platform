import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date?: string;
  commenceTime?: string;
  homeOdds: string;
  drawOdds?: string;
  awayOdds: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  eventId: string;
}

export function MatchCard({
  homeTeam,
  awayTeam,
  league,
  time,
  date,
  commenceTime,
  homeOdds,
  drawOdds,
  awayOdds,
  onBetClick,
  eventId
}: MatchCardProps) {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string | null>(() => {
    const saved = localStorage.getItem(`match_${eventId}`);
    return saved || null;
  });

  const handleSelect = (option: string, selection: string, oddsValue: string) => {
    const eventName = `${homeTeam} vs ${awayTeam}`;
    
    if (selected === option) {
      // Deselect if clicking the same option
      setSelected(null);
      localStorage.removeItem(`match_${eventId}`);
    } else {
      // Select new option
      setSelected(option);
      localStorage.setItem(`match_${eventId}`, option);
    }
    
    onBetClick(eventName, selection, oddsValue);
  };

  const formatMatchDateTime = () => {
    if (commenceTime) {
      const matchDate = new Date(commenceTime);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const isToday = matchDate.toDateString() === today.toDateString();
      const isTomorrow = matchDate.toDateString() === tomorrow.toDateString();
      
      let dateStr = '';
      if (isToday) {
        dateStr = 'Today';
      } else if (isTomorrow) {
        dateStr = 'Tomorrow';
      } else {
        dateStr = matchDate.toLocaleDateString('en-GB', { 
          weekday: 'short', 
          day: '2-digit',
          month: '2-digit'
        });
      }
      
      const timeStr = matchDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return `${dateStr} ${timeStr}`;
    }
    
    return date && time ? `${date} ${time}` : time;
  };

  const handleMoreMarkets = () => {
    setLocation(`/more-markets/${eventId}`);
  };

  return (
    <div className="bg-slate-800/50 border border-gray-700/30 rounded-lg p-4">
      {/* Match Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{league}</span>
        <span className="text-xs text-gray-400">{formatMatchDateTime()}</span>
      </div>

      {/* Teams */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{homeTeam}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{awayTeam}</span>
        </div>
      </div>

      {/* Betting Options and More Markets */}
      <div className="flex items-center gap-2">
        {/* Betting Options */}
        <div className={`grid gap-1.5 flex-1 ${drawOdds ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {/* Home Team Bet */}
          <button
            onClick={() => handleSelect('home', homeTeam, homeOdds)}
            className={`p-2 rounded text-xs font-bold transition-all duration-200 ${
              selected === 'home'
                ? 'bg-primary text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-primary hover:text-white'
            }`}
          >
            <div className="text-center">
              <div className="truncate">1</div>
              <div className="font-bold text-white">{homeOdds}</div>
            </div>
          </button>

          {/* Draw Bet (if available) */}
          {drawOdds && (
            <button
              onClick={() => handleSelect('draw', 'Draw', drawOdds)}
              className={`p-2 rounded text-xs font-bold transition-all duration-200 ${
                selected === 'draw'
                  ? 'bg-primary text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-primary hover:text-white'
              }`}
            >
              <div className="text-center">
                <div className="truncate">X</div>
                <div className="font-bold text-white">{drawOdds}</div>
              </div>
            </button>
          )}

          {/* Away Team Bet */}
          <button
            onClick={() => handleSelect('away', awayTeam, awayOdds)}
            className={`p-2 rounded text-xs font-bold transition-all duration-200 ${
              selected === 'away'
                ? 'bg-primary text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-primary hover:text-white'
            }`}
          >
            <div className="text-center">
              <div className="truncate">2</div>
              <div className="font-bold text-white">{awayOdds}</div>
            </div>
          </button>
        </div>

        {/* More Markets Button */}
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 min-w-[50px] text-xs font-medium"
          onClick={handleMoreMarkets}
        >
          +25
        </Button>
      </div>
    </div>
  );
}