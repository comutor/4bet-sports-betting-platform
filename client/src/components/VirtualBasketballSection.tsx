import { useState, useEffect } from "react";
import { Zap, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualBasketballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  odds: {
    home: string;
    away: string;
    over: string;
    under: string;
    totalPoints: string;
  };
  status: 'upcoming' | 'live' | 'finished';
  quarter?: number;
  timeLeft?: string;
  score?: {
    home: number;
    away: number;
  };
}

interface VirtualBasketballSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function VirtualBasketballSection({ onBetClick }: VirtualBasketballSectionProps) {
  const [matches, setMatches] = useState<VirtualBasketballMatch[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'live' | 'next' | 'results'>('live');

  // Generate virtual basketball matches
  useEffect(() => {
    const generateMatches = () => {
      const teams = [
        "Virtual Lakers", "Digital Warriors", "Cyber Bulls", "Tech Celtics",
        "Net Hawks", "Code Spurs", "Pixel Heat", "Data Nuggets",
        "Binary Rockets", "Logic Knicks", "Storm Kings", "Thunder Nets",
        "Fire Blazers", "Ice Pacers", "Speed Hornets", "Power Pistons"
      ];

      const leagues = [
        "Virtual NBA Elite",
        "Digital Basketball League", 
        "Cyber Court Championship",
        "Virtual Pro Basketball"
      ];

      const newMatches: VirtualBasketballMatch[] = [];
      const now = new Date();

      // Generate 6 matches with different start times
      for (let i = 0; i < 6; i++) {
        const homeTeamIndex = Math.floor(Math.random() * teams.length);
        let awayTeamIndex = Math.floor(Math.random() * teams.length);
        while (awayTeamIndex === homeTeamIndex) {
          awayTeamIndex = Math.floor(Math.random() * teams.length);
        }

        let startTime: Date, status: 'upcoming' | 'live' | 'finished';
        if (i < 2) {
          // Past matches (finished)
          startTime = new Date(now.getTime() - ((2 - i) * 4 * 60 * 1000));
          status = 'finished';
        } else if (i === 2) {
          // Current live match
          startTime = new Date(now.getTime() - (2 * 60 * 1000)); // Started 2 minutes ago
          status = 'live';
        } else {
          // Future matches
          startTime = new Date(now.getTime() + ((i - 2) * 4 * 60 * 1000));
          status = 'upcoming';
        }
        const totalPoints = (180 + Math.random() * 40).toFixed(1); // 180-220 points typical

        newMatches.push({
          id: `basketball-${i}`,
          homeTeam: teams[homeTeamIndex],
          awayTeam: teams[awayTeamIndex],
          league: leagues[Math.floor(Math.random() * leagues.length)],
          startTime: startTime.toISOString(),
          odds: {
            home: (1.4 + Math.random() * 2.2).toFixed(2),
            away: (1.4 + Math.random() * 2.2).toFixed(2),
            over: (1.8 + Math.random() * 0.4).toFixed(2),
            under: (1.8 + Math.random() * 0.4).toFixed(2),
            totalPoints
          },
          status,
          quarter: status === 'live' ? Math.floor(Math.random() * 4) + 1 : undefined,
          timeLeft: status === 'live' ? `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
          score: (status === 'live' || status === 'finished') ? {
            home: Math.floor(Math.random() * 60) + 40,
            away: Math.floor(Math.random() * 60) + 40
          } : undefined
        });
      }

      setMatches(newMatches);
    };

    generateMatches();
    const interval = setInterval(generateMatches, 45000); // Refresh every 45 seconds

    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeUntilMatch = (timeString: string) => {
    const matchTime = new Date(timeString);
    const diff = matchTime.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (diff <= 0) return "LIVE";
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getNextMatchTime = () => {
    const nextMatch = matches.find(m => m.status === 'upcoming');
    return nextMatch ? getTimeUntilMatch(nextMatch.startTime) : "Loading...";
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'live') return match.status === 'live';
    if (activeTab === 'next') return match.status === 'upcoming';
    if (activeTab === 'results') return match.status === 'finished';
    return false;
  });

  const getQuarterText = (quarter: number) => {
    switch (quarter) {
      case 1: return "1st Q";
      case 2: return "2nd Q";
      case 3: return "3rd Q";
      case 4: return "4th Q";
      default: return "Q" + quarter;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-white">Virtual Basketball</h2>
        </div>
        <div className="text-xs text-slate-400">
          Games every 4 minutes
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'live'
              ? 'bg-red-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
        >
          Live
        </button>
        <button
          onClick={() => setActiveTab('next')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'next'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
        >
          Next ({getNextMatchTime()})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'results'
              ? 'bg-green-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
        >
          Results
        </button>
      </div>

      <div className="grid gap-3">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            {/* League and Time */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-slate-400">{match.league}</span>
              </div>
              <div className="flex items-center space-x-2">
                {match.status === 'live' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-500 font-medium">
                      {getQuarterText(match.quarter || 1)} {match.timeLeft}
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
                    <span className="text-xl font-bold text-white">{match.score.home}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white font-medium">{match.awayTeam}</span>
                  {match.score && (
                    <span className="text-xl font-bold text-white">{match.score.away}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Betting Options or Result Info */}
            {match.status === 'upcoming' && (
              <div className="space-y-3">
                {/* Winner Betting */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Match Winner</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                      onClick={() => onBetClick(
                        `${match.homeTeam} vs ${match.awayTeam}`,
                        `${match.homeTeam} Win`,
                        match.odds.home
                      )}
                    >
                      <div className="text-center">
                        <div className="text-xs">{match.homeTeam}</div>
                        <div className="font-bold">{match.odds.home}</div>
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
                    >
                      <div className="text-center">
                        <div className="text-xs">{match.awayTeam}</div>
                        <div className="font-bold">{match.odds.away}</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Total Points Betting */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Total Points ({match.odds.totalPoints})</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                      onClick={() => onBetClick(
                        `${match.homeTeam} vs ${match.awayTeam}`,
                        `Over ${match.odds.totalPoints}`,
                        match.odds.over
                      )}
                    >
                      <div className="text-center">
                        <div className="text-xs">Over</div>
                        <div className="font-bold">{match.odds.over}</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                      onClick={() => onBetClick(
                        `${match.homeTeam} vs ${match.awayTeam}`,
                        `Under ${match.odds.totalPoints}`,
                        match.odds.under
                      )}
                    >
                      <div className="text-center">
                        <div className="text-xs">Under</div>
                        <div className="font-bold">{match.odds.under}</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {match.status === 'live' && (
              <div className="mt-3 text-center">
                <span className="text-xs text-yellow-500">
                  Live betting disabled - game in progress
                </span>
              </div>
            )}

            {match.status === 'finished' && match.score && (
              <div className="mt-3 space-y-2">
                <div className="text-center">
                  <div className="text-xs text-green-400 font-medium">
                    Final: {match.score.home > match.score.away ? match.homeTeam : match.awayTeam} Won
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">
                    Total Points: {match.score.home + match.score.away} 
                    {(match.score.home + match.score.away) > parseFloat(match.odds.totalPoints) ? ' (Over)' : ' (Under)'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <div className="text-xs text-slate-400">
          Next game starts in {getTimeUntilMatch(matches[1]?.startTime || new Date().toISOString())}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <div className="text-center">
          <h4 className="font-medium text-white mb-1">Virtual Basketball</h4>
          <p className="text-xs text-slate-300">
            Fast-paced virtual basketball games with realistic scoring and betting options. 
            Bet on match winners and total points with games every 4 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}