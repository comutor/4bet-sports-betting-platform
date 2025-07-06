import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { MatchCard } from './MatchCard';

interface League {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
  flag: string;
  leagues: League[];
}

interface Continent {
  id: string;
  name: string;
  icon: string;
  leagues: League[];
}

interface CompetitionsSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  onLeagueClick: (leagueId: string, leagueName: string) => void;
  sport?: string;
}

// Sport-specific league data
const sportData = {
  football: {
    countries: [
      {
        id: 'england',
        name: 'England',
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        leagues: [
          { id: 'premier-league', name: 'Premier League' },
          { id: 'championship', name: 'Championship' },
          { id: 'league-one', name: 'League One' },
          { id: 'league-two', name: 'League Two' }
        ]
      },
      {
        id: 'spain',
        name: 'Spain',
        flag: '🇪🇸',
        leagues: [
          { id: 'la-liga', name: 'La Liga' },
          { id: 'segunda-division', name: 'Segunda División' },
          { id: 'primera-rfef', name: 'Primera RFEF' }
        ]
      },
      {
        id: 'germany',
        name: 'Germany',
        flag: '🇩🇪',
        leagues: [
          { id: 'bundesliga', name: 'Bundesliga' },
          { id: '2-bundesliga', name: '2. Bundesliga' },
          { id: '3-liga', name: '3. Liga' }
        ]
      },
      {
        id: 'italy',
        name: 'Italy',
        flag: '🇮🇹',
        leagues: [
          { id: 'serie-a', name: 'Serie A' },
          { id: 'serie-b', name: 'Serie B' },
          { id: 'serie-c', name: 'Serie C' }
        ]
      },
      {
        id: 'france',
        name: 'France',
        flag: '🇫🇷',
        leagues: [
          { id: 'ligue-1', name: 'Ligue 1' },
          { id: 'ligue-2', name: 'Ligue 2' },
          { id: 'national', name: 'National' }
        ]
      },
      {
        id: 'netherlands',
        name: 'Netherlands',
        flag: '🇳🇱',
        leagues: [
          { id: 'eredivisie', name: 'Eredivisie' },
          { id: 'eerste-divisie', name: 'Eerste Divisie' }
        ]
      },
      {
        id: 'portugal',
        name: 'Portugal',
        flag: '🇵🇹',
        leagues: [
          { id: 'primeira-liga', name: 'Primeira Liga' },
          { id: 'liga-portugal-2', name: 'Liga Portugal 2' }
        ]
      },
      {
        id: 'belgium',
        name: 'Belgium',
        flag: '🇧🇪',
        leagues: [
          { id: 'pro-league', name: 'Pro League' },
          { id: 'challenger-pro-league', name: 'Challenger Pro League' }
        ]
      },
      {
        id: 'brazil',
        name: 'Brazil',
        flag: '🇧🇷',
        leagues: [
          { id: 'brasileiro-serie-a', name: 'Brasileirão Série A' },
          { id: 'brasileiro-serie-b', name: 'Brasileirão Série B' }
        ]
      },
      {
        id: 'argentina',
        name: 'Argentina',
        flag: '🇦🇷',
        leagues: [
          { id: 'primera-division', name: 'Primera División' },
          { id: 'primera-nacional', name: 'Primera Nacional' }
        ]
      },
      {
        id: 'mexico',
        name: 'Mexico',
        flag: '🇲🇽',
        leagues: [
          { id: 'liga-mx', name: 'Liga MX' },
          { id: 'ascenso-mx', name: 'Liga de Expansión MX' }
        ]
      },
      {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        leagues: [
          { id: 'mls', name: 'Major League Soccer' },
          { id: 'usl-championship', name: 'USL Championship' }
        ]
      },
      {
        id: 'russia',
        name: 'Russia',
        flag: '🇷🇺',
        leagues: [
          { id: 'premier-league', name: 'Russian Premier League' },
          { id: 'first-league', name: 'First League' }
        ]
      },
      {
        id: 'turkey',
        name: 'Turkey',
        flag: '🇹🇷',
        leagues: [
          { id: 'super-lig', name: 'Süper Lig' },
          { id: 'tff-first-league', name: 'TFF First League' }
        ]
      },
      {
        id: 'scotland',
        name: 'Scotland',
        flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        leagues: [
          { id: 'premiership', name: 'Scottish Premiership' },
          { id: 'championship', name: 'Scottish Championship' }
        ]
      }
    ],
    continents: [
      {
        id: 'uefa',
        name: 'UEFA',
        icon: '🏆',
        leagues: [
          { id: 'champions-league', name: 'Champions League' },
          { id: 'europa-league', name: 'Europa League' },
          { id: 'conference-league', name: 'Europa Conference League' },
          { id: 'euro-championship', name: 'UEFA Euro Championship' },
          { id: 'nations-league', name: 'UEFA Nations League' }
        ]
      },
      {
        id: 'conmebol',
        name: 'CONMEBOL',
        icon: '🏆',
        leagues: [
          { id: 'copa-libertadores', name: 'Copa Libertadores' },
          { id: 'copa-sudamericana', name: 'Copa Sudamericana' },
          { id: 'copa-america', name: 'Copa América' }
        ]
      },
      {
        id: 'concacaf',
        name: 'CONCACAF',
        icon: '🏆',
        leagues: [
          { id: 'champions-cup', name: 'CONCACAF Champions Cup' },
          { id: 'gold-cup', name: 'CONCACAF Gold Cup' }
        ]
      },
      {
        id: 'caf',
        name: 'CAF',
        icon: '🏆',
        leagues: [
          { id: 'champions-league', name: 'CAF Champions League' },
          { id: 'confederation-cup', name: 'CAF Confederation Cup' },
          { id: 'africa-cup', name: 'Africa Cup of Nations' }
        ]
      },
      {
        id: 'afc',
        name: 'AFC',
        icon: '🏆',
        leagues: [
          { id: 'champions-league', name: 'AFC Champions League' },
          { id: 'asian-cup', name: 'AFC Asian Cup' }
        ]
      },
      {
        id: 'fifa',
        name: 'FIFA',
        icon: '🏆',
        leagues: [
          { id: 'world-cup', name: 'FIFA World Cup' },
          { id: 'club-world-cup', name: 'FIFA Club World Cup' }
        ]
      }
    ]
  },
  basketball: {
    countries: [
      {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        leagues: [
          { id: 'nba', name: 'NBA' },
          { id: 'wnba', name: 'WNBA' }
        ]
      },
      {
        id: 'spain',
        name: 'Spain',
        flag: '🇪🇸',
        leagues: [
          { id: 'acb', name: 'Liga ACB' }
        ]
      }
    ],
    continents: [
      {
        id: 'euroleague',
        name: 'EuroLeague',
        icon: '🏆',
        leagues: [
          { id: 'euroleague', name: 'EuroLeague' },
          { id: 'eurocup', name: 'EuroCup' }
        ]
      }
    ]
  },
  tennis: {
    countries: [
      {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        leagues: [
          { id: 'us-open', name: 'US Open' }
        ]
      },
      {
        id: 'france',
        name: 'France',
        flag: '🇫🇷',
        leagues: [
          { id: 'french-open', name: 'French Open' }
        ]
      }
    ],
    continents: [
      {
        id: 'atp',
        name: 'ATP',
        icon: '🏆',
        leagues: [
          { id: 'atp-finals', name: 'ATP Finals' },
          { id: 'atp-masters', name: 'ATP Masters 1000' }
        ]
      }
    ]
  },
  'ice-hockey': {
    countries: [
      {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        leagues: [
          { id: 'nhl', name: 'NHL' }
        ]
      },
      {
        id: 'canada',
        name: 'Canada',
        flag: '🇨🇦',
        leagues: [
          { id: 'nhl-canada', name: 'NHL (Canadian Teams)' }
        ]
      }
    ],
    continents: [
      {
        id: 'iihf',
        name: 'IIHF',
        icon: '🏆',
        leagues: [
          { id: 'world-championship', name: 'World Championship' }
        ]
      }
    ]
  },
  'american-football': {
    countries: [
      {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        leagues: [
          { id: 'nfl', name: 'NFL' },
          { id: 'college-football', name: 'NCAA College Football' },
          { id: 'xfl', name: 'XFL' }
        ]
      }
    ],
    continents: [
      {
        id: 'international',
        name: 'International',
        icon: '🏆',
        leagues: [
          { id: 'ifaf-world-championship', name: 'IFAF World Championship' }
        ]
      }
    ]
  }
};

const getSportData = (sport: string) => {
  return sportData[sport as keyof typeof sportData] || sportData.football;
};

export function CompetitionsSection({ onBetClick, onLeagueClick, sport = 'football' }: CompetitionsSectionProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set());

  // Fetch live competitions data
  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/competitions', sport],
    queryFn: () => fetch(`/api/competitions/${sport}`).then(res => res.json()),
  });

  const getSportName = (sport: string) => {
    const names: { [key: string]: string } = {
      football: 'Football',
      basketball: 'Basketball',
      tennis: 'Tennis',
      'ice-hockey': 'Ice Hockey',
      'american-football': 'American Football'
    };
    return names[sport] || 'Football';
  };

  // Toggle functions for dropdowns
  const toggleCountry = (country: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(country)) {
      newExpanded.delete(country);
      // Also close all leagues in this country
      const leaguesToClose = Object.keys(groupedMatches[country] || {}).map(league => `${country}-${league}`);
      leaguesToClose.forEach(league => {
        const newExpandedLeagues = new Set(expandedLeagues);
        newExpandedLeagues.delete(league);
        setExpandedLeagues(newExpandedLeagues);
      });
    } else {
      newExpanded.add(country);
    }
    setExpandedCountries(newExpanded);
  };

  const toggleLeague = (country: string, league: string) => {
    const leagueKey = `${country}-${league}`;
    const newExpanded = new Set(expandedLeagues);
    if (newExpanded.has(leagueKey)) {
      newExpanded.delete(leagueKey);
    } else {
      newExpanded.add(leagueKey);
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

  // Country flag mapping
  const getCountryFlag = (country: string): string => {
    const flagMap: { [key: string]: string } = {
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪', 
      'Italy': '🇮🇹',
      'France': '🇫🇷',
      'Netherlands': '🇳🇱',
      'Portugal': '🇵🇹',
      'Belgium': '🇧🇪',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'USA': '🇺🇸',
      'Mexico': '🇲🇽',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'Russia': '🇷🇺',
      'Ukraine': '🇺🇦',
      'Poland': '🇵🇱',
      'Turkey': '🇹🇷',
      'International': '🌍'
    };
    return flagMap[country] || '🏳️';
  };

  // Group matches by country and league
  const groupedMatches = (matches as any[]).reduce((acc, match) => {
    const countryKey = match.country || 'International';
    const leagueKey = match.league;
    
    if (!acc[countryKey]) {
      acc[countryKey] = {};
    }
    if (!acc[countryKey][leagueKey]) {
      acc[countryKey][leagueKey] = [];
    }
    acc[countryKey][leagueKey].push(match);
    return acc;
  }, {} as { [country: string]: { [league: string]: any[] } });

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <h1 className="text-2xl font-bold text-white">
          {getSportName(sport)} Competitions
        </h1>
        <p className="text-gray-400 mt-1">
          Live matches organized by country and league
        </p>
      </div>

      <div className="px-4 py-4">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No competition matches available at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMatches).map(([country, leagues]) => (
              <div key={country} className="border-b border-gray-700/30 pb-4">
                {/* Country Dropdown Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleCountry(country)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCountryFlag(country)}</span>
                    <span className="text-lg font-semibold text-white">{country}</span>
                    <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">
                      {Object.keys(leagues as { [key: string]: any[] }).length} leagues
                    </span>
                  </div>
                  {expandedCountries.has(country) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </Button>

                {/* Country Dropdown Content */}
                {expandedCountries.has(country) && (
                  <div className="ml-4 mt-3 space-y-3">
                    {Object.entries(leagues as { [key: string]: any[] }).map(([league, leagueMatches]) => (
                      <div key={league} className="border-l-2 border-gray-700 pl-4">
                        {/* League Dropdown Header */}
                        <Button
                          variant="ghost"
                          onClick={() => toggleLeague(country, league)}
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-800/30 rounded text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base font-medium text-white">{league}</span>
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              {(leagueMatches as any[]).length} matches
                            </span>
                          </div>
                          {expandedLeagues.has(`${country}-${league}`) ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>

                        {/* League Dropdown Content - Matches */}
                        {expandedLeagues.has(`${country}-${league}`) && (
                          <div className="mt-3 space-y-3">
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
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}