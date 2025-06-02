import { Button } from "@/components/ui/button";

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
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function LiveSection({ onBetClick }: LiveSectionProps) {
  const liveEvents: LiveEvent[] = [
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-3 h-3 bg-live rounded-full animate-pulse mr-3"></span>
          Live Betting
        </h2>
        <div className="text-sm text-gray-400">
          <i className="fas fa-broadcast-tower mr-1"></i>
          {liveEvents.length} Live Events
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {liveEvents.map((event) => (
          <div key={event.id} className="bg-slate-custom rounded-xl p-6 border-2 border-live">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-live rounded-full animate-pulse"></span>
                <span className="text-live font-medium text-sm">LIVE</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{event.league}</div>
                <div className="font-medium">{event.time}</div>
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
                <div className="text-3xl font-bold text-success">{event.homeScore}</div>
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
                <div className="text-3xl font-bold">{event.awayScore}</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-gray-400 mb-2">{event.liveMarket.name}</div>
              <div className={`grid gap-2 ${event.liveMarket.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {event.liveMarket.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="bg-slate-light-custom hover:bg-primary text-center py-2 transition-colors"
                    onClick={() => onBetClick(`${event.homeTeam} vs ${event.awayTeam}`, option.label, option.odds)}
                  >
                    <div className="text-xs text-gray-400">{option.label}</div>
                    <div className="font-bold">{option.odds}</div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
