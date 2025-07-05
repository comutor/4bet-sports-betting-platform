import { useState } from 'react';
import { Trophy, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { MatchCard } from './MatchCard';

interface TopLeaguesSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  onLeagueClick: (leagueId: string, leagueName: string) => void;
  sport?: string;
}



export function TopLeaguesSection({ onBetClick, onLeagueClick, sport = 'football' }: TopLeaguesSectionProps) {
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set());

  // Define top-tier leagues for each sport
  const topLeagues = {
    football: [
      { id: 'premier-league', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'soccer_epl' },
      { id: 'la-liga', name: 'La Liga', country: 'Spain', flag: '🇪🇸', apiKey: 'soccer_spain_la_liga' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', apiKey: 'soccer_germany_bundesliga' },
      { id: 'serie-a', name: 'Serie A', country: 'Italy', flag: '🇮🇹', apiKey: 'soccer_italy_serie_a' },
      { id: 'ligue-1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', apiKey: 'soccer_france_ligue_one' }
    ],
    basketball: [
      { id: 'nba', name: 'NBA', country: 'USA', flag: '🇺🇸', apiKey: 'basketball_nba' },
      { id: 'euroleague', name: 'EuroLeague', country: 'Europe', flag: '🇪🇺', apiKey: 'basketball_euroleague' }
    ],
    tennis: [
      { id: 'atp-masters', name: 'ATP Masters', country: 'World', flag: '🌍', apiKey: 'tennis_atp' },
      { id: 'wta-tour', name: 'WTA Tour', country: 'World', flag: '🌍', apiKey: 'tennis_wta' }
    ],
    'ice-hockey': [
      { id: 'nhl', name: 'NHL', country: 'North America', flag: '🇺🇸', apiKey: 'icehockey_nhl' }
    ]
  };

  // Fetch live top leagues data
  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/top-leagues', sport],
    queryFn: () => fetch(`/api/top-leagues/${sport}`).then(res => res.json()),
  });

  const getSportName = (sport: string) => {
    const names: { [key: string]: string } = {
      football: 'Football',
      basketball: 'Basketball', 
      tennis: 'Tennis',
      'ice-hockey': 'Ice Hockey',
      'american-football': 'American Football',
      baseball: 'Baseball'
    };
    return names[sport] || 'Football';
  };

  // Toggle function for league dropdowns
  const toggleLeague = (league: string) => {
    const newExpanded = new Set(expandedLeagues);
    if (newExpanded.has(league)) {
      newExpanded.delete(league);
    } else {
      newExpanded.add(league);
    }
    setExpandedLeagues(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Get current sport's top leagues and filter matches accordingly
  const currentSportLeagues = topLeagues[sport as keyof typeof topLeagues] || [];
  const leagueApiKeys = currentSportLeagues.map(league => league.apiKey);
  
  // Group matches by league (only showing top leagues)
  const groupedMatches = matches
    .filter(match => {
      // Only show matches from top-tier leagues
      const matchLeague = match.league.toLowerCase();
      return currentSportLeagues.some(league => 
        matchLeague.includes(league.name.toLowerCase()) ||
        matchLeague.includes(league.country.toLowerCase())
      );
    })
    .reduce((acc, match) => {
      const key = match.league;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    }, {} as { [key: string]: any[] });

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Top {getSportName(sport)} Leagues
        </h1>
        <p className="text-gray-400 mt-1">
          Premier competitions with live matches
        </p>
      </div>

      <div className="px-4 py-4">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No top league matches available at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMatches).map(([league, leagueMatches]) => (
              <div key={league} className="border-b border-gray-700/30 pb-4">
                {/* League Dropdown Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleLeague(league)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg text-left"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold text-white">{league}</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {(leagueMatches as any[]).length} matches
                    </span>
                  </div>
                  {expandedLeagues.has(league) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </Button>

                {/* League Dropdown Content - Matches */}
                {expandedLeagues.has(league) && (
                  <div className="mt-3 space-y-3">
                    {(leagueMatches as any[]).map((match: any, index: number) => (
                      <div key={match.id}>
                        <MatchCard
                          eventId={match.id.toString()}
                          homeTeam={match.homeTeam}
                          awayTeam={match.awayTeam}
                          league={match.league}
                          time={new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          homeOdds={match.odds?.home?.toString() || '1.0'}
                          drawOdds={match.odds?.draw?.toString()}
                          awayOdds={match.odds?.away?.toString() || '1.0'}
                          onBetClick={onBetClick}
                        />
                        {index < (leagueMatches as any[]).length - 1 && (
                          <div className="my-3 border-b border-gray-700/20"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}