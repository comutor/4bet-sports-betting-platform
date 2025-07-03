import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoreMarketsProps {
  eventId?: string;
}

interface MatchDetails {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  commenceTime: string;
  date: string;
  time: string;
}

const marketTabs = [
  { id: 'all', label: 'ALL', count: null },
  { id: 'popular', label: 'POPULAR', count: 12 },
  { id: 'goals', label: 'GOALS', count: 33 },
  { id: 'halves', label: 'HALVES', count: 38 },
  { id: 'combos', label: 'COMBOS', count: 9 },
  { id: 'specials', label: 'SPECIALS', count: null },
  { id: 'corners', label: 'CORNERS', count: null },
  { id: 'booking', label: 'BOOKING', count: null },
];

export function MoreMarkets() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const eventId = params.eventId;

  useEffect(() => {
    if (eventId) {
      // Fetch match details from API or use passed data
      // For now, using sample data matching the image
      const sampleMatch: MatchDetails = {
        id: eventId,
        homeTeam: 'Fluminense FC RJ',
        awayTeam: 'Al Hilal SFC',
        league: 'FIFA Club World Cup',
        sport: 'Football',
        commenceTime: '2025-07-04T22:00:00Z',
        date: 'Fri 04/07',
        time: '10:00 pm'
      };
      
      setMatchDetails(sampleMatch);
      setLoading(false);
    }
  }, [eventId]);

  const handleBack = () => {
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading match details...</div>
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Match not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-slate-700 p-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="text-white text-center">
            <div className="text-lg font-medium">
              {matchDetails.time} {matchDetails.date}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700 p-2"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Statistics
          </Button>
        </div>

        {/* Team Names */}
        <div className="text-white mb-1">
          <div className="text-2xl font-bold mb-1">{matchDetails.homeTeam}</div>
          <div className="text-2xl font-bold mb-3">{matchDetails.awayTeam}</div>
        </div>

        {/* League */}
        <div className="text-gray-300 text-sm">
          <span>{matchDetails.sport} / </span>
          <span className="underline">International</span>
          <span> / </span>
          <span className="underline">{matchDetails.league}</span>
        </div>
      </div>

      {/* Market Navigation */}
      <div className="bg-slate-700 px-2 py-1">
        <div className="flex overflow-x-auto scrollbar-hide">
          {marketTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMarket(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                selectedMarket === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-1 text-xs text-gray-400">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Market Content */}
      <div className="p-4">
        {selectedMarket === 'all' && (
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <span className="mr-2">▼</span>
                <span className="font-medium">1X2 | Full Time 2UP</span>
                <div className="ml-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">
                  ?
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm">
                  2
                </div>
                <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                  ⚡ Boosted
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMarket === 'popular' && (
          <div className="text-white text-center py-8">
            <div className="text-lg">Popular Markets</div>
            <div className="text-gray-400 mt-2">12 markets available</div>
          </div>
        )}

        {selectedMarket === 'goals' && (
          <div className="text-white text-center py-8">
            <div className="text-lg">Goals Markets</div>
            <div className="text-gray-400 mt-2">33 markets available</div>
          </div>
        )}

        {selectedMarket === 'halves' && (
          <div className="text-white text-center py-8">
            <div className="text-lg">Halves Markets</div>
            <div className="text-gray-400 mt-2">38 markets available</div>
          </div>
        )}

        {selectedMarket === 'combos' && (
          <div className="text-white text-center py-8">
            <div className="text-lg">Combo Markets</div>
            <div className="text-gray-400 mt-2">9 markets available</div>
          </div>
        )}

        {['specials', 'corners', 'booking'].includes(selectedMarket) && (
          <div className="text-white text-center py-8">
            <div className="text-lg capitalize">{selectedMarket} Markets</div>
            <div className="text-gray-400 mt-2">Markets available</div>
          </div>
        )}
      </div>
    </div>
  );
}