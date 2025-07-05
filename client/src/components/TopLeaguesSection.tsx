import { Trophy, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MatchCard } from './MatchCard';

interface TopLeaguesSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  onLeagueClick: (leagueId: string, leagueName: string) => void;
  sport?: string;
}



export function TopLeaguesSection({ onBetClick, onLeagueClick, sport = 'football' }: TopLeaguesSectionProps) {
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

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Group matches by league
  const groupedMatches = matches.reduce((acc, match) => {
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
          <div className="space-y-6">
            {Object.entries(groupedMatches).map(([league, leagueMatches]) => (
              <div key={league} className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">{league}</h3>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    {leagueMatches.length} matches
                  </span>
                </div>
                <div className="space-y-3">
                  {leagueMatches.map((match: any) => (
                    <MatchCard
                      key={match.id}
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}