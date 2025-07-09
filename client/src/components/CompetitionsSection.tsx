import { useState } from 'react';

interface CompetitionsSectionProps {
  sport: string;
  selectedDate: string;
}

// Comprehensive football competitions data based on API Sports structure
const footballCompetitions = [
  {
    country: "Albania",
    flag: "🇦🇱",
    leagues: [
      "1st Division",
      "2nd Division - Group A", 
      "2nd Division - Group B",
      "2nd Division - Play-offs",
      "Cup",
      "Super Cup",
      "Superliga"
    ]
  },
  {
    country: "Algeria",
    flag: "🇩🇿",
    leagues: [
      "Coupe de la Ligue",
      "Coupe Nationale",
      "Ligue 1",
      "Ligue 2",
      "Super Cup",
      "U21 League 1"
    ]
  },
  {
    country: "Andorra",
    flag: "🇦🇩",
    leagues: [
      "1a Divisió",
      "2a Divisió",
      "Copa Constitució",
      "Super Cup"
    ]
  },
  {
    country: "Argentina",
    flag: "🇦🇷",
    leagues: [
      "Primera División",
      "Primera Nacional",
      "Copa Argentina",
      "Copa de la Liga",
      "Supercopa Argentina",
      "Primera B",
      "Primera C",
      "Primera D"
    ]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    leagues: [
      "A-League",
      "NPL",
      "FFA Cup",
      "Australia Cup",
      "Queensland Premier League",
      "NSW Premier League"
    ]
  },
  {
    country: "Austria",
    flag: "🇦🇹",
    leagues: [
      "Bundesliga",
      "2. Liga",
      "ÖFB Cup",
      "Supercup",
      "Regional Liga East",
      "Regional Liga Central",
      "Regional Liga West"
    ]
  },
  {
    country: "Belgium",
    flag: "🇧🇪",
    leagues: [
      "Pro League",
      "Challenger Pro League",
      "Belgian Cup",
      "Super Cup",
      "First Amateur Division",
      "Second Amateur Division"
    ]
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    leagues: [
      "Série A",
      "Série B",
      "Série C",
      "Série D",
      "Copa do Brasil",
      "Supercopa do Brasil",
      "Copa Verde",
      "Copa do Nordeste",
      "Campeonato Paulista",
      "Campeonato Carioca",
      "Campeonato Mineiro",
      "Campeonato Gaúcho"
    ]
  },
  {
    country: "Croatia",
    flag: "🇭🇷",
    leagues: [
      "1. HNL",
      "2. HNL",
      "Croatian Cup",
      "Super Cup",
      "3. HNL - Center",
      "3. HNL - East",
      "3. HNL - North",
      "3. HNL - South",
      "3. HNL - West"
    ]
  },
  {
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    leagues: [
      "Premier League",
      "Championship",
      "League One",
      "League Two",
      "FA Cup",
      "EFL Cup",
      "Community Shield",
      "National League",
      "National League North",
      "National League South",
      "FA Trophy",
      "FA Vase"
    ]
  },
  {
    country: "France",
    flag: "🇫🇷",
    leagues: [
      "Ligue 1",
      "Ligue 2",
      "Coupe de France",
      "Coupe de la Ligue",
      "Trophée des Champions",
      "National",
      "National 2",
      "National 3"
    ]
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    leagues: [
      "Bundesliga",
      "2. Bundesliga",
      "3. Liga",
      "DFB-Pokal",
      "DFL-Supercup",
      "Regionalliga",
      "Oberliga"
    ]
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    leagues: [
      "Serie A",
      "Serie B",
      "Serie C",
      "Serie D",
      "Coppa Italia",
      "Supercoppa Italiana",
      "Primavera 1",
      "Primavera 2"
    ]
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    leagues: [
      "Eredivisie",
      "Eerste Divisie",
      "KNVB Cup",
      "Johan Cruyff Shield",
      "Tweede Divisie",
      "Derde Divisie"
    ]
  },
  {
    country: "Portugal",
    flag: "🇵🇹",
    leagues: [
      "Primeira Liga",
      "Segunda Liga",
      "Taça de Portugal",
      "Taça da Liga",
      "Supertaça",
      "Liga 3",
      "Campeonato de Portugal"
    ]
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    leagues: [
      "La Liga",
      "Segunda División",
      "Copa del Rey",
      "Supercopa de España",
      "Primera Federación",
      "Segunda Federación",
      "Tercera Federación"
    ]
  },
  {
    country: "International",
    flag: "🌍",
    leagues: [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League",
      "FIFA World Cup",
      "UEFA European Championship",
      "UEFA Nations League",
      "CONMEBOL Copa Libertadores",
      "CONMEBOL Copa Sudamericana",
      "CONCACAF Champions League",
      "CAF Champions League",
      "AFC Champions League"
    ]
  }
];

const basketballCompetitions = [
  {
    country: "United States",
    flag: "🇺🇸",
    leagues: [
      "NBA",
      "WNBA",
      "NBA G League",
      "NCAA Division I",
      "NCAA Division II",
      "NCAA Division III"
    ]
  },
  {
    country: "Europe",
    flag: "🇪🇺",
    leagues: [
      "EuroLeague",
      "EuroCup",
      "Basketball Champions League",
      "FIBA Europe Cup"
    ]
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    leagues: [
      "Liga ACB",
      "LEB Oro",
      "LEB Plata",
      "Copa del Rey"
    ]
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    leagues: [
      "Greek Basket League",
      "Greek A2 League",
      "Greek Cup"
    ]
  }
];

const cricketCompetitions = [
  {
    country: "International",
    flag: "🌍",
    leagues: [
      "ICC World Cup",
      "ICC T20 World Cup",
      "ICC Champions Trophy",
      "Test Championship",
      "ODI Championship"
    ]
  },
  {
    country: "India",
    flag: "🇮🇳",
    leagues: [
      "Indian Premier League",
      "Ranji Trophy",
      "Vijay Hazare Trophy",
      "Syed Mushtaq Ali Trophy"
    ]
  },
  {
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    leagues: [
      "County Championship",
      "One-Day Cup",
      "T20 Blast",
      "The Hundred"
    ]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    leagues: [
      "Big Bash League",
      "Sheffield Shield",
      "One-Day Cup",
      "KFC T20 Max"
    ]
  }
];

const tennisCompetitions = [
  {
    country: "International",
    flag: "🌍",
    leagues: [
      "ATP Tour",
      "WTA Tour",
      "Grand Slam Events",
      "ATP Masters 1000",
      "WTA 1000",
      "ATP 500",
      "WTA 500",
      "ATP 250",
      "WTA 250",
      "ITF Men's World Tennis Tour",
      "ITF Women's World Tennis Tour"
    ]
  }
];

export function CompetitionsSection({ sport }: CompetitionsSectionProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  const getCompetitionsData = () => {
    switch (sport) {
      case 'football':
        return footballCompetitions;
      case 'basketball':
        return basketballCompetitions;
      case 'cricket':
        return cricketCompetitions;
      case 'tennis':
        return tennisCompetitions;
      default:
        return [];
    }
  };

  const competitions = getCompetitionsData();

  const toggleCountry = (countryName: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryName)) {
      newExpanded.delete(countryName);
    } else {
      newExpanded.add(countryName);
    }
    setExpandedCountries(newExpanded);
  };

  if (!competitions.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No competitions available for {sport}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {competitions.map((country) => (
        <div key={country.country}>
          {/* Country Header */}
          <div 
            onClick={() => toggleCountry(country.country)}
            className="flex items-center space-x-3 py-4 px-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-2xl">{country.flag}</span>
            <span className="font-semibold text-white text-lg">{country.country}</span>
          </div>

          {/* Leagues List */}
          {expandedCountries.has(country.country) && (
            <div className="bg-gray-900/30 ml-12 mr-4 mb-4 rounded-lg">
              {country.leagues.map((league, index) => (
                <div
                  key={index}
                  className="px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors cursor-pointer border-b border-gray-700/50 last:border-b-0"
                >
                  {league}
                </div>
              ))}
            </div>
          )}
          
          {/* Separator line except for last country */}
          {country !== competitions[competitions.length - 1] && (
            <div className="border-b border-gray-700/30"></div>
          )}
        </div>
      ))}
    </div>
  );
}