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
    { id: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', leagues: ['Premier League', 'Championship', 'League One', 'League Two', 'FA Cup'] },
    { id: 'spain', name: 'Spain', flag: '🇪🇸', leagues: ['La Liga', 'Segunda División', 'Copa del Rey', 'Segunda División B'] },
    { id: 'germany', name: 'Germany', flag: '🇩🇪', leagues: ['Bundesliga', '2. Bundesliga', 'DFB-Pokal', '3. Liga'] },
    { id: 'italy', name: 'Italy', flag: '🇮🇹', leagues: ['Serie A', 'Serie B', 'Coppa Italia', 'Serie C'] },
    { id: 'france', name: 'France', flag: '🇫🇷', leagues: ['Ligue 1', 'Ligue 2', 'Coupe de France', 'Coupe de la Ligue'] },
    { id: 'usa', name: 'United States', flag: '🇺🇸', leagues: ['MLS', 'NBA', 'NFL', 'MLB', 'NHL', 'WNBA'] },
    { id: 'brazil', name: 'Brazil', flag: '🇧🇷', leagues: ['Série A', 'Série B', 'Copa do Brasil', 'State Championships'] },
    { id: 'argentina', name: 'Argentina', flag: '🇦🇷', leagues: ['Primera División', 'Primera Nacional', 'Copa Argentina'] },
    { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', leagues: ['Eredivisie', 'Eerste Divisie', 'KNVB Cup'] },
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹', leagues: ['Primeira Liga', 'Segunda Liga', 'Taça de Portugal'] },
    { id: 'belgium', name: 'Belgium', flag: '🇧🇪', leagues: ['Pro League', 'Challenger Pro League', 'Belgian Cup'] },
    { id: 'turkey', name: 'Turkey', flag: '🇹🇷', leagues: ['Süper Lig', '1. Lig', 'Turkish Cup', 'Basketball Super League'] }
  ];

  const internationalCompetitions: Country[] = [
    { id: 'uefa', name: 'UEFA', flag: '🏆', leagues: ['Champions League', 'Europa League', 'Conference League'] },
    { id: 'fifa', name: 'FIFA', flag: '⚽', leagues: ['World Cup', 'Nations League', 'Club World Cup'] },
    { id: 'conmebol', name: 'CONMEBOL', flag: '🌎', leagues: ['Copa Libertadores', 'Copa Sudamericana'] },
    { id: 'concacaf', name: 'CONCACAF', flag: '🌍', leagues: ['Champions Cup', 'Nations League'] }
  ];

  const otherCountries: Country[] = [
    { id: 'russia', name: 'Russia', flag: '🇷🇺', leagues: ['Premier League', 'FNL', 'VTB United League'] },
    { id: 'mexico', name: 'Mexico', flag: '🇲🇽', leagues: ['Liga MX', 'Liga de Expansión', 'Copa MX'] },
    { id: 'japan', name: 'Japan', flag: '🇯🇵', leagues: ['J1 League', 'J2 League', 'Emperor Cup'] },
    { id: 'australia', name: 'Australia', flag: '🇦🇺', leagues: ['A-League', 'NPL', 'FFA Cup'] },
    { id: 'china', name: 'China', flag: '🇨🇳', leagues: ['Super League', 'League One', 'FA Cup'] },
    { id: 'south_korea', name: 'South Korea', flag: '🇰🇷', leagues: ['K League 1', 'K League 2', 'KBL'] },
    { id: 'greece', name: 'Greece', flag: '🇬🇷', leagues: ['Super League', 'Greek Cup', 'Basketball League'] },
    { id: 'scotland', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', leagues: ['Premiership', 'Championship', 'Scottish Cup'] },
    { id: 'norway', name: 'Norway', flag: '🇳🇴', leagues: ['Eliteserien', 'OBOS-ligaen', 'Norwegian Cup'] },
    { id: 'sweden', name: 'Sweden', flag: '🇸🇪', leagues: ['Allsvenskan', 'Superettan', 'Svenska Cupen'] },
    { id: 'denmark', name: 'Denmark', flag: '🇩🇰', leagues: ['Superliga', '1st Division', 'Danish Cup'] },
    { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', leagues: ['Super League', 'Challenge League', 'Swiss Cup'] },
    { id: 'austria', name: 'Austria', flag: '🇦🇹', leagues: ['Bundesliga', '2. Liga', 'ÖFB Cup'] },
    { id: 'czech_republic', name: 'Czech Republic', flag: '🇨🇿', leagues: ['First League', 'Second League', 'Czech Cup'] },
    { id: 'poland', name: 'Poland', flag: '🇵🇱', leagues: ['Ekstraklasa', 'I Liga', 'Polish Cup'] },
    { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', leagues: ['Premier League', 'First League', 'Ukrainian Cup'] },
    { id: 'croatia', name: 'Croatia', flag: '🇭🇷', leagues: ['1. HNL', '2. HNL', 'Croatian Cup'] },
    { id: 'serbia', name: 'Serbia', flag: '🇷🇸', leagues: ['SuperLiga', 'Prva Liga', 'Serbian Cup'] },
    { id: 'romania', name: 'Romania', flag: '🇷🇴', leagues: ['Liga I', 'Liga II', 'Romanian Cup'] },
    { id: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬', leagues: ['First League', 'Second League', 'Bulgarian Cup'] },
    { id: 'israel', name: 'Israel', flag: '🇮🇱', leagues: ['Premier League', 'Liga Leumit', 'State Cup'] },
    { id: 'saudi_arabia', name: 'Saudi Arabia', flag: '🇸🇦', leagues: ['Pro League', 'First Division', 'Kings Cup'] },
    { id: 'uae', name: 'UAE', flag: '🇦🇪', leagues: ['Pro League', 'First Division', 'UAE Cup'] },
    { id: 'qatar', name: 'Qatar', flag: '🇶🇦', leagues: ['Stars League', 'Second Division', 'Emir Cup'] },
    { id: 'egypt', name: 'Egypt', flag: '🇪🇬', leagues: ['Premier League', 'Second Division', 'Egypt Cup'] },
    { id: 'morocco', name: 'Morocco', flag: '🇲🇦', leagues: ['Botola Pro', 'Botola 2', 'Throne Cup'] },
    { id: 'south_africa', name: 'South Africa', flag: '🇿🇦', leagues: ['PSL', 'GladAfrica Championship', 'Nedbank Cup'] },
    { id: 'ghana', name: 'Ghana', flag: '🇬🇭', leagues: ['Premier League', 'Division One', 'FA Cup'] },
    { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', leagues: ['NPFL', 'NNL', 'Federation Cup'] },
    { id: 'colombia', name: 'Colombia', flag: '🇨🇴', leagues: ['Categoría Primera A', 'Categoría Primera B', 'Copa Colombia'] },
    { id: 'chile', name: 'Chile', flag: '🇨🇱', leagues: ['Primera División', 'Primera B', 'Copa Chile'] },
    { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', leagues: ['Primera División', 'Segunda División', 'Copa Uruguay'] },
    { id: 'peru', name: 'Peru', flag: '🇵🇪', leagues: ['Liga 1', 'Liga 2', 'Copa Perú'] },
    { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', leagues: ['Serie A', 'Serie B', 'Copa Ecuador'] },
    { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', leagues: ['Primera División', 'Segunda División', 'Copa Venezuela'] },
    { id: 'canada', name: 'Canada', flag: '🇨🇦', leagues: ['CPL', 'NHL', 'CFL'] },
    { id: 'india', name: 'India', flag: '🇮🇳', leagues: ['ISL', 'I-League', 'Durand Cup'] },
    { id: 'thailand', name: 'Thailand', flag: '🇹🇭', leagues: ['Thai League 1', 'Thai League 2', 'FA Cup'] },
    { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', leagues: ['Super League', 'Premier League', 'FA Cup'] },
    { id: 'singapore', name: 'Singapore', flag: '🇸🇬', leagues: ['Premier League', 'League Cup', 'FA Cup'] },
    { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', leagues: ['Liga 1', 'Liga 2', 'Piala Indonesia'] },
    { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', leagues: ['V.League 1', 'V.League 2', 'National Cup'] }
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