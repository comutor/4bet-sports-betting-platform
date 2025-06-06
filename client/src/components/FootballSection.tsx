import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FootballGame {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  country: string;
  league_name: string;
  country_flag: string;
  bookmakers: Array<{
    markets: Array<{
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

interface CountryFootballData {
  country: string;
  flag: string;
  games: FootballGame[];
  isPopular: boolean;
}

interface FootballSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  isInBetslip?: (eventName: string, selection: string) => boolean;
}

export function FootballSection({ onBetClick, isInBetslip }: FootballSectionProps) {
  const [displayedCountries, setDisplayedCountries] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: footballData, isLoading, error } = useQuery<CountryFootballData[]>({
    queryKey: ['/api/football/countries'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 1000
    ) {
      loadMoreCountries();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadMoreCountries = () => {
    if (!footballData || isLoadingMore || displayedCountries >= footballData.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCountries(prev => Math.min(prev + 4, footballData.length));
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

  const getOdds = (game: FootballGame) => {
    if (!game.bookmakers || game.bookmakers.length === 0) {
      return { home: "N/A", draw: "N/A", away: "N/A" };
    }
    
    const market = game.bookmakers[0]?.markets?.[0];
    if (!market || !market.outcomes) {
      return { home: "N/A", draw: "N/A", away: "N/A" };
    }
    
    const outcomes = market.outcomes;
    const homeOdds = outcomes.find(o => o.name === game.home_team)?.price;
    const awayOdds = outcomes.find(o => o.name === game.away_team)?.price;
    const drawOdds = outcomes.find(o => o.name === "Draw")?.price;
    
    return {
      home: homeOdds ? homeOdds.toFixed(2) : "N/A",
      draw: drawOdds ? drawOdds.toFixed(2) : "N/A",
      away: awayOdds ? awayOdds.toFixed(2) : "N/A"
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-400">Loading football matches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load football matches</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!footballData || footballData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No football matches available at the moment</p>
      </div>
    );
  }

  const displayedData = footballData.slice(0, displayedCountries);
  const popularCountries = displayedData.filter(country => country.isPopular);
  const otherCountries = displayedData.filter(country => !country.isPopular);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Football Matches</h2>
        <div className="text-sm text-gray-400">
          Showing {displayedData.length} of {footballData.length} countries
        </div>
      </div>

      {/* Popular Countries Section */}
      {popularCountries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">
            Popular Leagues
          </h3>
          {popularCountries.map((countryData) => (
            <CountrySection
              key={countryData.country}
              countryData={countryData}
              onBetClick={onBetClick}
              formatMatchTime={formatMatchTime}
              getOdds={getOdds}
              isInBetslip={isInBetslip}
            />
          ))}
        </div>
      )}

      {/* Other Countries Section */}
      {otherCountries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">
            All Countries A-Z
          </h3>
          {otherCountries.map((countryData) => (
            <CountrySection
              key={countryData.country}
              countryData={countryData}
              onBetClick={onBetClick}
              formatMatchTime={formatMatchTime}
              getOdds={getOdds}
              isInBetslip={isInBetslip}
            />
          ))}
        </div>
      )}

      {/* Load More Button/Indicator */}
      {displayedCountries < footballData.length && (
        <div className="flex justify-center py-6">
          {isLoadingMore ? (
            <div className="flex items-center text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading more countries...
            </div>
          ) : (
            <Button 
              onClick={loadMoreCountries}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-slate-700"
            >
              Load More Countries
            </Button>
          )}
        </div>
      )}

      {displayedCountries >= footballData.length && (
        <div className="text-center py-4">
          <p className="text-gray-500">All countries loaded</p>
        </div>
      )}
    </div>
  );
}

interface CountrySectionProps {
  countryData: CountryFootballData;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  formatMatchTime: (time: string) => string;
  getOdds: (game: FootballGame) => { home: string; draw: string; away: string };
  isInBetslip?: (eventName: string, selection: string) => boolean;
}

function CountrySection({ countryData, onBetClick, formatMatchTime, getOdds, isInBetslip }: CountrySectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Country Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{countryData.flag}</span>
          <h4 className="font-semibold text-white">{countryData.country}</h4>
          <span className="text-sm text-gray-400">({countryData.games.length} matches)</span>
        </div>
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-400`}></i>
      </button>

      {/* Games List */}
      {expanded && (
        <div className="divide-y divide-gray-700">
          {countryData.games.slice(0, 8).map((game) => {
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
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`min-w-[60px] ${
                        isInBetslip?.(`${game.home_team} vs ${game.away_team}`, game.home_team)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-600 text-gray-300 hover:bg-primary hover:text-white'
                      }`}
                      onClick={() => onBetClick(`${game.home_team} vs ${game.away_team}`, game.home_team, odds.home)}
                    >
                      {odds.home}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`min-w-[60px] ${
                        isInBetslip?.(`${game.home_team} vs ${game.away_team}`, "Draw")
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-600 text-gray-300 hover:bg-primary hover:text-white'
                      }`}
                      onClick={() => onBetClick(`${game.home_team} vs ${game.away_team}`, "Draw", odds.draw)}
                    >
                      {odds.draw}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`min-w-[60px] ${
                        isInBetslip?.(`${game.home_team} vs ${game.away_team}`, game.away_team)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-600 text-gray-300 hover:bg-primary hover:text-white'
                      }`}
                      onClick={() => onBetClick(`${game.home_team} vs ${game.away_team}`, game.away_team, odds.away)}
                    >
                      {odds.away}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {countryData.games.length > 8 && (
            <div className="p-3 text-center">
              <button className="text-sm text-primary hover:text-primary-light">
                View all {countryData.games.length} matches
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}