import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Zap, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualTennisMatch {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  round: string;
  startTime: string;
  odds: {
    player1: string;
    player2: string;
  };
  status: 'upcoming' | 'live' | 'finished';
  currentSet?: number;
  sets?: {
    player1: number[];
    player2: number[];
  };
  currentScore?: {
    player1: number;
    player2: number;
  };
}

interface VirtualTennisSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function VirtualTennisSection({ onBetClick }: VirtualTennisSectionProps) {
  const [, setLocation] = useLocation();
  const [matches, setMatches] = useState<VirtualTennisMatch[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'live' | 'next' | 'results'>('live');

  // Generate virtual tennis matches
  useEffect(() => {
    const generateMatches = () => {
      const players = [
        "N. Djokovic", "C. Alcaraz", "D. Medvedev", "J. Sinner", "A. Rublev",
        "S. Tsitsipas", "R. Nadal", "H. Hurkacz", "T. Fritz", "A. Zverev",
        "F. Auger-Aliassime", "M. Berrettini", "C. Ruud", "B. Shelton",
        "T. Paul", "G. Dimitrov", "A. Rune", "S. Korda", "L. Musetti", "U. Humbert"
      ];

      const tournaments = [
        "Virtual ATP Masters",
        "Digital Grand Slam", 
        "Cyber Open Championship",
        "Virtual Tennis Pro Tour",
        "Elite Digital Cup"
      ];

      const rounds = ["First Round", "Second Round", "Quarter Final", "Semi Final", "Final"];

      const newMatches: VirtualTennisMatch[] = [];
      const now = new Date();

      // Generate 6 matches with different start times
      for (let i = 0; i < 6; i++) {
        const player1Index = Math.floor(Math.random() * players.length);
        let player2Index = Math.floor(Math.random() * players.length);
        while (player2Index === player1Index) {
          player2Index = Math.floor(Math.random() * players.length);
        }

        let startTime: Date, status: 'upcoming' | 'live' | 'finished';
        if (i < 2) {
          // Past matches (finished)
          startTime = new Date(now.getTime() - ((2 - i) * 5 * 60 * 1000));
          status = 'finished';
        } else if (i === 2) {
          // Current live match
          startTime = new Date(now.getTime() - (2 * 60 * 1000)); // Started 2 minutes ago
          status = 'live';
        } else {
          // Future matches
          startTime = new Date(now.getTime() + ((i - 2) * 5 * 60 * 1000));
          status = 'upcoming';
        }

        // Generate sets and scores
        let sets, currentScore, currentSet;
        if (status === 'live') {
          currentSet = Math.floor(Math.random() * 3) + 1;
          sets = {
            player1: [] as number[],
            player2: [] as number[]
          };
          // Generate completed sets
          for (let s = 0; s < currentSet - 1; s++) {
            const set1 = Math.random() > 0.5 ? 6 : Math.floor(Math.random() * 6) + 1;
            const set2 = set1 === 6 ? Math.floor(Math.random() * 5) : 6;
            sets.player1.push(set1);
            sets.player2.push(set2);
          }
          // Current set score
          currentScore = {
            player1: Math.floor(Math.random() * 7),
            player2: Math.floor(Math.random() * 7)
          };
        } else if (status === 'finished') {
          currentSet = 3;
          sets = {
            player1: [] as number[],
            player2: [] as number[]
          };
          // Generate 2-3 completed sets
          const numSets = Math.random() > 0.5 ? 2 : 3;
          for (let s = 0; s < numSets; s++) {
            const set1 = Math.random() > 0.5 ? 6 : Math.floor(Math.random() * 6) + 1;
            const set2 = set1 === 6 ? Math.floor(Math.random() * 5) : 6;
            sets.player1.push(set1);
            sets.player2.push(set2);
          }
        }

        newMatches.push({
          id: `tennis-${i}`,
          player1: players[player1Index],
          player2: players[player2Index],
          tournament: tournaments[Math.floor(Math.random() * tournaments.length)],
          round: rounds[Math.floor(Math.random() * rounds.length)],
          startTime: startTime.toISOString(),
          odds: {
            player1: (1.3 + Math.random() * 2.5).toFixed(2),
            player2: (1.3 + Math.random() * 2.5).toFixed(2)
          },
          status,
          currentSet,
          sets,
          currentScore
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

  const getMatchWinner = (match: VirtualTennisMatch) => {
    if (!match.sets) return null;
    const setsWon1 = match.sets.player1.filter((set, i) => set > match.sets!.player2[i]).length;
    const setsWon2 = match.sets.player2.filter((set, i) => set > match.sets!.player1[i]).length;
    return setsWon1 > setsWon2 ? match.player1 : match.player2;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold text-white">Virtual Tennis</h2>
        </div>
        <div className="text-xs text-slate-400">
          Matches every 5 minutes
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
          <span>Next (</span>
          <span className="text-white">{getNextMatchTime()}</span>
          <span>)</span>
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
            {/* Tournament and Time */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-green-500" />
                <div>
                  <span className="text-xs text-slate-400">{match.tournament}</span>
                  <div className="text-xs text-slate-500">{match.round}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {match.status === 'live' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-500 font-medium">
                      Set {match.currentSet}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {match.status === 'finished' ? 'Finished' : getTimeUntilMatch(match.startTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Players and Scores */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{match.player1}</span>
                <div className="flex items-center space-x-2">
                  {match.sets && (
                    <div className="flex space-x-1">
                      {match.sets.player1.map((set, i) => (
                        <span key={i} className="text-sm bg-slate-700 px-1 rounded">
                          {set}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.currentScore && match.status === 'live' && (
                    <span className="text-lg font-bold text-white">{match.currentScore.player1}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{match.player2}</span>
                <div className="flex items-center space-x-2">
                  {match.sets && (
                    <div className="flex space-x-1">
                      {match.sets.player2.map((set, i) => (
                        <span key={i} className="text-sm bg-slate-700 px-1 rounded">
                          {set}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.currentScore && match.status === 'live' && (
                    <span className="text-lg font-bold text-white">{match.currentScore.player2}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Betting Options or Result Info */}
            {match.status === 'upcoming' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                    onClick={() => onBetClick(
                      `${match.player1} vs ${match.player2}`,
                      `${match.player1} to Win`,
                      match.odds.player1
                    )}
                  >
                    <div className="text-center">
                      <div className="text-xs">{match.player1}</div>
                      <div className="font-bold">{match.odds.player1}</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-blue-600 hover:border-blue-600 text-white"
                    onClick={() => onBetClick(
                      `${match.player1} vs ${match.player2}`,
                      `${match.player2} to Win`,
                      match.odds.player2
                    )}
                  >
                    <div className="text-center">
                      <div className="text-xs">{match.player2}</div>
                      <div className="font-bold">{match.odds.player2}</div>
                    </div>
                  </Button>
                </div>
                
                {/* More Markets Button */}
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-4 text-xs font-medium"
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        homeTeam: encodeURIComponent(match.player1),
                        awayTeam: encodeURIComponent(match.player2),
                        league: encodeURIComponent(match.tournament),
                        commenceTime: match.startTime,
                        sport: 'Tennis'
                      });
                      setLocation(`/more-markets/virtual-${match.id}?${queryParams.toString()}`);
                    }}
                  >
                    +25
                  </Button>
                </div>
              </div>
            )}

            {match.status === 'live' && (
              <div className="mt-3 text-center">
                <span className="text-xs text-yellow-500">
                  Live betting disabled - match in progress
                </span>
              </div>
            )}

            {match.status === 'finished' && (
              <div className="mt-3 text-center">
                <div className="text-xs text-green-400 font-medium">
                  Winner: {getMatchWinner(match)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <div className="text-xs text-slate-400">
          Next match starts in <span className="text-white">{getNextMatchTime()}</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <div className="text-center">
          <h4 className="font-medium text-white mb-1">Virtual Tennis</h4>
          <p className="text-xs text-slate-300">
            Professional virtual tennis matches with real player names and realistic scoring. 
            Matches every 5 minutes with set-by-set results.
          </p>
        </div>
      </div>
    </div>
  );
}