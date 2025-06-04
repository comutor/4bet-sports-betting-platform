import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface FeaturedEventsProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function FeaturedEvents({ onBetClick }: FeaturedEventsProps) {
  const { data: footballData, isLoading: footballLoading } = useQuery({
    queryKey: ['/api/football/matches'],
  });

  const { data: basketballData, isLoading: basketballLoading } = useQuery({
    queryKey: ['/api/basketball/leagues'],
  });

  const { data: liveData, isLoading: liveLoading } = useQuery({
    queryKey: ['/api/live-events'],
  });

  const { data: tennisData, isLoading: tennisLoading } = useQuery({
    queryKey: ['/api/tennis/tournaments'],
  });

  // Extract basketball games from league data
  const basketballGames = Array.isArray(basketballData) ? basketballData.flatMap((league: any) => league.games || []) : [];

  const renderMatchCard = (match: any, sport: string, index: number) => {
    const getSportIcon = (sportType: string) => {
      switch (sportType) {
        case 'football': return 'fas fa-futbol';
        case 'basketball': return 'fas fa-basketball-ball';
        case 'tennis': return 'fas fa-table-tennis';
        default: return 'fas fa-trophy';
      }
    };

    const matchKey = match.id || match.event_id || `${sport}-${index}-${Date.now()}`;
    
    return (
      <div key={matchKey} className="bg-slate-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">{match.league || match.league_name || match.tournament || 'League'}</span>
          <span className="text-xs text-gray-400">
            {match.time || (match.commence_time ? new Date(match.commence_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD')}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{match.homeTeam || match.home_team}</span>
            {match.homeScore && <span className="text-lg font-bold">{match.homeScore}</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{match.awayTeam || match.away_team}</span>
            {match.awayScore && <span className="text-lg font-bold">{match.awayScore}</span>}
          </div>
        </div>
        
        <div className="flex gap-1 justify-between">
          <Button
            variant="secondary"
            className="bg-slate-700 hover:bg-primary text-center py-1.5 px-2 transition-colors flex-1 min-w-0"
            onClick={() => onBetClick(
              `${match.homeTeam || match.home_team} vs ${match.awayTeam || match.away_team}`, 
              match.homeTeam || match.home_team, 
              match.homeOdds || match.odds?.home || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === (match.homeTeam || match.home_team))?.price?.toFixed(2) || 'N/A'
            )}
          >
            <div className="text-xs text-gray-400 leading-none">1</div>
            <div className="text-sm font-bold leading-none">{match.homeOdds || match.odds?.home || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === (match.homeTeam || match.home_team))?.price?.toFixed(2) || 'N/A'}</div>
          </Button>
          {(match.drawOdds || match.odds?.draw || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')) && (
            <Button
              variant="secondary"
              className="bg-slate-700 hover:bg-primary text-center py-1.5 px-2 transition-colors flex-1 min-w-0"
              onClick={() => onBetClick(
                `${match.homeTeam || match.home_team} vs ${match.awayTeam || match.away_team}`, 
                'Draw', 
                match.drawOdds || match.odds?.draw || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toFixed(2) || 'N/A'
              )}
            >
              <div className="text-xs text-gray-400 leading-none">X</div>
              <div className="text-sm font-bold leading-none">{match.drawOdds || match.odds?.draw || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toFixed(2) || 'N/A'}</div>
            </Button>
          )}
          <Button
            variant="secondary"
            className="bg-slate-700 hover:bg-primary text-center py-1.5 px-2 transition-colors flex-1 min-w-0"
            onClick={() => onBetClick(
              `${match.homeTeam || match.home_team} vs ${match.awayTeam || match.away_team}`, 
              match.awayTeam || match.away_team, 
              match.awayOdds || match.odds?.away || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === (match.awayTeam || match.away_team))?.price?.toFixed(2) || 'N/A'
            )}
          >
            <div className="text-xs text-gray-400 leading-none">2</div>
            <div className="text-sm font-bold leading-none">{match.awayOdds || match.odds?.away || match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === (match.awayTeam || match.away_team))?.price?.toFixed(2) || 'N/A'}</div>
          </Button>
        </div>
      </div>
    );
  };

  const renderSportSection = (title: string, icon: string, data: any, isLoading: boolean, sportType: string) => {
    if (isLoading) {
      return (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <i className={`${icon} mr-3`}></i>
              {title}
            </h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-gray-400">Loading {title.toLowerCase()}...</span>
          </div>
        </div>
      );
    }

    // Handle different data structures from various APIs
    let matchesArray: any[] = [];
    if (Array.isArray(data)) {
      matchesArray = data;
    } else if (data && typeof data === 'object') {
      // For nested data structures (e.g., grouped by league/country)
      matchesArray = Object.values(data).flat();
    }

    const matches = matchesArray.slice(0, 5);
    const totalMatches = matchesArray.length;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <i className={`${icon} mr-3`}></i>
            {title}
          </h3>
          <Button 
            variant="outline" 
            className="text-primary border-primary hover:bg-primary hover:text-white"
            onClick={() => {/* Navigate to sport section */}}
          >
            View All ({totalMatches})
          </Button>
        </div>
        
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {matches.map((match: any, index: number) => renderMatchCard(match, sportType, index))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No {title.toLowerCase()} available
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
        <i className="fas fa-fire text-live mr-3"></i>
        Featured Matches
      </h2>
      
      {renderSportSection('Football', 'fas fa-futbol', footballData || [], footballLoading, 'football')}
      {renderSportSection('Basketball', 'fas fa-basketball-ball', basketballGames, basketballLoading, 'basketball')}
      {renderSportSection('Live Now', 'fas fa-broadcast-tower', liveData || [], liveLoading, 'live')}
      {renderSportSection('Tennis', 'fas fa-table-tennis', tennisData || [], tennisLoading, 'tennis')}
    </div>
  );
}
