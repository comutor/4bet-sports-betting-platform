import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Country {
  id: string;
  name: string;
  flag: string;
  leagues: string[];
}

interface CountriesSectionProps {
  selectedCategory?: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function CountriesSection({ selectedCategory = 'top-countries', onBetClick }: CountriesSectionProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const topCountries: Country[] = [
    { id: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', leagues: ['Premier League', 'Championship', 'League One'] },
    { id: 'spain', name: 'Spain', flag: '🇪🇸', leagues: ['La Liga', 'Segunda División', 'Copa del Rey'] },
    { id: 'germany', name: 'Germany', flag: '🇩🇪', leagues: ['Bundesliga', '2. Bundesliga', 'DFB-Pokal'] },
    { id: 'italy', name: 'Italy', flag: '🇮🇹', leagues: ['Serie A', 'Serie B', 'Coppa Italia'] },
    { id: 'france', name: 'France', flag: '🇫🇷', leagues: ['Ligue 1', 'Ligue 2', 'Coupe de France'] },
    { id: 'usa', name: 'United States', flag: '🇺🇸', leagues: ['MLS', 'NBA', 'NFL', 'MLB'] },
    { id: 'brazil', name: 'Brazil', flag: '🇧🇷', leagues: ['Série A', 'Série B', 'Copa do Brasil'] },
    { id: 'argentina', name: 'Argentina', flag: '🇦🇷', leagues: ['Primera División', 'Primera Nacional'] }
  ];

  const internationalCompetitions: Country[] = [
    { id: 'uefa', name: 'UEFA', flag: '🏆', leagues: ['Champions League', 'Europa League', 'Conference League'] },
    { id: 'fifa', name: 'FIFA', flag: '⚽', leagues: ['World Cup', 'Nations League', 'Club World Cup'] },
    { id: 'conmebol', name: 'CONMEBOL', flag: '🌎', leagues: ['Copa Libertadores', 'Copa Sudamericana'] },
    { id: 'concacaf', name: 'CONCACAF', flag: '🌍', leagues: ['Champions Cup', 'Nations League'] }
  ];

  const otherCountries: Country[] = [
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹', leagues: ['Primeira Liga', 'Segunda Liga'] },
    { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', leagues: ['Eredivisie', 'Eerste Divisie'] },
    { id: 'turkey', name: 'Turkey', flag: '🇹🇷', leagues: ['Süper Lig', '1. Lig'] },
    { id: 'russia', name: 'Russia', flag: '🇷🇺', leagues: ['Premier League', 'FNL'] },
    { id: 'mexico', name: 'Mexico', flag: '🇲🇽', leagues: ['Liga MX', 'Liga de Expansión'] },
    { id: 'japan', name: 'Japan', flag: '🇯🇵', leagues: ['J1 League', 'J2 League'] },
    { id: 'australia', name: 'Australia', flag: '🇦🇺', leagues: ['A-League', 'NPL'] },
    { id: 'china', name: 'China', flag: '🇨🇳', leagues: ['Super League', 'League One'] }
  ];

  const getCountriesByCategory = () => {
    switch (selectedCategory) {
      case 'international':
        return internationalCompetitions;
      case 'other-countries':
        return otherCountries;
      default:
        return topCountries;
    }
  };

  const countries = getCountriesByCategory();



  return (
    <div className="space-y-6">
      {/* Country/Competition List */}
      <div className="grid grid-cols-1 gap-3">
        {countries.map((country) => (
          <div key={country.id} className="bg-slate-800 rounded-lg border border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-between text-left p-4 h-auto"
              onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <div className="font-semibold text-white">{country.name}</div>
                  <div className="text-sm text-gray-400">{country.leagues.length} competitions</div>
                </div>
              </div>
              <i className={`fas fa-chevron-${selectedCountry === country.id ? 'up' : 'down'} text-gray-400`}></i>
            </Button>
            
            {/* Expanded Leagues */}
            {selectedCountry === country.id && (
              <div className="border-t border-gray-700 p-4 space-y-2">
                {country.leagues.map((league, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
                  >
                    <i className="fas fa-trophy mr-3 text-yellow-500"></i>
                    {league}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>


    </div>
  );
}