import { Button } from "@/components/ui/button";
import { FeaturedEvent } from "@/lib/betting-data";

interface FeaturedEventsProps {
  events: FeaturedEvent[];
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function FeaturedEvents({ events, onBetClick }: FeaturedEventsProps) {
  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'football': return 'fas fa-futbol';
      case 'basketball': return 'fas fa-basketball';
      case 'american_football': return 'fas fa-football';
      default: return 'fas fa-trophy';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-fire text-live mr-3"></i>
        Featured Events
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="bg-slate-custom rounded-xl p-6 border border-gray-700 hover:border-primary transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                event.status === 'live' 
                  ? 'bg-live text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {event.status === 'live' ? 'LIVE' : event.time}
              </span>
              <span className="text-gray-400 text-sm">
                {event.status === 'live' ? event.time : 'Pre-match'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <i className={`${getSportIcon(event.sport)} text-sm`}></i>
                  </div>
                  <span className="font-medium">{event.homeTeam}</span>
                </div>
                {event.homeScore !== undefined && (
                  <span className="text-xl font-bold">{event.homeScore}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <i className={`${getSportIcon(event.sport)} text-sm`}></i>
                  </div>
                  <span className="font-medium">{event.awayTeam}</span>
                </div>
                {event.awayScore !== undefined && (
                  <span className="text-xl font-bold">{event.awayScore}</span>
                )}
              </div>
            </div>
            
            <div className={`grid gap-2 mt-4 ${event.odds.draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <Button
                variant="secondary"
                className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, event.homeTeam, event.odds.home)}
              >
                <div className="text-xs text-gray-400">1</div>
                <div className="font-bold">{event.odds.home}</div>
              </Button>
              {event.odds.draw && (
                <Button
                  variant="secondary"
                  className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                  onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, 'Draw', event.odds.draw)}
                >
                  <div className="text-xs text-gray-400">X</div>
                  <div className="font-bold">{event.odds.draw}</div>
                </Button>
              )}
              <Button
                variant="secondary"
                className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, event.awayTeam, event.odds.away)}
              >
                <div className="text-xs text-gray-400">2</div>
                <div className="font-bold">{event.odds.away}</div>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
