import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SportEvent {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  eventName: string;
  time: string;
  homeOdds: string;
  awayOdds: string;
  drawOdds?: string;
}

interface SportsOverviewProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function SportsOverview({ onBetClick }: SportsOverviewProps) {
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'live'>('upcoming');

  // Fetch upcoming events
  const { data: upcomingEvents = [], isLoading: loadingUpcoming } = useQuery<SportEvent[]>({
    queryKey: ['/api/sports-events'],
    enabled: activeFilter === 'upcoming'
  });

  // Fetch live events
  const { data: liveEvents = [], isLoading: loadingLive } = useQuery<SportEvent[]>({
    queryKey: ['/api/live-events'],
    enabled: activeFilter === 'live'
  });

  const currentEvents = activeFilter === 'upcoming' ? upcomingEvents : liveEvents;
  const isLoading = activeFilter === 'upcoming' ? loadingUpcoming : loadingLive;

  const quickAccessItems = [
    { id: 'football', name: 'Football', icon: '⚽', color: 'bg-green-600' },
    { id: 'basketball', name: 'Basketball', icon: '🏀', color: 'bg-orange-600' },
    { id: 'tennis', name: 'Tennis', icon: '🎾', color: 'bg-yellow-600' },
    { id: 'hockey', name: 'Hockey', icon: '🏒', color: 'bg-blue-600' },
    { id: 'leagues', name: 'Leagues', icon: '🏆', color: 'bg-purple-600' },
    { id: 'calendar', name: 'Calendar', icon: '📅', color: 'bg-red-600' }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeFilter === 'upcoming'
                ? 'border-blue-500 text-blue-400 bg-slate-700/50'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('live')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeFilter === 'live'
                ? 'border-red-500 text-red-400 bg-slate-700/50'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Live Now
          </button>
        </div>
      </div>



      {/* Events List */}
      <div className="bg-slate-800 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          {activeFilter === 'upcoming' ? 'Upcoming Matches' : 'Live Matches'}
        </h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-gray-400">Loading matches...</span>
          </div>
        ) : currentEvents && currentEvents.length > 0 ? (
          <div className="space-y-3">
            {currentEvents.slice(0, 5).map((event: any, index: number) => (
              <div key={index} className="bg-slate-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {event.sport === 'football' ? '⚽' : 
                       event.sport === 'basketball' ? '🏀' :
                       event.sport === 'tennis' ? '🎾' :
                       event.sport === 'hockey' ? '🏒' : '🏆'}
                    </span>
                    <div>
                      <div className="font-medium text-white text-sm">{event.league}</div>
                      <div className="text-xs text-gray-400">{event.time}</div>
                    </div>
                  </div>
                  {activeFilter === 'live' && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-400">LIVE</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-gray-300 mb-1">{event.homeTeam}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs border-gray-600 hover:border-blue-500"
                      onClick={() => onBetClick(event.eventName, event.homeTeam, event.homeOdds)}
                    >
                      {event.homeOdds || 'N/A'}
                    </Button>
                  </div>
                  
                  {event.drawOdds && (
                    <div className="text-center">
                      <div className="text-gray-300 mb-1">Draw</div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-gray-600 hover:border-blue-500"
                        onClick={() => onBetClick(event.eventName, 'Draw', event.drawOdds)}
                      >
                        {event.drawOdds}
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-gray-300 mb-1">{event.awayTeam}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs border-gray-600 hover:border-blue-500"
                      onClick={() => onBetClick(event.eventName, event.awayTeam, event.awayOdds)}
                    >
                      {event.awayOdds || 'N/A'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No {activeFilter === 'upcoming' ? 'upcoming' : 'live'} matches available
            </p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {currentEvents && currentEvents.length > 5 && (
        <div className="text-center">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            View All {activeFilter === 'upcoming' ? 'Upcoming' : 'Live'} Matches
          </Button>
        </div>
      )}
    </div>
  );
}