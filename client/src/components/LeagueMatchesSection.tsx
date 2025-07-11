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

  // Fetch matches for the specific league using the new league-specific endpoint
  const { data: matches = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/league', leagueId, 'matches'],
    queryFn: async () => {
      const response = await fetch(`/api/league/${leagueId}/matches`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`League "${leagueName}" is not yet available. We're working to add more leagues soon.`);
        }
        throw new Error('Failed to fetch league matches');
      }
      return response.json();
    },
    enabled: !!leagueId,
    retry: false, // Don't retry on 404 errors
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

  if (error) {
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
        </div>

        {/* Error Message */}
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
              <h3 className="text-yellow-300 font-semibold mb-2">League Not Available</h3>
              <p className="text-yellow-200 text-sm">
                {error.message}
              </p>
            </div>
            <Button 
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Top Leagues
            </Button>
          </div>
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
          {Array.isArray(matches) ? matches.length : 0} matches available
        </p>
      </div>

      {/* Matches List */}
      <div className="px-4 py-4">
        {!Array.isArray(matches) || matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No matches available for {leagueName}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group matches by date */}
            {Object.entries(
              (matches || []).reduce((groups: any, match: any) => {
                const matchDate = new Date(match.startTime);
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
                        homeTeam={match.homeTeam}
                        awayTeam={match.awayTeam}
                        league={leagueName}
                        time={new Date(match.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                        commenceTime={match.startTime}
                        homeOdds={match.odds?.home?.toFixed(2) || '0.00'}
                        drawOdds={match.odds?.draw?.toFixed(2)}
                        awayOdds={match.odds?.away?.toFixed(2) || '0.00'}
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