import { useState } from 'react';
import { Trophy, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { MatchCard } from './MatchCard';

interface TopLeaguesSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  onLeagueClick: (leagueId: string, leagueName: string) => void;
  sport?: string;
}



export function TopLeaguesSection({ onBetClick, onLeagueClick, sport = 'football' }: TopLeaguesSectionProps) {
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set());

  // Define top-tier leagues for each sport
  const topLeagues = {
    football: [
      // European Top Leagues
      { id: 'premier-league', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'soccer_epl' },
      { id: 'championship', name: 'Championship', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'soccer_england_championship' },
      { id: 'la-liga', name: 'La Liga', country: 'Spain', flag: '🇪🇸', apiKey: 'soccer_spain_la_liga' },
      { id: 'segunda-division', name: 'Segunda División', country: 'Spain', flag: '🇪🇸', apiKey: 'soccer_spain_segunda_division' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', apiKey: 'soccer_germany_bundesliga' },
      { id: 'serie-a', name: 'Serie A', country: 'Italy', flag: '🇮🇹', apiKey: 'soccer_italy_serie_a' },
      { id: 'ligue-1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', apiKey: 'soccer_france_ligue_one' },
      { id: 'eredivisie', name: 'Eredivisie', country: 'Netherlands', flag: '🇳🇱', apiKey: 'soccer_netherlands_eredivisie' },
      { id: 'primeira-liga', name: 'Primeira Liga', country: 'Portugal', flag: '🇵🇹', apiKey: 'soccer_portugal_primeira_liga' },
      { id: 'scottish-premiership', name: 'Scottish Premiership', country: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', apiKey: 'soccer_scotland_premiership' },
      { id: 'bundesliga-austria', name: 'Bundesliga', country: 'Austria', flag: '🇦🇹', apiKey: 'soccer_austria_bundesliga' },
      { id: 'pro-league', name: 'Pro League', country: 'Belgium', flag: '🇧🇪', apiKey: 'soccer_belgium_pro_league' },
      { id: 'czech-liga', name: 'Czech Liga', country: 'Czech Republic', flag: '🇨🇿', apiKey: 'soccer_czech_liga' },
      { id: 'superliga', name: 'Superliga', country: 'Denmark', flag: '🇩🇰', apiKey: 'soccer_denmark_superliga' },
      { id: 'veikkausliiga', name: 'Veikkausliiga', country: 'Finland', flag: '🇫🇮', apiKey: 'soccer_finland_veikkausliiga' },
      { id: 'super-league', name: 'Super League', country: 'Greece', flag: '🇬🇷', apiKey: 'soccer_greece_super_league' },
      { id: 'nb1', name: 'NB1', country: 'Hungary', flag: '🇭🇺', apiKey: 'soccer_hungary_nb1' },
      { id: 'premier-division', name: 'Premier Division', country: 'Ireland', flag: '🇮🇪', apiKey: 'soccer_ireland_premier_division' },
      { id: 'allsvenskan', name: 'Allsvenskan', country: 'Sweden', flag: '🇸🇪', apiKey: 'soccer_sweden_allsvenskan' },
      { id: 'super-league-swiss', name: 'Super League', country: 'Switzerland', flag: '🇨🇭', apiKey: 'soccer_switzerland_super_league' },
      { id: 'super-lig', name: 'Süper Lig', country: 'Turkey', flag: '🇹🇷', apiKey: 'soccer_turkey_super_lig' },
      
      // South American Top Leagues
      { id: 'brasileirao', name: 'Brasileirão', country: 'Brazil', flag: '🇧🇷', apiKey: 'soccer_brazil_campeonato' },
      { id: 'primera-division-argentina', name: 'Primera División', country: 'Argentina', flag: '🇦🇷', apiKey: 'soccer_argentina_primera_division' },
      { id: 'primera-division-chile', name: 'Primera División', country: 'Chile', flag: '🇨🇱', apiKey: 'soccer_chile_primera_division' },
      { id: 'primera-division-colombia', name: 'Primera División', country: 'Colombia', flag: '🇨🇴', apiKey: 'soccer_colombia_primera_division' },
      { id: 'primera-division-uruguay', name: 'Primera División', country: 'Uruguay', flag: '🇺🇾', apiKey: 'soccer_uruguay_primera_division' },
      
      // North American Top Leagues
      { id: 'mls', name: 'MLS', country: 'USA', flag: '🇺🇸', apiKey: 'soccer_usa_mls' },
      { id: 'liga-mx', name: 'Liga MX', country: 'Mexico', flag: '🇲🇽', apiKey: 'soccer_mexico_liga_mx' },
      { id: 'cpl', name: 'Canadian Premier League', country: 'Canada', flag: '🇨🇦', apiKey: 'soccer_canada_cpl' },
      
      // Asian Top Leagues
      { id: 'j-league', name: 'J-League', country: 'Japan', flag: '🇯🇵', apiKey: 'soccer_japan_j_league' },
      { id: 'k-league', name: 'K-League', country: 'South Korea', flag: '🇰🇷', apiKey: 'soccer_korea_k_league' },
      { id: 'chinese-super-league', name: 'Chinese Super League', country: 'China', flag: '🇨🇳', apiKey: 'soccer_china_super_league' },
      { id: 'a-league', name: 'A-League', country: 'Australia', flag: '🇦🇺', apiKey: 'soccer_australia_aleague' },
      { id: 'indian-super-league', name: 'Indian Super League', country: 'India', flag: '🇮🇳', apiKey: 'soccer_india_super_league' },
      
      // African Top Leagues
      { id: 'premier-league-south-africa', name: 'Premier League', country: 'South Africa', flag: '🇿🇦', apiKey: 'soccer_south_africa_premier_league' },
      { id: 'premier-league-egypt', name: 'Premier League', country: 'Egypt', flag: '🇪🇬', apiKey: 'soccer_egypt_premier_league' },
      { id: 'premier-league-nigeria', name: 'Premier League', country: 'Nigeria', flag: '🇳🇬', apiKey: 'soccer_nigeria_premier_league' },
      
      // Continental Competitions
      { id: 'champions-league', name: 'UEFA Champions League', country: 'Europe', flag: '🇪🇺', apiKey: 'soccer_uefa_champions_league' },
      { id: 'europa-league', name: 'UEFA Europa League', country: 'Europe', flag: '🇪🇺', apiKey: 'soccer_uefa_europa_league' },
      { id: 'conference-league', name: 'UEFA Conference League', country: 'Europe', flag: '🇪🇺', apiKey: 'soccer_uefa_conference_league' },
      { id: 'copa-libertadores', name: 'Copa Libertadores', country: 'South America', flag: '🇦🇷', apiKey: 'soccer_conmebol_libertadores' },
      { id: 'copa-sudamericana', name: 'Copa Sudamericana', country: 'South America', flag: '🇦🇷', apiKey: 'soccer_conmebol_sudamericana' },
      { id: 'concacaf-champions-league', name: 'CONCACAF Champions League', country: 'North America', flag: '🇺🇸', apiKey: 'soccer_concacaf_champions_league' },
      { id: 'caf-champions-league', name: 'CAF Champions League', country: 'Africa', flag: '🇿🇦', apiKey: 'soccer_caf_champions_league' },
      { id: 'afc-champions-league', name: 'AFC Champions League', country: 'Asia', flag: '🇯🇵', apiKey: 'soccer_afc_champions_league' }
    ],
    basketball: [
      { id: 'nba', name: 'NBA', country: 'USA', flag: '🇺🇸', apiKey: 'basketball_nba' },
      { id: 'euroleague', name: 'EuroLeague', country: 'Europe', flag: '🇪🇺', apiKey: 'basketball_euroleague' }
    ],
    tennis: [
      { id: 'atp-masters', name: 'ATP Masters', country: 'World', flag: '🌍', apiKey: 'tennis_atp' },
      { id: 'wta-tour', name: 'WTA Tour', country: 'World', flag: '🌍', apiKey: 'tennis_wta' }
    ],
    'ice-hockey': [
      { id: 'nhl', name: 'NHL', country: 'North America', flag: '🇺🇸', apiKey: 'icehockey_nhl' }
    ]
  };

  // Fetch live top leagues data
  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/top-leagues', sport],
    queryFn: () => fetch(`/api/top-leagues/${sport}`).then(res => res.json()),
  });



  const getSportName = (sport: string) => {
    const names: { [key: string]: string } = {
      football: 'Football',
      basketball: 'Basketball', 
      tennis: 'Tennis',
      'ice-hockey': 'Ice Hockey',
      'american-football': 'American Football',
      baseball: 'Baseball'
    };
    return names[sport] || 'Football';
  };

  // Toggle function for league dropdowns
  const toggleLeague = (league: string) => {
    const newExpanded = new Set(expandedLeagues);
    if (newExpanded.has(league)) {
      newExpanded.delete(league);
    } else {
      newExpanded.add(league);
    }
    setExpandedLeagues(newExpanded);
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

  // Get current sport's top leagues
  const currentSportLeagues = topLeagues[sport as keyof typeof topLeagues] || [];
  
  // Group matches by league (only showing top leagues)
  const groupedMatches = matches
    .filter(match => {
      // Only show matches from top-tier leagues
      const matchLeague = match.league.toLowerCase();
      return currentSportLeagues.some(league => 
        matchLeague.includes(league.name.toLowerCase()) ||
        matchLeague.includes(league.country.toLowerCase())
      );
    })
    .reduce((acc, match) => {
      const key = match.league;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    }, {} as { [key: string]: any[] });

  // Group leagues by region
  const groupedLeagues = currentSportLeagues.reduce((acc, league) => {
    let region = 'Other';
    if (['England', 'Spain', 'Germany', 'Italy', 'France', 'Netherlands', 'Portugal', 'Scotland', 'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Finland', 'Greece', 'Hungary', 'Ireland', 'Sweden', 'Switzerland', 'Turkey'].includes(league.country)) {
      region = 'Europe';
    } else if (['Brazil', 'Argentina', 'Chile', 'Colombia', 'Uruguay'].includes(league.country)) {
      region = 'South America';
    } else if (['USA', 'Mexico', 'Canada'].includes(league.country)) {
      region = 'North America';
    } else if (['Japan', 'South Korea', 'China', 'Australia', 'India'].includes(league.country)) {
      region = 'Asia-Pacific';
    } else if (['South Africa', 'Egypt', 'Nigeria'].includes(league.country)) {
      region = 'Africa';
    } else if (league.country === 'Europe' || league.country === 'South America' || league.country === 'North America' || league.country === 'Asia' || league.country === 'Africa' || league.country === 'World') {
      region = 'Continental';
    }
    
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(league);
    return acc;
  }, {} as { [key: string]: typeof currentSportLeagues });

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Top {getSportName(sport)} Leagues
        </h1>
        <p className="text-gray-400 mt-1">
          Premier competitions from around the world
        </p>
      </div>

      <div className="px-4 py-4">
        {Object.keys(groupedLeagues).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No top leagues available for {getSportName(sport)}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Show data availability status */}
            {matches.length === 0 && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  Live match data is currently unavailable. League structure is displayed below for reference.
                </p>
              </div>
            )}

            {Object.entries(groupedLeagues).map(([region, leagues]) => (
              <div key={region} className="border-b border-gray-700/30 pb-6">
                {/* Region Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">{region}</h2>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
                </div>

                {/* Leagues in this region */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leagues.map((league) => {
                    const leagueMatches = groupedMatches[league.name] || [];
                    const hasMatches = leagueMatches.length > 0;
                    
                    return (
                      <Button
                        key={league.id}
                        variant="ghost"
                        onClick={() => hasMatches && toggleLeague(league.name)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg text-left border border-gray-700/30 ${
                          hasMatches ? 'hover:bg-gray-800/50 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{league.flag}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{league.name}</span>
                            <span className="text-xs text-gray-400">{league.country}</span>
                            {hasMatches && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full mt-1 w-fit">
                                {leagueMatches.length} matches
                              </span>
                            )}
                          </div>
                        </div>
                        <Trophy className={`w-4 h-4 ${hasMatches ? 'text-yellow-400' : 'text-gray-500'}`} />
                      </Button>
                    );
                  })}
                </div>

                {/* Show expanded matches if any league is expanded */}
                {Object.entries(groupedMatches).map(([leagueName, leagueMatches]) => {
                  if (!expandedLeagues.has(leagueName)) return null;
                  
                  return (
                    <div key={leagueName} className="mt-6 bg-gray-800/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        {leagueName} Matches
                      </h3>
                      <div className="space-y-3">
                        {(leagueMatches as any[]).map((match: any, index: number) => (
                          <div key={match.id}>
                            <MatchCard
                              eventId={match.id.toString()}
                              homeTeam={match.homeTeam}
                              awayTeam={match.awayTeam}
                              league={match.league}
                              time={new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              commenceTime={match.startTime}
                              homeOdds={match.odds?.home ? parseFloat(match.odds.home.toString()).toFixed(2) : '1.00'}
                              drawOdds={match.odds?.draw ? parseFloat(match.odds.draw.toString()).toFixed(2) : undefined}
                              awayOdds={match.odds?.away ? parseFloat(match.odds.away.toString()).toFixed(2) : '1.00'}
                              onBetClick={onBetClick}
                              sport={getSportName(sport)}
                            />
                            {index < (leagueMatches as any[]).length - 1 && (
                              <div className="my-3 border-b border-gray-700/20"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}