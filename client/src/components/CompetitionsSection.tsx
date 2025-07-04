import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface League {
  id: string;
  name: string;
  country?: string;
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
}

const countries: Country[] = [
  {
    id: 'afghanistan',
    name: 'Afghanistan',
    flag: '🇦🇫',
    leagues: [
      { id: 'afghan-premier-league', name: 'Afghan Premier League' }
    ]
  },
  {
    id: 'albania',
    name: 'Albania',
    flag: '🇦🇱',
    leagues: [
      { id: 'albanian-superliga', name: 'Kategoria Superiore' }
    ]
  },
  {
    id: 'algeria',
    name: 'Algeria',
    flag: '🇩🇿',
    leagues: [
      { id: 'algerian-ligue-1', name: 'Ligue Professionnelle 1' }
    ]
  },
  {
    id: 'andorra',
    name: 'Andorra',
    flag: '🇦🇩',
    leagues: [
      { id: 'andorran-primera-divisio', name: 'Primera Divisió' }
    ]
  },
  {
    id: 'angola',
    name: 'Angola',
    flag: '🇦🇴',
    leagues: [
      { id: 'angolan-girabola', name: 'Girabola' }
    ]
  },
  {
    id: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    leagues: [
      { id: 'argentina-primera-division', name: 'Primera División' },
      { id: 'argentina-primera-nacional', name: 'Primera Nacional' }
    ]
  },
  {
    id: 'armenia',
    name: 'Armenia',
    flag: '🇦🇲',
    leagues: [
      { id: 'armenian-premier-league', name: 'Armenian Premier League' }
    ]
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    leagues: [
      { id: 'a-league', name: 'A-League Men' },
      { id: 'a-league-women', name: 'A-League Women' }
    ]
  },
  {
    id: 'austria',
    name: 'Austria',
    flag: '🇦🇹',
    leagues: [
      { id: 'austrian-bundesliga', name: 'Austrian Bundesliga' },
      { id: 'austrian-2-liga', name: '2. Liga' }
    ]
  },
  {
    id: 'belgium',
    name: 'Belgium',
    flag: '🇧🇪',
    leagues: [
      { id: 'belgian-pro-league', name: 'Jupiler Pro League' },
      { id: 'belgian-first-division-b', name: 'Challenger Pro League' }
    ]
  },
  {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    leagues: [
      { id: 'brazilian-serie-a', name: 'Campeonato Brasileiro Série A' },
      { id: 'brazilian-serie-b', name: 'Campeonato Brasileiro Série B' }
    ]
  },
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
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    leagues: [
      { id: 'ligue-1', name: 'Ligue 1' },
      { id: 'ligue-2', name: 'Ligue 2' }
    ]
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    leagues: [
      { id: 'bundesliga', name: 'Bundesliga' },
      { id: '2-bundesliga', name: '2. Bundesliga' }
    ]
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    leagues: [
      { id: 'serie-a', name: 'Serie A' },
      { id: 'serie-b', name: 'Serie B' }
    ]
  },
  {
    id: 'spain',
    name: 'Spain',
    flag: '🇪🇸',
    leagues: [
      { id: 'la-liga', name: 'La Liga' },
      { id: 'segunda-division', name: 'Segunda División' }
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
      { id: 'segunda-liga', name: 'Liga Portugal 2' }
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
    id: 'mexico',
    name: 'Mexico',
    flag: '🇲🇽',
    leagues: [
      { id: 'liga-mx', name: 'Liga MX' },
      { id: 'liga-de-expansion-mx', name: 'Liga de Expansión MX' }
    ]
  }
];

const continents: Continent[] = [
  {
    id: 'europe',
    name: 'Europe',
    icon: '🇪🇺',
    leagues: [
      { id: 'champions-league', name: 'UEFA Champions League' },
      { id: 'europa-league', name: 'UEFA Europa League' },
      { id: 'conference-league', name: 'UEFA Conference League' },
      { id: 'nations-league', name: 'UEFA Nations League' },
      { id: 'european-championship', name: 'UEFA European Championship' }
    ]
  },
  {
    id: 'south-america',
    name: 'South America',
    icon: '🌎',
    leagues: [
      { id: 'copa-libertadores', name: 'CONMEBOL Libertadores' },
      { id: 'copa-sudamericana', name: 'CONMEBOL Sudamericana' },
      { id: 'copa-america', name: 'Copa América' },
      { id: 'recopa-sudamericana', name: 'Recopa Sudamericana' }
    ]
  },
  {
    id: 'north-america',
    name: 'North America',
    icon: '🇺🇸',
    leagues: [
      { id: 'concacaf-champions-cup', name: 'CONCACAF Champions Cup' },
      { id: 'concacaf-league', name: 'CONCACAF League' },
      { id: 'gold-cup', name: 'CONCACAF Gold Cup' },
      { id: 'nations-league-concacaf', name: 'CONCACAF Nations League' }
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    leagues: [
      { id: 'caf-champions-league', name: 'CAF Champions League' },
      { id: 'caf-confederation-cup', name: 'CAF Confederation Cup' },
      { id: 'africa-cup-of-nations', name: 'Africa Cup of Nations' },
      { id: 'caf-super-cup', name: 'CAF Super Cup' }
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: '🌏',
    leagues: [
      { id: 'afc-champions-league', name: 'AFC Champions League' },
      { id: 'afc-cup', name: 'AFC Cup' },
      { id: 'asian-cup', name: 'AFC Asian Cup' },
      { id: 'afc-champions-league-two', name: 'AFC Champions League Two' }
    ]
  },
  {
    id: 'world',
    name: 'World',
    icon: '🌍',
    leagues: [
      { id: 'fifa-world-cup', name: 'FIFA World Cup' },
      { id: 'fifa-club-world-cup', name: 'FIFA Club World Cup' },
      { id: 'fifa-confederations-cup', name: 'FIFA Confederations Cup' }
    ]
  }
];

export function CompetitionsSection({ onBetClick }: CompetitionsSectionProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [expandedContinents, setExpandedContinents] = useState<Set<string>>(new Set());

  const toggleCountry = (countryId: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryId)) {
      newExpanded.delete(countryId);
    } else {
      newExpanded.add(countryId);
    }
    setExpandedCountries(newExpanded);
  };

  const toggleContinent = (continentId: string) => {
    const newExpanded = new Set(expandedContinents);
    if (newExpanded.has(continentId)) {
      newExpanded.delete(continentId);
    } else {
      newExpanded.add(continentId);
    }
    setExpandedContinents(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Competitions</h2>
        <div className="text-sm text-gray-400">
          {countries.length} countries • {continents.length} continental competitions
        </div>
      </div>

      {/* Continents Section */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-slate-700 border-b border-slate-600">
          <h3 className="text-lg font-semibold text-white">Continental Competitions</h3>
        </div>
        
        <div className="divide-y divide-slate-600">
          {continents.map((continent) => (
            <div key={continent.id}>
              <button
                onClick={() => toggleContinent(continent.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{continent.icon}</span>
                  <span className="font-medium text-white">{continent.name}</span>
                  <span className="text-sm text-gray-400">({continent.leagues.length} competitions)</span>
                </div>
                {expandedContinents.has(continent.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedContinents.has(continent.id) && (
                <div className="bg-slate-750 border-t border-slate-600">
                  {continent.leagues.map((league) => (
                    <button
                      key={league.id}
                      className="w-full px-8 py-3 text-left hover:bg-slate-600 transition-colors border-b border-slate-600/50 last:border-b-0"
                      onClick={() => onBetClick(league.name, 'View Matches', '1.0')}
                    >
                      <div className="text-sm text-white">{league.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Countries Section */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-slate-700 border-b border-slate-600">
          <h3 className="text-lg font-semibold text-white">Countries</h3>
        </div>
        
        <div className="divide-y divide-slate-600">
          {countries.map((country) => (
            <div key={country.id}>
              <button
                onClick={() => toggleCountry(country.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-medium text-white">{country.name}</span>
                  <span className="text-sm text-gray-400">({country.leagues.length} leagues)</span>
                </div>
                {expandedCountries.has(country.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedCountries.has(country.id) && (
                <div className="bg-slate-750 border-t border-slate-600">
                  {country.leagues.map((league) => (
                    <button
                      key={league.id}
                      className="w-full px-8 py-3 text-left hover:bg-slate-600 transition-colors border-b border-slate-600/50 last:border-b-0"
                      onClick={() => onBetClick(league.name, 'View Matches', '1.0')}
                    >
                      <div className="text-sm text-white">{league.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}