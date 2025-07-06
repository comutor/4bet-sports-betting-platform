import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
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
        <FootballBettingMarkets 
          selectedMarket={selectedMarket}
          homeTeam={matchDetails.homeTeam}
          awayTeam={matchDetails.awayTeam}
          sport={matchDetails.sport}
        />
      </div>
    </div>
  );
}

// Football Betting Markets Component
interface BettingMarket {
  id: string;
  name: string;
  category: string;
  odds?: { [key: string]: string };
  isTeamSpecific?: boolean;
}

interface FootballBettingMarketsProps {
  selectedMarket: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
}

function FootballBettingMarkets({ selectedMarket, homeTeam, awayTeam, sport }: FootballBettingMarketsProps) {
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());

  // Comprehensive football betting markets based on the screenshots
  const footballMarkets: BettingMarket[] = [
    // Main Markets
    { id: '1x2-full-time', name: '1X2 | Full Time', category: 'all', odds: { [homeTeam]: '2.15', 'Draw': '3.40', [awayTeam]: '3.20' } },
    { id: 'double-chance-full-time', name: 'Double Chance | Full Time', category: 'all', odds: { [`${homeTeam} or Draw`]: '1.55', [`${homeTeam} or ${awayTeam}`]: '1.35', [`Draw or ${awayTeam}`]: '1.65' } },
    { id: 'both-teams-score-full-time', name: 'Both Teams To Score | Full Time', category: 'all', odds: { 'Yes': '1.75', 'No': '2.05' } },
    
    // Over/Under Markets
    { id: 'over-under-full-time', name: 'Over/Under | Full Time', category: 'goals', odds: { 'Over 2.5': '1.85', 'Under 2.5': '1.95' } },
    { id: 'over-under-home-full-time', name: `Over/Under | ${homeTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Over 1.5': '2.10', 'Under 1.5': '1.75' } },
    { id: 'over-under-away-full-time', name: `Over/Under | ${awayTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Over 1.5': '2.25', 'Under 1.5': '1.65' } },
    
    // Half Time Markets
    { id: 'half-time-full-time', name: 'Half Time/Full Time', category: 'halves', odds: { [`${homeTeam}/${homeTeam}`]: '3.25', [`${homeTeam}/Draw`]: '8.50', [`${homeTeam}/${awayTeam}`]: '12.00', 'Draw/Draw': '4.75', [`Draw/${homeTeam}`]: '4.20', [`Draw/${awayTeam}`]: '5.80' } },
    { id: '3-way-handicap-full-time', name: '3-Way Handicap | Full Time', category: 'all', odds: { [`${homeTeam} (-1)`]: '3.40', 'Draw (-1)': '3.60', [`${awayTeam} (+1)`]: '2.15' } },
    { id: '1x2-first-half', name: '1X2 | First Half', category: 'halves', odds: { [homeTeam]: '2.85', 'Draw': '2.20', [awayTeam]: '4.20' } },
    { id: '1x2-second-half', name: '1X2 | Second Half', category: 'halves', odds: { [homeTeam]: '2.75', 'Draw': '2.30', [awayTeam]: '3.80' } },
    { id: 'over-under-first-half', name: 'Over/Under | First Half', category: 'halves', odds: { 'Over 1.5': '2.45', 'Under 1.5': '1.55' } },
    { id: '3-way-handicap-first-half', name: '3-Way Handicap | First Half', category: 'halves', odds: { [`${homeTeam} (-0.5)`]: '4.20', 'Draw (-0.5)': '3.40', [`${awayTeam} (+0.5)`]: '1.85' } },
    { id: '3-way-handicap-second-half', name: '3-Way Handicap | Second Half', category: 'halves', odds: { [`${homeTeam} (-0.5)`]: '3.80', 'Draw (-0.5)': '3.20', [`${awayTeam} (+0.5)`]: '2.10' } },
    
    // Handicap Markets
    { id: '2-way-handicap-full-time', name: '2-Way Handicap | Full Time', category: 'all', odds: { [`${homeTeam} (-1)`]: '1.95', [`${awayTeam} (+1)`]: '1.85' } },
    { id: '2-way-handicap-first-half', name: '2-Way Handicap | First Half', category: 'halves', odds: { [`${homeTeam} (-0.5)`]: '2.15', [`${awayTeam} (+0.5)`]: '1.75' } },
    { id: '2-way-handicap-second-half', name: '2-Way Handicap | Second Half', category: 'halves', odds: { [`${homeTeam} (-0.5)`]: '2.05', [`${awayTeam} (+0.5)`]: '1.80' } },
    { id: 'half-with-more-goals', name: 'Half With More Goals', category: 'halves', odds: { '1st Half': '2.85', '2nd Half': '2.20', 'Equal': '3.40' } },
    
    // Combination Markets
    { id: '1x2-and-totals-full-time', name: '1X2 and Totals | Full Time', category: 'combos', odds: { [`${homeTeam} & Over 2.5`]: '3.60', [`${homeTeam} & Under 2.5`]: '4.20', [`Draw & Over 2.5`]: '5.80', [`${awayTeam} & Over 2.5`]: '5.20' } },
    { id: '1x2-and-totals-first-half', name: '1X2 and Totals | First Half', category: 'combos', odds: { [`${homeTeam} & Over 1.5`]: '4.75', [`${homeTeam} & Under 1.5`]: '3.20', [`Draw & Under 1.5`]: '2.85' } },
    { id: '1x2-and-totals-second-half', name: '1X2 and Totals | Second Half', category: 'combos', odds: { [`${homeTeam} & Over 1.5`]: '4.40', [`${awayTeam} & Over 1.5`]: '6.20', [`Draw & Under 1.5`]: '3.10' } },
    
    // Draw No Bet Markets
    { id: 'draw-no-bet-full-time', name: 'Draw No Bet | Full Time', category: 'all', odds: { [homeTeam]: '1.65', [awayTeam]: '2.25' } },
    { id: 'draw-no-bet-first-half', name: 'Draw No Bet | First Half', category: 'halves', odds: { [homeTeam]: '1.85', [awayTeam]: '2.95' } },
    { id: 'draw-no-bet-second-half', name: 'Draw No Bet | Second Half', category: 'halves', odds: { [homeTeam]: '1.90', [awayTeam]: '2.85' } },
    
    // Correct Score Markets
    { id: 'correct-score-full-time', name: 'Correct Score | Full Time', category: 'goals', odds: { '1-0': '8.50', '2-0': '12.00', '2-1': '9.75', '1-1': '6.25', '0-0': '9.50', '0-1': '15.00', '0-2': '25.00', '1-2': '18.00' } },
    { id: 'correct-score-first-half', name: 'Correct Score | First Half', category: 'halves', odds: { '1-0': '4.20', '0-0': '2.15', '0-1': '6.75', '1-1': '5.80', '2-0': '8.50', '0-2': '18.00' } },
    { id: 'correct-score-second-half', name: 'Correct Score | Second Half', category: 'halves', odds: { '1-0': '4.60', '0-0': '2.85', '0-1': '6.25', '1-1': '6.50', '2-1': '12.00' } },
    
    // Both Teams Score & Double Chance Combos
    { id: 'double-chance-both-teams-score-full-time', name: 'Double Chance and Both Teams To Score | Full Time', category: 'combos', odds: { [`${homeTeam} or Draw & Yes`]: '2.65', [`${homeTeam} or ${awayTeam} & Yes`]: '2.20', [`Draw or ${awayTeam} & Yes`]: '3.10' } },
    { id: 'double-chance-both-teams-score-first-half', name: 'Double Chance and Both Teams To Score | First Half', category: 'combos', odds: { [`${homeTeam} or Draw & Yes`]: '5.20', [`${awayTeam} or Draw & Yes`]: '7.50' } },
    { id: 'double-chance-both-teams-score-second-half', name: 'Double Chance and Both Teams To Score | Second Half', category: 'combos', odds: { [`${homeTeam} or Draw & Yes`]: '4.75', [`${awayTeam} or Draw & Yes`]: '6.80' } },
    
    // Multiscores
    { id: 'multiscores-full-time', name: 'Multiscores | Full Time', category: 'goals', odds: { [`${homeTeam} 1-3`]: '3.40', [`${homeTeam} 2-4`]: '2.85', [`${awayTeam} 1-3`]: '4.20', [`${awayTeam} 2-4`]: '3.60', 'Draw 0-0': '9.50', 'Draw 1-1': '6.25' } },
    { id: 'multiscores-first-half', name: 'Multiscores | First Half', category: 'halves', odds: { [`${homeTeam} 1-2`]: '3.80', [`${awayTeam} 1-2`]: '5.40', 'Draw 0-0': '2.15', 'Draw 1-1': '5.80' } },
    { id: 'multiscores-second-half', name: 'Multiscores | Second Half', category: 'halves', odds: { [`${homeTeam} 1-2`]: '4.20', [`${awayTeam} 1-2`]: '5.80', 'Draw 0-0': '2.85' } },
    { id: 'multiscores-home-full-time', name: `Multiscores | ${homeTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { '1 Goal': '3.20', '2 Goals': '3.60', '3+ Goals': '4.75' } },
    { id: 'multiscores-away-full-time', name: `Multiscores | ${awayTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { '1 Goal': '3.80', '2 Goals': '4.20', '3+ Goals': '5.40' } },
    
    // Clean Sheet Markets
    { id: 'clean-sheet-home-full-time', name: `Clean Sheet | ${homeTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Yes': '2.45', 'No': '1.55' } },
    { id: 'clean-sheet-away-full-time', name: `Clean Sheet | ${awayTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Yes': '2.85', 'No': '1.45' } },
    { id: 'clean-sheet-home-first-half', name: `Clean Sheet | ${homeTeam} | First Half`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '1.85', 'No': '1.95' } },
    { id: 'clean-sheet-away-first-half', name: `Clean Sheet | ${awayTeam} | First Half`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '2.10', 'No': '1.75' } },
    { id: 'clean-sheet-home-second-half', name: `Clean Sheet | ${homeTeam} | Second Half`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '2.20', 'No': '1.65' } },
    { id: 'clean-sheet-away-second-half', name: `Clean Sheet | ${awayTeam} | Second Half`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '2.35', 'No': '1.60' } },
    
    // 1X2 and Both Teams Score Combos
    { id: '1x2-both-teams-score-full-time', name: '1X2 and Both Teams To Score | Full Time', category: 'combos', odds: { [`${homeTeam} & Yes`]: '4.20', [`${homeTeam} & No`]: '3.60', [`Draw & Yes`]: '6.75', [`${awayTeam} & Yes`]: '6.25', [`${awayTeam} & No`]: '5.40' } },
    { id: '1x2-both-teams-score-first-half', name: '1X2 and Both Teams To Score | First half', category: 'combos', odds: { [`${homeTeam} & Yes`]: '8.50', [`Draw & No`]: '2.85', [`${awayTeam} & Yes`]: '15.00' } },
    { id: '1x2-both-teams-score-second-half', name: '1X2 and Both Teams To Score | Second half', category: 'combos', odds: { [`${homeTeam} & Yes`]: '7.25', [`Draw & No`]: '3.40', [`${awayTeam} & Yes`]: '12.00' } },
    
    // Corner Markets
    { id: 'corner-count-1x2-full-time', name: 'Corner Count 1X2 | Full Time', category: 'corners', odds: { [homeTeam]: '2.05', 'Draw': '3.80', [awayTeam]: '3.20' } },
    { id: 'corner-count-1x2-first-half', name: 'Corner Count 1X2 | First Half', category: 'corners', odds: { [homeTeam]: '2.35', 'Draw': '3.40', [awayTeam]: '3.60' } },
    { id: 'total-corners-over-under-full-time', name: 'Total Corners Over/Under | Full Time', category: 'corners', odds: { 'Over 9.5': '1.85', 'Under 9.5': '1.95', 'Over 11.5': '2.45', 'Under 11.5': '1.55' } },
    { id: 'total-corners-over-under-first-half', name: 'Total Corners Over/Under | First Half', category: 'corners', odds: { 'Over 4.5': '1.75', 'Under 4.5': '2.05', 'Over 5.5': '2.20', 'Under 5.5': '1.65' } },
    { id: 'corner-count-odd-even-full-time', name: 'Corner Count Odd/Even | Full Time', category: 'corners', odds: { 'Odd': '1.90', 'Even': '1.90' } },
    { id: 'corner-count-odd-even-first-half', name: 'Corner Count Odd/Even | First Half', category: 'corners', odds: { 'Odd': '1.85', 'Even': '1.95' } },
    { id: 'last-corner-full-time', name: 'Last Corner | Full Time', category: 'corners', odds: { [homeTeam]: '1.95', [awayTeam]: '1.85' } },
    { id: 'last-corner-first-half', name: 'Last Corner | First Half', category: 'corners', odds: { [homeTeam]: '2.10', [awayTeam]: '1.75' } },
    
    // Win to Nil Markets
    { id: 'win-to-nil-home-full-time', name: `Win To Nil | ${homeTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Yes': '3.80', 'No': '1.25' } },
    { id: 'win-to-nil-away-full-time', name: `Win To Nil | ${awayTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Yes': '4.60', 'No': '1.20' } },
    
    // Goals Exact Markets
    { id: 'total-goals-exact-full-time-home', name: `Total Goals Exact | Full Time | ${homeTeam}`, category: 'goals', isTeamSpecific: true, odds: { '0': '4.20', '1': '3.60', '2': '3.80', '3+': '4.75' } },
    { id: 'total-goals-exact-full-time-away', name: `Total Goals Exact | Full Time | ${awayTeam}`, category: 'goals', isTeamSpecific: true, odds: { '0': '3.80', '1': '3.40', '2': '4.20', '3+': '5.60' } },
    { id: 'total-goals-exact-first-half', name: 'Total Goals Exact | First Half', category: 'halves', odds: { '0': '2.85', '1': '2.45', '2': '3.60', '3+': '8.50' } },
    { id: 'total-goals-exact-second-half', name: 'Total Goals Exact | Second Half', category: 'halves', odds: { '0': '3.20', '1': '2.65', '2': '3.40', '3+': '6.75' } },
    
    // Odd/Even Markets
    { id: 'odd-even-full-time', name: 'Odd/Even | Full Time', category: 'goals', odds: { 'Odd': '1.95', 'Even': '1.85' } },
    { id: 'odd-even-first-half', name: 'Odd/Even | First Half', category: 'halves', odds: { 'Odd': '2.05', 'Even': '1.75' } },
    { id: 'odd-even-second-half', name: 'Odd/Even | Second Half', category: 'halves', odds: { 'Odd': '1.90', 'Even': '1.90' } },
    { id: 'odd-even-home-full-time', name: `Odd/Even | ${homeTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Odd': '1.85', 'Even': '1.95' } },
    { id: 'odd-even-away-full-time', name: `Odd/Even | ${awayTeam} | Full Time`, category: 'goals', isTeamSpecific: true, odds: { 'Odd': '1.90', 'Even': '1.90' } },
    
    // Team To Score Markets
    { id: 'team-to-score-last-3-way', name: 'Team To Score | Last - 3 way', category: 'goals', odds: { [homeTeam]: '2.45', [awayTeam]: '2.85', 'Neither': '3.60' } },
    { id: 'team-to-score-4-way-full-time', name: 'Team To Score (4-Way) | Full Time', category: 'goals', odds: { [`${homeTeam} Only`]: '4.20', [`${awayTeam} Only`]: '5.80', 'Both Teams': '1.75', 'Neither Team': '9.50' } },
    
    // Double Chance Halves
    { id: 'double-chance-first-half', name: 'Double Chance | First Half', category: 'halves', odds: { [`${homeTeam} or Draw`]: '1.35', [`${homeTeam} or ${awayTeam}`]: '1.55', [`Draw or ${awayTeam}`]: '1.85' } },
    { id: 'double-chance-second-half', name: 'Double Chance | Second Half', category: 'halves', odds: { [`${homeTeam} or Draw`]: '1.45', [`${homeTeam} or ${awayTeam}`]: '1.50', [`Draw or ${awayTeam}`]: '1.75' } },
    
    // Both Teams Score Halves
    { id: 'both-teams-score-first-half', name: 'Both Teams To Score | First Half', category: 'halves', odds: { 'Yes': '3.80', 'No': '1.25' } },
    { id: 'both-teams-score-second-half', name: 'Both Teams To Score | Second Half', category: 'halves', odds: { 'Yes': '3.20', 'No': '1.35' } },
    
    // Win Either Half Markets
    { id: 'win-either-half-home', name: `Win Either Half | ${homeTeam}`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '1.65', 'No': '2.25' } },
    { id: 'win-either-half-away', name: `Win Either Half | ${awayTeam}`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '2.15', 'No': '1.70' } },
    
    // Score In Both Halves
    { id: 'score-both-halves-home', name: `Score In Both Halves | ${homeTeam}`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '2.85', 'No': '1.45' } },
    { id: 'score-both-halves-away', name: `Score In Both Halves | ${awayTeam}`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '3.60', 'No': '1.30' } },
    
    // Win Both Halves
    { id: 'win-both-halves-away', name: `Win Both Halves | ${awayTeam}`, category: 'halves', isTeamSpecific: true, odds: { 'Yes': '8.50', 'No': '1.05' } },
    
    // More Goals Markets
    { id: 'more-goals-home', name: `More Goals | ${homeTeam}`, category: 'goals', isTeamSpecific: true, odds: { 'Yes': '2.20', 'No': '1.65' } },
    { id: 'more-goals-away', name: `More Goals | ${awayTeam}`, category: 'goals', isTeamSpecific: true, odds: { 'Yes': '2.85', 'No': '1.45' } }
  ];

  // Filter markets based on selected category
  const getFilteredMarkets = () => {
    if (selectedMarket === 'all') return footballMarkets;
    if (selectedMarket === 'popular') {
      return footballMarkets.filter(market => 
        ['1x2-full-time', 'both-teams-score-full-time', 'over-under-full-time', 'double-chance-full-time', 'correct-score-full-time', 'half-time-full-time'].includes(market.id)
      );
    }
    return footballMarkets.filter(market => market.category === selectedMarket);
  };

  const toggleMarket = (marketId: string) => {
    const newExpanded = new Set(expandedMarkets);
    if (newExpanded.has(marketId)) {
      newExpanded.delete(marketId);
    } else {
      newExpanded.add(marketId);
    }
    setExpandedMarkets(newExpanded);
  };

  const filteredMarkets = getFilteredMarkets();

  // Don't show football markets for non-football sports
  if (sport.toLowerCase() !== 'football') {
    return (
      <div className="text-white text-center py-8">
        <div className="text-lg">
          {selectedMarket === 'popular' ? 'Popular Markets' : 
           selectedMarket === 'player-props' ? 'Player Props' :
           selectedMarket === 'team-props' ? 'Team Props' :
           `${selectedMarket.charAt(0).toUpperCase() + selectedMarket.slice(1).replace('-', ' ')} Markets`}
        </div>
        <div className="text-gray-400 mt-2">
          Coming soon for {sport}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredMarkets.map((market) => {
        const isExpanded = expandedMarkets.has(market.id);
        const odds = market.odds || {};
        const hasOdds = Object.keys(odds).length > 0;
        
        return (
          <div key={market.id} className="bg-slate-800 rounded-lg overflow-hidden">
            {/* Market Header - Clickable to expand/collapse */}
            <button
              onClick={() => toggleMarket(market.id)}
              className="w-full p-4 flex items-center justify-between text-white hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 mr-3 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-3 text-gray-400" />
                )}
                <span className="font-medium text-left">{market.name}</span>
                <div className="ml-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">
                  i
                </div>
              </div>
              
              <div className="flex items-center space-x-2">

              </div>
            </button>

            {/* Market Odds - Shown when expanded */}
            {isExpanded && hasOdds && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(odds).map(([outcome, odd]) => (
                    <button
                      key={outcome}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm transition-colors border border-slate-600 hover:border-slate-500"
                    >
                      <div className="text-xs text-gray-300 mb-1">{outcome}</div>
                      <div className="font-medium">{odd}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Show placeholder when no odds available */}
            {isExpanded && !hasOdds && (
              <div className="px-4 pb-4 text-center text-gray-400">
                <div className="text-sm">Odds loading...</div>
              </div>
            )}
          </div>
        );
      })}
      
      {filteredMarkets.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <div className="text-lg">No markets available</div>
          <div className="text-sm mt-2">Try selecting a different category</div>
        </div>
      )}
    </div>
  );
}

export default MoreMarkets;