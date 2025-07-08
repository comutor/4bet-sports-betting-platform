import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FilterBar } from "./FilterBar";
import { AllSection } from "./AllSection";
import { TopLeaguesSection } from "./TopLeaguesSection";
import { CompetitionsSection } from "./CompetitionsSection";
import { LiveSection } from "./LiveSection";

interface SportGame {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: {
    markets: {
      outcomes: {
        name: string;
        price: number;
      }[];
    }[];
  }[];
}

interface LeagueData {
  league: string;
  country?: string;
  flag?: string;
  matches: SportGame[];
}

interface SportSectionProps {
  sport: string;
  onBetClick: (bet: any) => void;
}

const sportConfigs = {
  basketball: {
    title: "Basketball",
    icon: "🏀",
    endpoint: "/api/sports/basketball"
  },
  hockey: {
    title: "Ice Hockey", 
    icon: "🏒",
    endpoint: "/api/sports/hockey"
  },
  baseball: {
    title: "Baseball",
    icon: "⚾",
    endpoint: "/api/sports/baseball"
  },
  volleyball: {
    title: "Volleyball",
    icon: "🏐",
    endpoint: "/api/sports/volleyball"
  },
  afl: {
    title: "AFL",
    icon: "🏉",
    endpoint: "/api/sports/afl"
  },
  "formula-1": {
    title: "Formula 1",
    icon: "🏎️",
    endpoint: "/api/sports/formula1"
  },
  handball: {
    title: "Handball",
    icon: "🤾",
    endpoint: "/api/sports/handball"
  },
  mma: {
    title: "MMA",
    icon: "🥊",
    endpoint: "/api/sports/mma"
  },
  nfl: {
    title: "NFL",
    icon: "🏈",
    endpoint: "/api/sports/nfl"
  },
  rugby: {
    title: "Rugby",
    icon: "🏉",
    endpoint: "/api/sports/rugby"
  }
};

export function SportSection({ sport, onBetClick }: SportSectionProps) {
  const [activeFilter, setActiveFilter] = useState("default");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedLeagues, setDisplayedLeagues] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const config = sportConfigs[sport as keyof typeof sportConfigs];

  const { data: sportData, isLoading, error } = useQuery<LeagueData[]>({
    queryKey: [config.endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const loadMoreLeagues = () => {
    if (!sportData || isLoadingMore || displayedLeagues >= sportData.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedLeagues(prev => Math.min(prev + 2, sportData.length));
      setIsLoadingMore(false);
    }, 800);
  };

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

  const renderFilteredContent = () => {
    switch (activeFilter) {
      case 'all':
        return <AllSection sport={sport} selectedDate={selectedDate} onBetClick={onBetClick} />;
      case 'top-leagues':
        return <TopLeaguesSection sport={sport} onBetClick={onBetClick} />;
      case 'competitions':
        return <CompetitionsSection sport={sport} onBetClick={onBetClick} />;
      case 'live':
        return <LiveSection sport={sport} onBetClick={onBetClick} />;
      default:
        return renderDefaultContent();
    }
  };

  const renderDefaultContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
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

    return <DefaultSportContent 
      sport={sport}
      config={config}
      sportData={sportData}
      displayedLeagues={displayedLeagues}
      onBetClick={onBetClick}
      isLoadingMore={isLoadingMore}
      loadMoreLeagues={loadMoreLeagues}
    />;
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar - Always show this */}
      <FilterBar 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {/* Render filtered content */}
      {renderFilteredContent()}
    </div>
  );
}

// Separate component for rendering the default sport content
function DefaultSportContent({ sport, config, sportData, displayedLeagues, onBetClick, isLoadingMore, loadMoreLeagues }: any) {
  const displayedData = sportData ? sportData.slice(0, displayedLeagues) : [];

  const formatMatchTime = (commence_time: string) => {
    const matchDate = new Date(commence_time);
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
  };

  const getMatchOdds = (game: SportGame) => {
    const markets = game.bookmakers?.[0]?.markets || [];
    const h2hMarket = markets.find(m => m.outcomes?.length >= 2);
    const outcomes = h2hMarket?.outcomes || [];
    
    const homeOdds = outcomes.find(o => o.name === game.home_team)?.price;
    const awayOdds = outcomes.find(o => o.name === game.away_team)?.price;
    const drawOdds = outcomes.find(o => o.name === "Draw")?.price;
    
    return {
      home: homeOdds ? homeOdds.toFixed(2) : "N/A",
      away: awayOdds ? awayOdds.toFixed(2) : "N/A",
      draw: sport === 'basketball' || sport === 'hockey' ? undefined : (drawOdds ? drawOdds.toFixed(2) : "N/A")
    };
  };

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
          Showing {displayedData.length} of {sportData?.length || 0} leagues
        </div>
      </div>

      {/* Leagues */}
      <div className="space-y-4">
        {displayedData.map((league: LeagueData, index: number) => (
          <div key={index} className="bg-slate-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              {league.flag && <span className="text-lg">{league.flag}</span>}
              <h3 className="text-lg font-semibold text-white">{league.league}</h3>
              {league.country && (
                <span className="text-sm text-gray-400">({league.country})</span>
              )}
            </div>
            
            <div className="space-y-3">
              {league.matches.slice(0, 3).map((match: SportGame) => {
                const odds = getMatchOdds(match);
                return (
                  <div
                    key={match.id}
                    className="bg-slate-700 rounded-lg p-3 border border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">
                          {formatMatchTime(match.commence_time)}
                        </div>
                        <div className="text-white font-medium">
                          {match.home_team} vs {match.away_team}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-8 border-gray-500 text-white hover:bg-blue-600"
                          onClick={() => onBetClick({
                            match: `${match.home_team} vs ${match.away_team}`,
                            selection: match.home_team,
                            odds: odds.home
                          })}
                        >
                          {odds.home}
                        </Button>
                        {odds.draw && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-8 border-gray-500 text-white hover:bg-blue-600"
                            onClick={() => onBetClick({
                              match: `${match.home_team} vs ${match.away_team}`,
                              selection: "Draw",
                              odds: odds.draw
                            })}
                          >
                            {odds.draw}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-8 border-gray-500 text-white hover:bg-blue-600"
                          onClick={() => onBetClick({
                            match: `${match.home_team} vs ${match.away_team}`,
                            selection: match.away_team,
                            odds: odds.away
                          })}
                        >
                          {odds.away}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {sportData && displayedLeagues < sportData.length && (
        <div className="flex justify-center">
          <Button
            onClick={loadMoreLeagues}
            disabled={isLoadingMore}
            variant="outline"
            className="border-gray-600 text-white hover:bg-slate-700"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              `Load More Leagues (${sportData.length - displayedLeagues} remaining)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}