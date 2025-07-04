import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MatchCard } from './MatchCard';

interface AllSectionProps {
  selectedDate: Date;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function AllSection({ selectedDate, onBetClick }: AllSectionProps) {
  // Format date for API call
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  
  // Fetch all events for the selected date
  const { data: events = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/events/by-date', dateString],
    enabled: !!selectedDate,
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
      return format(date, 'EEEE, MMMM d');
    }
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

  return (
    <div className="py-4">
      {/* Date Header */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-1">
          All Matches
        </h2>
        <p className="text-sm text-gray-400">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Events by Sport */}
      {events.length === 0 ? (
        <div className="px-4 py-4 text-center">
          <p className="text-gray-400">No events found for {formatDate(selectedDate)}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group events by sport */}
          {Object.entries(
            events.reduce((groups: any, event: any) => {
              const sportTitle = event.sport_title || 'Other';
              if (!groups[sportTitle]) {
                groups[sportTitle] = [];
              }
              groups[sportTitle].push(event);
              return groups;
            }, {})
          ).map(([sportTitle, sportEvents]: [string, any]) => (
            <div key={sportTitle}>
              {/* Sport Header */}
              <div className="px-4 mb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="text-primary">●</span>
                  {sportTitle}
                  <span className="text-xs text-gray-400">({(sportEvents as any[]).length})</span>
                </h3>
              </div>

              {/* Sport Events */}
              <div className="space-y-3">
                {(sportEvents as any[]).map((event, index) => (
                  <div key={event.id || index}>
                    <MatchCard
                      homeTeam={event.home_team}
                      awayTeam={event.away_team}
                      league={event.sport_title}
                      time={new Date(event.commence_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                      homeOdds={event.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === event.home_team)?.price?.toString() || '0.00'}
                      drawOdds={event.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toString()}
                      awayOdds={event.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === event.away_team)?.price?.toString() || '0.00'}
                      onBetClick={onBetClick}
                      eventId={event.id}
                    />
                    {index < (sportEvents as any[]).length - 1 && (
                      <div className="mx-4 border-b border-gray-700/30"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}