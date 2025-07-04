import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SportGame {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  league_name: string;
  country: string;
  country_flag: string;
  priority: number;
  bookmakers: Array<{
    markets: Array<{
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

interface LeagueData {
  league: string;
  country: string;
  flag: string;
  games: SportGame[];
  priority: number;
}

interface SportSectionProps {
  sport: 'basketball' | 'hockey' | 'tennis' | 'baseball' | 'volleyball';
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

const sportConfig = {
  basketball: {
    title: 'Basketball',
    icon: '🏀',
    endpoint: '/api/basketball/leagues'
  },
  hockey: {
    title: 'Ice Hockey',
    icon: '🏒',
    endpoint: '/api/hockey/leagues'
  },
  tennis: {
    title: 'Tennis',
    icon: '🎾',
    endpoint: '/api/tennis/tournaments'
  },
  baseball: {
    title: 'Baseball',
    icon: '⚾',
    endpoint: '/api/baseball/leagues'
  },
  volleyball: {
    title: 'Volleyball',
    icon: '🏐',
    endpoint: '/api/volleyball/leagues'
  }
};

export function SportSection({ sport, onBetClick }: SportSectionProps) {
  const [displayedLeagues, setDisplayedLeagues] = useState<number>(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const config = sportConfig[sport];

  const { data: sportData, isLoading, error } = useQuery<LeagueData[]>({
    queryKey: [config.endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 1000
    ) {
      loadMoreLeagues();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadMoreLeagues = () => {
    if (!sportData || isLoadingMore || displayedLeagues >= sportData.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedLeagues(prev => Math.min(prev + 2, sportData.length));
      setIsLoadingMore(false);
    }, 800);
  };

  const formatMatchTime = (commence_time: string) => {
    const date = new Date(commence_time);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getOdds = (game: SportGame) => {
    if (!game.bookmakers || game.bookmakers.length === 0) {
      return { home: "N/A", away: "N/A", draw: sport === 'basketball' || sport === 'hockey' ? undefined : "N/A" };
    }
    
    const market = game.bookmakers[0]?.markets?.[0];
    if (!market || !market.outcomes) {
      return { home: "N/A", away: "N/A", draw: sport === 'basketball' || sport === 'hockey' ? undefined : "N/A" };
    }
    
    const outcomes = market.outcomes;
    const homeOdds = outcomes.find(o => o.name === game.home_team)?.price;
    const awayOdds = outcomes.find(o => o.name === game.away_team)?.price;
    const drawOdds = outcomes.find(o => o.name === "Draw")?.price;
    
    return {
      home: homeOdds ? homeOdds.toFixed(2) : "N/A",
      away: awayOdds ? awayOdds.toFixed(2) : "N/A",
      draw: sport === 'basketball' || sport === 'hockey' ? undefined : (drawOdds ? drawOdds.toFixed(2) : "N/A")
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-400">Loading {config.title.toLowerCase()} matches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400 mb-4">Failed to load {config.title.toLowerCase()} matches</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!sportData || sportData.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">No {config.title.toLowerCase()} matches available at the moment</p>
      </div>
    );
  }

  const displayedData = sportData.slice(0, displayedLeagues);

  return (
    <div className="space-y-6">
      {/* Basketball Leagues Selection Box */}
      {sport === 'basketball' && (
        <div className="bg-slate-800 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Top Leagues</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-16 border-gray-600 hover:border-blue-500 hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src="/attached_assets/IMG_4098.png" alt="NBA" className="w-8 h-8 object-contain" />
                <span className="text-xs text-white">NBA</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-gray-600 hover:border-blue-500 hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src="/attached_assets/IMG_4094.png" alt="EuroLeague" className="w-8 h-8 object-contain" />
                <span className="text-xs text-white">EuroLeague</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-gray-600 hover:border-blue-500 hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src="/attached_assets/IMG_4096.jpeg" alt="Pro A" className="w-8 h-8 object-contain" />
                <span className="text-xs text-white">Pro A</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-gray-600 hover:border-blue-500 hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src="/attached_assets/IMG_4095.png" alt="Liga Endesa" className="w-8 h-8 object-contain" />
                <span className="text-xs text-white">Liga Endesa</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-gray-600 hover:border-blue-500 hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src="/attached_assets/IMG_4092.png" alt="Turkish BSL" className="w-8 h-8 object-contain" />
                <span className="text-xs text-white">Turkish BSL</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-gray-600 hover:border-blue-500 hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src="/attached_assets/IMG_4097.png" alt="VTB League" className="w-8 h-8 object-contain" />
                <span className="text-xs text-white">VTB League</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">{config.icon}</span>
          {config.title} Matches
        </h2>
        <div className="text-sm text-gray-400">
          Showing {displayedData.length} of {sportData.length} leagues
        </div>
      </div>

      {/* Leagues */}
      <div className="space-y-4">
        {displayedData.map((leagueData) => (
          <LeagueSection
            key={leagueData.league}
            leagueData={leagueData}
            onBetClick={onBetClick}
            formatMatchTime={formatMatchTime}
            getOdds={getOdds}
            sport={sport}
          />
        ))}
      </div>

      {/* Load More Button/Indicator */}
      {displayedLeagues < sportData.length && (
        <div className="flex justify-center py-6">
          {isLoadingMore ? (
            <div className="flex items-center text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading more leagues...
            </div>
          ) : (
            <Button 
              onClick={loadMoreLeagues}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-slate-700"
            >
              Load More Leagues
            </Button>
          )}
        </div>
      )}

      {displayedLeagues >= sportData.length && (
        <div className="text-center py-4">
          <p className="text-gray-500">All leagues loaded</p>
        </div>
      )}
    </div>
  );
}

interface LeagueSectionProps {
  leagueData: LeagueData;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  formatMatchTime: (time: string) => string;
  getOdds: (game: SportGame) => { home: string; away: string; draw?: string };
  sport: string;
}

function LeagueSection({ leagueData, onBetClick, formatMatchTime, getOdds, sport }: LeagueSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* League Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{leagueData.flag}</span>
          <h4 className="font-semibold text-white">{leagueData.league}</h4>
          <span className="text-sm text-gray-400">({leagueData.games.length} matches)</span>
        </div>
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-400`}></i>
      </button>

      {/* Games List */}
      {expanded && (
        <div className="divide-y divide-gray-700">
          {leagueData.games.slice(0, 6).map((game) => {
            const odds = getOdds(game);
            return (
              <div key={game.id} className="p-4 hover:bg-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">
                      {game.league_name} • {formatMatchTime(game.commence_time)}
                    </div>
                    <div className="font-medium text-white">
                      {game.home_team} vs {game.away_team}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4 flex-1 lg:gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-primary hover:text-white flex-1"
                      onClick={() => onBetClick(`${game.home_team} vs ${game.away_team}`, game.home_team, odds.home)}
                    >
                      {odds.home}
                    </Button>
                    {odds.draw && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-primary hover:text-white flex-1"
                        onClick={() => onBetClick(`${game.home_team} vs ${game.away_team}`, "Draw", odds.draw!)}
                      >
                        {odds.draw}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-primary hover:text-white flex-1"
                      onClick={() => onBetClick(`${game.home_team} vs ${game.away_team}`, game.away_team, odds.away)}
                    >
                      {odds.away}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {leagueData.games.length > 6 && (
            <div className="p-3 text-center">
              <button className="text-sm text-primary hover:text-primary-light">
                View all {leagueData.games.length} matches
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}