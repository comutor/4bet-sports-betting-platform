import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MatchCard } from './MatchCard';

interface AllSectionProps {
  selectedDate: Date;
  sport?: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function AllSection({ selectedDate, sport, onBetClick }: AllSectionProps) {
  // Format date for API call
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  
  // Fetch all events for the selected date
  const { data: allEvents = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/events/by-date', dateString],
    queryFn: () => fetch(`/api/events/by-date?date=${dateString}`).then(res => res.json()),
    enabled: !!selectedDate,
  });

  // Filter events by sport if sport is specified
  const events = sport ? allEvents.filter(event => {
    const eventSport = event.sport?.toLowerCase();
    const selectedSport = sport.toLowerCase();
    
    // Handle sport name mappings
    if (selectedSport === 'football' && eventSport === 'football') return true;
    if (selectedSport === 'basketball' && eventSport === 'basketball') return true;
    if (selectedSport === 'tennis' && eventSport === 'tennis') return true;
    if ((selectedSport === 'ice-hockey' || selectedSport === 'hockey') && eventSport === 'ice hockey') return true;
    if (selectedSport === 'american-football' && eventSport === 'american football') return true;
    if (selectedSport === 'baseball' && eventSport === 'baseball') return true;
    
    return false;
  }) : allEvents;

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
          All {sport ? sport.charAt(0).toUpperCase() + sport.slice(1).replace('-', ' ') : ''} Matches
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
              const sportTitle = event.sport || 'Other';
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
                      homeTeam={event.homeTeam}
                      awayTeam={event.awayTeam}
                      league={event.league}
                      time={new Date(event.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                      commenceTime={event.startTime}
                      homeOdds={event.odds?.home?.toString() || '0.00'}
                      drawOdds={event.odds?.draw?.toString()}
                      awayOdds={event.odds?.away?.toString() || '0.00'}
                      onBetClick={onBetClick}
                      eventId={event.id.toString()}
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