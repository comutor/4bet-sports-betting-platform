import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface LiveEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  league: string;
  currentTime: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

interface LiveSectionProps {
  sport?: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function LiveSection({ sport, onBetClick }: LiveSectionProps) {
  // Fetch live events from SportMonk API with 5-second refresh
  const { data: allLiveEvents = [], isLoading } = useQuery<LiveEvent[]>({
    queryKey: ['/api/live-events'],
    queryFn: () => fetch('/api/live-events').then(res => res.json()),
    refetchInterval: 5000, // Refresh every 5 seconds for live updates
    refetchOnWindowFocus: true, // Refresh when window gains focus
    staleTime: 0, // Data is immediately stale, always refresh
  });

  // Filter live events by sport if sport is specified
  const filteredEvents = sport ? allLiveEvents.filter(event => {
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
  }) : allLiveEvents;

  const getSportIcon = (sport: string) => {
    switch (sport?.toLowerCase()) {
      case 'football': return 'fas fa-futbol';
      case 'basketball': return 'fas fa-basketball';
      case 'tennis': return 'fas fa-table-tennis';
      case 'ice hockey': 
      case 'hockey': return 'fas fa-hockey-puck';
      case 'baseball': return 'fas fa-baseball';
      default: return 'fas fa-trophy';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading live events...</span>
      </div>
    );
  }

  // Show message if no live events
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <span className="w-3 h-3 bg-live rounded-full animate-pulse mr-2"></span>
          <span className="text-live font-medium">LIVE</span>
        </div>
        <h3 className="text-xl font-medium mb-2">No Live Matches</h3>
        <p className="text-gray-400">
          {sport ? `No live ${sport} matches at the moment.` : 'No live matches currently in progress.'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Live matches will appear here during game time</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-3 h-3 bg-live rounded-full animate-pulse mr-3"></span>
          Live {sport ? sport.charAt(0).toUpperCase() + sport.slice(1).replace('-', ' ') : ''} Betting
        </h2>
        <div className="text-sm text-gray-400">
          <i className="fas fa-broadcast-tower mr-1"></i>
          {filteredEvents.length} Live Events
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-slate-custom rounded-xl p-6 border-2 border-live">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-live rounded-full animate-pulse"></span>
                <span className="text-live font-medium text-sm">LIVE</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{event.league}</div>
                <div className="font-medium">
                  {event.currentTime || 'LIVE'}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <i className={getSportIcon(event.sport)}></i>
                  </div>
                  <div>
                    <div className="font-medium">{event.homeTeam}</div>
                    <div className="text-xs text-gray-400">Home</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-success">{event.homeScore ?? 0}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <i className={getSportIcon(event.sport)}></i>
                  </div>
                  <div>
                    <div className="font-medium">{event.awayTeam}</div>
                    <div className="text-xs text-gray-400">Away</div>
                  </div>
                </div>
                <div className="text-3xl font-bold">{event.awayScore ?? 0}</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-gray-400 mb-2">
                Match Winner
              </div>
              <div className="grid gap-2 grid-cols-3">
                <Button
                  variant="secondary"
                  className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                  onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, event.homeTeam, event.odds?.home?.toFixed(2) || '2.00')}
                >
                  <div className="text-xs text-gray-400">{event.homeTeam}</div>
                  <div className="font-bold">{event.odds?.home?.toFixed(2) || '2.00'}</div>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                  onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, 'Draw', event.odds?.draw?.toFixed(2) || '3.00')}
                >
                  <div className="text-xs text-gray-400">Draw</div>
                  <div className="font-bold">{event.odds?.draw?.toFixed(2) || '3.00'}</div>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                  onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, event.awayTeam, event.odds?.away?.toFixed(2) || '2.50')}
                >
                  <div className="text-xs text-gray-400">{event.awayTeam}</div>
                  <div className="font-bold">{event.odds?.away?.toFixed(2) || '2.50'}</div>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}