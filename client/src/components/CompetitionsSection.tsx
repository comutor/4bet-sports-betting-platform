import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export function CompetitionsSection({ onBetClick, sport = 'football' }: CompetitionsSectionProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [expandedContinents, setExpandedContinents] = useState<Set<string>>(new Set());

  const currentSportData = getSportData(sport);
  const countries = currentSportData.countries;
  const continents = currentSportData.continents;

  const toggleCountryExpansion = (countryId: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryId)) {
      newExpanded.delete(countryId);
    } else {
      newExpanded.add(countryId);
    }
    setExpandedCountries(newExpanded);
  };

  const toggleContinentExpansion = (continentId: string) => {
    const newExpanded = new Set(expandedContinents);
    if (newExpanded.has(continentId)) {
      newExpanded.delete(continentId);
    } else {
      newExpanded.add(continentId);
    }
    setExpandedContinents(newExpanded);
  };

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

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <h1 className="text-2xl font-bold text-white">
          {getSportName(sport)} Competitions
        </h1>
        <p className="text-gray-400 mt-1">
          Browse leagues and tournaments by country and continent
        </p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Continental Competitions */}
        {continents && continents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              Continental Competitions
            </h2>
            <div className="space-y-3">
              {continents.map((continent) => (
                <div key={continent.id} className="bg-slate-800/50 rounded-lg">
                  <Button
                    variant="ghost"
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/50"
                    onClick={() => toggleContinentExpansion(continent.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{continent.icon}</span>
                      <span className="font-semibold text-white text-lg">{continent.name}</span>
                      <span className="text-gray-400 text-sm">
                        ({continent.leagues.length} competitions)
                      </span>
                    </div>
                    {expandedContinents.has(continent.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  
                  {expandedContinents.has(continent.id) && (
                    <div className="px-4 pb-4 space-y-2">
                      {continent.leagues.map((league) => (
                        <div 
                          key={league.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
                          onClick={() => onBetClick(league.name, 'League', '1.85')}
                        >
                          <span className="text-white font-medium">{league.name}</span>
                          <span className="text-gray-400 text-sm">View Markets</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Countries */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            Countries
          </h2>
          <div className="space-y-3">
            {countries.map((country) => (
              <div key={country.id} className="bg-slate-800/50 rounded-lg">
                <Button
                  variant="ghost"
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/50"
                  onClick={() => toggleCountryExpansion(country.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-semibold text-white text-lg">{country.name}</span>
                    <span className="text-gray-400 text-sm">
                      ({country.leagues.length} leagues)
                    </span>
                  </div>
                  {expandedCountries.has(country.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </Button>
                
                {expandedCountries.has(country.id) && (
                  <div className="px-4 pb-4 space-y-2">
                    {country.leagues.map((league) => (
                      <div 
                        key={league.id}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
                        onClick={() => onBetClick(league.name, 'League', '1.85')}
                      >
                        <span className="text-white font-medium">{league.name}</span>
                        <span className="text-gray-400 text-sm">View Markets</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}