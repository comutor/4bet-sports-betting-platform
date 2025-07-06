import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface LiveEvent {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  league: string;
  time: string;
  liveMarket: {
    name: string;
    options: { label: string; odds: string }[];
  };
}

interface LiveSectionProps {
  sport?: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function LiveSection({ sport, onBetClick }: LiveSectionProps) {
  // Fetch live events from API
  const { data: allLiveEvents = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/live-events'],
    queryFn: () => fetch('/api/live-events').then(res => res.json()),
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading live events...</span>
      </div>
    );
  }

  const mockEvents: LiveEvent[] = [
    {
      id: 1,
      homeTeam: "Manchester City",
      awayTeam: "Tottenham",
      homeScore: 2,
      awayScore: 1,
      sport: "football",
      league: "Premier League",
      time: "67:43",
      liveMarket: {
        name: "Next Goal",
        options: [
          { label: "Man City", odds: "1.75" },
          { label: "No Goal", odds: "3.20" },
          { label: "Tottenham", odds: "4.50" }
        ]
      }
    },
    {
      id: 2,
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      homeScore: 89,
      awayScore: 92,
      sport: "basketball",
      league: "NBA",
      time: "Q3 08:45",
      liveMarket: {
        name: "Total Points (Over/Under)",
        options: [
          { label: "Over 210.5", odds: "1.90" },
          { label: "Under 210.5", odds: "1.90" }
        ]
      }
    }
  ];

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'football': return 'fas fa-futbol';
      case 'basketball': return 'fas fa-basketball';
      default: return 'fas fa-trophy';
    }
  };

  // Use filtered events if available, otherwise fall back to mock events for the selected sport
  const displayEvents = filteredEvents.length > 0 ? filteredEvents : 
    mockEvents.filter(event => !sport || event.sport.toLowerCase() === sport.toLowerCase());

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-3 h-3 bg-live rounded-full animate-pulse mr-3"></span>
          Live {sport ? sport.charAt(0).toUpperCase() + sport.slice(1).replace('-', ' ') : ''} Betting
        </h2>
        <div className="text-sm text-gray-400">
          <i className="fas fa-broadcast-tower mr-1"></i>
          {displayEvents.length} Live Events
        </div>
      </div>
      
      {displayEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No live {sport ? sport.replace('-', ' ') : ''} events at the moment</p>
          <p className="text-sm mt-2">Check back later for live matches</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayEvents.map((event) => (
          <div key={event.id} className="bg-slate-custom rounded-xl p-6 border-2 border-live">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-live rounded-full animate-pulse"></span>
                <span className="text-live font-medium text-sm">LIVE</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{event.league}</div>
                <div className="font-medium">
                  {event.time || event.currentTime || 'LIVE'}
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
                {event.liveMarket?.name || "Match Winner"}
              </div>
              <div className={`grid gap-2 ${
                event.liveMarket?.options?.length === 3 ? 'grid-cols-3' : 
                event.homeOdds && event.drawOdds && event.awayOdds ? 'grid-cols-3' : 'grid-cols-2'
              }`}>
                {event.liveMarket?.options ? 
                  event.liveMarket.options.map((option: any, index: number) => (
                    <Button
                      key={index}
                      variant="secondary"
                      className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                      onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, option.label, option.odds)}
                    >
                      <div className="text-xs text-gray-400">{option.label}</div>
                      <div className="font-bold">{option.odds}</div>
                    </Button>
                  )) :
                  // Fallback to standard market structure from API
                  <>
                    {event.homeOdds && (
                      <Button
                        variant="secondary"
                        className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                        onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, event.homeTeam || 'Home', event.homeOdds)}
                      >
                        <div className="text-xs text-gray-400">{event.homeTeam || 'Home'}</div>
                        <div className="font-bold">{event.homeOdds}</div>
                      </Button>
                    )}
                    {event.drawOdds && (
                      <Button
                        variant="secondary"
                        className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                        onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, 'Draw', event.drawOdds)}
                      >
                        <div className="text-xs text-gray-400">Draw</div>
                        <div className="font-bold">{event.drawOdds}</div>
                      </Button>
                    )}
                    {event.awayOdds && (
                      <Button
                        variant="secondary"
                        className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                        onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, event.awayTeam || 'Away', event.awayOdds)}
                      >
                        <div className="text-xs text-gray-400">{event.awayTeam || 'Away'}</div>
                        <div className="font-bold">{event.awayOdds}</div>
                      </Button>
                    )}
                  </>
                }
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
