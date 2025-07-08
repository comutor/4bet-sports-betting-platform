import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: string;
  current: boolean;
}

interface Country {
  name: string;
  code: string;
  flag: string;
  leagues: League[];
}

interface CompetitionsSectionProps {
  sport: string;
  selectedDate: string;
}

export function CompetitionsSection({ sport, selectedDate }: CompetitionsSectionProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  // Fetch competitions by country in A-Z format
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['/api/competitions/countries', sport],
    enabled: !!sport
  });

  const toggleCountry = (countryName: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryName)) {
      newExpanded.delete(countryName);
    } else {
      newExpanded.add(countryName);
    }
    setExpandedCountries(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!countries.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No competitions available for {sport}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {countries.map((country: Country) => (
        <div key={country.name} className="border border-gray-700 rounded-lg overflow-hidden">
          {/* Country Header */}
          <button
            onClick={() => toggleCountry(country.name)}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{country.flag}</span>
              <span className="font-semibold text-white">{country.name}</span>
              <span className="text-sm text-gray-400">
                ({country.leagues.length} {country.leagues.length === 1 ? 'league' : 'leagues'})
              </span>
            </div>
            {expandedCountries.has(country.name) ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Leagues List */}
          {expandedCountries.has(country.name) && (
            <div className="bg-gray-850 border-t border-gray-700">
              {country.leagues.map((league) => (
                <div
                  key={league.id}
                  className="px-6 py-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {league.logo && (
                        <img
                          src={league.logo}
                          alt={league.name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <div>
                        <span className="text-white font-medium">{league.name}</span>
                        {league.type && (
                          <span className="ml-2 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {league.type}
                          </span>
                        )}
                      </div>
                    </div>
                    {league.current && (
                      <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}