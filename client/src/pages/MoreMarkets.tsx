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

const getMarketTabsBySport = (sport: string) => {
  const baseTabs = [
    { id: 'all', label: 'ALL', count: null },
    { id: 'popular', label: 'POPULAR', count: 12 },
  ];

  switch (sport.toLowerCase()) {
    case 'football':
      return [
        ...baseTabs,
        { id: 'goals', label: 'GOALS', count: 33 },
        { id: 'halves', label: 'HALVES', count: 38 },
        { id: 'corners', label: 'CORNERS', count: 22 },
        { id: 'booking', label: 'BOOKING', count: 15 },
        { id: 'combos', label: 'COMBOS', count: 9 },
        { id: 'specials', label: 'SPECIALS', count: null },
      ];
    
    case 'basketball':
      return [
        ...baseTabs,
        { id: 'points', label: 'POINTS', count: 28 },
        { id: 'quarters', label: 'QUARTERS', count: 32 },
        { id: 'player-props', label: 'PLAYER PROPS', count: 45 },
        { id: 'team-props', label: 'TEAM PROPS', count: 24 },
        { id: 'combos', label: 'COMBOS', count: 12 },
        { id: 'specials', label: 'SPECIALS', count: null },
      ];
    
    case 'tennis':
      return [
        ...baseTabs,
        { id: 'sets', label: 'SETS', count: 18 },
        { id: 'games', label: 'GAMES', count: 25 },
        { id: 'aces', label: 'ACES', count: 12 },
        { id: 'player-props', label: 'PLAYER PROPS', count: 30 },
        { id: 'combos', label: 'COMBOS', count: 8 },
        { id: 'specials', label: 'SPECIALS', count: null },
      ];
    
    case 'ice hockey':
      return [
        ...baseTabs,
        { id: 'goals', label: 'GOALS', count: 20 },
        { id: 'periods', label: 'PERIODS', count: 25 },
        { id: 'shots', label: 'SHOTS', count: 15 },
        { id: 'penalties', label: 'PENALTIES', count: 10 },
        { id: 'combos', label: 'COMBOS', count: 7 },
        { id: 'specials', label: 'SPECIALS', count: null },
      ];
    
    case 'baseball':
      return [
        ...baseTabs,
        { id: 'runs', label: 'RUNS', count: 22 },
        { id: 'innings', label: 'INNINGS', count: 35 },
        { id: 'hits', label: 'HITS', count: 18 },
        { id: 'player-props', label: 'PLAYER PROPS', count: 40 },
        { id: 'combos', label: 'COMBOS', count: 10 },
        { id: 'specials', label: 'SPECIALS', count: null },
      ];
    
    default:
      // Fallback for unknown sports
      return [
        ...baseTabs,
        { id: 'combos', label: 'COMBOS', count: 9 },
        { id: 'specials', label: 'SPECIALS', count: null },
      ];
  }
};

export function MoreMarkets() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const eventId = params.eventId;

  useEffect(() => {
    if (eventId) {
      // Get URL search parameters
      const urlParams = new URLSearchParams(window.location.search);
      const homeTeam = urlParams.get('homeTeam') ? decodeURIComponent(urlParams.get('homeTeam')!) : '';
      const awayTeam = urlParams.get('awayTeam') ? decodeURIComponent(urlParams.get('awayTeam')!) : '';
      const league = urlParams.get('league') ? decodeURIComponent(urlParams.get('league')!) : '';
      const commenceTime = urlParams.get('commenceTime') || '';
      const sport = urlParams.get('sport') || 'Football';

      if (homeTeam && awayTeam) {
        // Format date and time from commenceTime
        const matchDate = new Date(commenceTime);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const isToday = matchDate.toDateString() === today.toDateString();
        const isTomorrow = matchDate.toDateString() === tomorrow.toDateString();
        
        let dateStr = '';
        if (isToday) {
          dateStr = 'Today';
        } else if (isTomorrow) {
          dateStr = 'Tomorrow';
        } else {
          dateStr = matchDate.toLocaleDateString('en-GB', { 
            weekday: 'short', 
            day: '2-digit',
            month: '2-digit'
          });
        }
        
        const timeStr = matchDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        const matchData: MatchDetails = {
          id: eventId,
          homeTeam,
          awayTeam,
          league,
          sport,
          commenceTime,
          date: dateStr,
          time: timeStr
        };
        
        setMatchDetails(matchData);
      } else {
        // Fallback if no URL parameters (shouldn't happen normally)
        const sampleMatch: MatchDetails = {
          id: eventId,
          homeTeam: 'Match',
          awayTeam: 'Details',
          league: 'Not Available',
          sport: 'Football',
          commenceTime: new Date().toISOString(),
          date: 'Today',
          time: '00:00'
        };
        setMatchDetails(sampleMatch);
      }
      
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

  // Get sport-specific market tabs
  const marketTabs = getMarketTabsBySport(matchDetails.sport);

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

        {selectedMarket !== 'all' && (
          <div className="text-white text-center py-8">
            <div className="text-lg">
              {selectedMarket === 'popular' ? 'Popular Markets' : 
               selectedMarket === 'player-props' ? 'Player Props' :
               selectedMarket === 'team-props' ? 'Team Props' :
               `${selectedMarket.charAt(0).toUpperCase() + selectedMarket.slice(1).replace('-', ' ')} Markets`}
            </div>
            <div className="text-gray-400 mt-2">
              {marketTabs.find(tab => tab.id === selectedMarket)?.count || 'Multiple'} markets available
            </div>
            
            {/* Sport-specific market examples */}
            {matchDetails.sport.toLowerCase() === 'basketball' && selectedMarket === 'points' && (
              <div className="mt-4 space-y-2 text-left">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-gray-300">Total Points</div>
                  <div className="flex gap-2 mt-1">
                    <button className="bg-slate-700 px-3 py-1 rounded text-sm">Over 215.5 (1.91)</button>
                    <button className="bg-slate-700 px-3 py-1 rounded text-sm">Under 215.5 (1.91)</button>
                  </div>
                </div>
              </div>
            )}
            
            {matchDetails.sport.toLowerCase() === 'tennis' && selectedMarket === 'sets' && (
              <div className="mt-4 space-y-2 text-left">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-gray-300">Set Betting</div>
                  <div className="flex gap-2 mt-1">
                    <button className="bg-slate-700 px-3 py-1 rounded text-sm">2-0 (3.20)</button>
                    <button className="bg-slate-700 px-3 py-1 rounded text-sm">2-1 (2.85)</button>
                  </div>
                </div>
              </div>
            )}
            
            {matchDetails.sport.toLowerCase() === 'ice hockey' && selectedMarket === 'periods' && (
              <div className="mt-4 space-y-2 text-left">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-gray-300">Period Betting</div>
                  <div className="flex gap-2 mt-1">
                    <button className="bg-slate-700 px-3 py-1 rounded text-sm">1st Period Win (2.10)</button>
                    <button className="bg-slate-700 px-3 py-1 rounded text-sm">2nd Period Draw (3.40)</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}