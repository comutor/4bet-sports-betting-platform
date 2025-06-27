import { useState, useEffect } from "react";
import { Play, Clock, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  odds: {
    home: string;
    draw: string;
    away: string;
  };
  status: 'upcoming' | 'live' | 'finished';
  minute?: number;
  score?: {
    home: number;
    away: number;
  };
}

interface VirtualFootballSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function VirtualFootballSection({ onBetClick }: VirtualFootballSectionProps) {
  const [matches, setMatches] = useState<VirtualMatch[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Generate virtual matches
  useEffect(() => {
    const generateMatches = () => {
      const teams = [
        "Real Madrid", "Barcelona", "Manchester United", "Liverpool", "Chelsea",
        "Arsenal", "Manchester City", "Bayern Munich", "PSG", "Juventus",
        "AC Milan", "Inter Milan", "Atletico Madrid", "Borussia Dortmund",
        "Ajax", "Tottenham", "Leicester City", "Valencia", "Napoli", "AS Roma"
      ];

      const leagues = [
        "Virtual Premier League",
        "Virtual La Liga", 
        "Virtual Serie A",
        "Virtual Bundesliga",
        "Virtual Champions League"
      ];

      const newMatches: VirtualMatch[] = [];
      const now = new Date();

      // Generate 8 matches with different start times
      for (let i = 0; i < 8; i++) {
        const homeTeamIndex = Math.floor(Math.random() * teams.length);
        let awayTeamIndex = Math.floor(Math.random() * teams.length);
        while (awayTeamIndex === homeTeamIndex) {
          awayTeamIndex = Math.floor(Math.random() * teams.length);
        }

        const startTime = new Date(now.getTime() + (i * 3 * 60 * 1000)); // Every 3 minutes
        const status = i === 0 ? 'live' : (i < 3 ? 'upcoming' : 'upcoming');

        newMatches.push({
          id: `virtual-${i}`,
          homeTeam: teams[homeTeamIndex],
          awayTeam: teams[awayTeamIndex],
          league: leagues[Math.floor(Math.random() * leagues.length)],
          startTime: startTime.toISOString(),
          odds: {
            home: (1.5 + Math.random() * 2).toFixed(2),
            draw: (2.8 + Math.random() * 1.4).toFixed(2),
            away: (1.5 + Math.random() * 2).toFixed(2)
          },
          status,
          minute: status === 'live' ? Math.floor(Math.random() * 90) + 1 : undefined,
          score: status === 'live' ? {
            home: Math.floor(Math.random() * 4),
            away: Math.floor(Math.random() * 4)
          } : undefined
        });
      }

      setMatches(newMatches);
    };

    generateMatches();
    const interval = setInterval(generateMatches, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getTimeUntilMatch = (timeString: string) => {
    const matchTime = new Date(timeString);
    const diff = matchTime.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (diff <= 0) return "LIVE";
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-white">Virtual Football</h2>
        </div>
        <div className="text-xs text-slate-400">
          Matches every 3 minutes
        </div>
      </div>

      <div className="grid gap-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            {/* League and Time */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-slate-400">{match.league}</span>
              </div>
              <div className="flex items-center space-x-2">
                {match.status === 'live' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-500 font-medium">
                      {match.minute}'
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {getTimeUntilMatch(match.startTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{match.homeTeam}</span>
                  {match.score && (
                    <span className="text-lg font-bold text-white">{match.score.home}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white font-medium">{match.awayTeam}</span>
                  {match.score && (
                    <span className="text-lg font-bold text-white">{match.score.away}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Betting Options */}
            {match.status !== 'finished' && (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                  onClick={() => onBetClick(
                    `${match.homeTeam} vs ${match.awayTeam}`,
                    `${match.homeTeam} Win`,
                    match.odds.home
                  )}
                  disabled={match.status === 'live'}
                >
                  <div className="text-center">
                    <div className="text-xs">1</div>
                    <div className="font-bold">{match.odds.home}</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                  onClick={() => onBetClick(
                    `${match.homeTeam} vs ${match.awayTeam}`,
                    "Draw",
                    match.odds.draw
                  )}
                  disabled={match.status === 'live'}
                >
                  <div className="text-center">
                    <div className="text-xs">X</div>
                    <div className="font-bold">{match.odds.draw}</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                  onClick={() => onBetClick(
                    `${match.homeTeam} vs ${match.awayTeam}`,
                    `${match.awayTeam} Win`,
                    match.odds.away
                  )}
                  disabled={match.status === 'live'}
                >
                  <div className="text-center">
                    <div className="text-xs">2</div>
                    <div className="font-bold">{match.odds.away}</div>
                  </div>
                </Button>
              </div>
            )}

            {match.status === 'live' && (
              <div className="mt-2 text-center">
                <span className="text-xs text-yellow-500">
                  Live betting disabled - match in progress
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <div className="text-xs text-slate-400">
          Next match starts in {getTimeUntilMatch(matches[1]?.startTime || new Date().toISOString())}
        </div>
      </div>
    </div>
  );
}