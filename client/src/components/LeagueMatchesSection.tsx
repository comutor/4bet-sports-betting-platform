import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { Button } from './ui/button';

interface LeagueMatchesSectionProps {
  leagueId: string;
  leagueName: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  onBack: () => void;
}

export function LeagueMatchesSection({ 
  leagueId, 
  leagueName, 
  onBetClick, 
  onBack 
}: LeagueMatchesSectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Map league IDs to sport keys for API calls
  const getLeagueSportKey = (leagueId: string) => {
    const leagueMapping: { [key: string]: string } = {
      'premier-league': 'soccer_epl',
      'la-liga': 'soccer_spain_la_liga',
      'bundesliga': 'soccer_germany_bundesliga',
      'serie-a': 'soccer_italy_serie_a',
      'ligue-1': 'soccer_france_ligue_one',
      'nba': 'basketball_nba',
      'euroleague': 'basketball_euroleague',
      'wimbledon': 'tennis_atp',
      'us-open': 'tennis_atp',
      'french-open': 'tennis_atp',
      'australian-open': 'tennis_atp',
      'nhl': 'icehockey_nhl',
      'khl': 'icehockey_khl',
      'nfl': 'americanfootball_nfl',
      'mlb': 'baseball_mlb'
    };
    return leagueMapping[leagueId] || 'soccer_epl';
  };

  const sportKey = getLeagueSportKey(leagueId);

  // Fetch matches for the specific league
  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/odds', sportKey],
    enabled: !!leagueId,
  });

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Header with Back Button */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {leagueName}
          </h1>
        </div>
        <p className="text-gray-400">
          {matches.length} matches available
        </p>
      </div>

      {/* Matches List */}
      <div className="px-4 py-4">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No matches available for {leagueName}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group matches by date */}
            {Object.entries(
              matches.reduce((groups: any, match: any) => {
                const matchDate = new Date(match.commence_time);
                const dateKey = matchDate.toDateString();
                if (!groups[dateKey]) {
                  groups[dateKey] = [];
                }
                groups[dateKey].push(match);
                return groups;
              }, {})
            ).map(([dateKey, dayMatches]: [string, any]) => (
              <div key={dateKey} className="space-y-3">
                {/* Date Header */}
                <div className="px-2 py-2 border-b border-gray-700/30">
                  <h3 className="text-base font-semibold text-white">
                    {formatDate(new Date(dateKey))}
                  </h3>
                </div>

                {/* Matches for this date */}
                <div className="space-y-3">
                  {(dayMatches as any[]).map((match, index) => (
                    <div key={match.id || index}>
                      <MatchCard
                        homeTeam={match.home_team}
                        awayTeam={match.away_team}
                        league={leagueName}
                        time={new Date(match.commence_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                        commenceTime={match.commence_time}
                        homeOdds={match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price?.toFixed(2) || '0.00'}
                        drawOdds={match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toFixed(2)}
                        awayOdds={match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price?.toFixed(2) || '0.00'}
                        onBetClick={onBetClick}
                        eventId={match.id}
                        sport="Football"
                      />
                      {index < (dayMatches as any[]).length - 1 && (
                        <div className="mx-2 border-b border-gray-700/30"></div>
                      )}
                    </div>
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