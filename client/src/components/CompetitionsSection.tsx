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
    country: "Angola",
    flag: "🇦🇴",
    leagues: [
      "Girabola"
    ]
  },
  {
    country: "Antigua-And-Barbuda",
    flag: "🇦🇬",
    leagues: [
      "Premier Division"
    ]
  },
  {
    country: "Argentina",
    flag: "🇦🇷",
    leagues: [
      "Copa Argentina",
      "Copa de la Liga Profesional",
      "Copa de la Superliga",
      "Liga Profesional Argentina",
      "Primera B Metropolitana",
      "Primera C",
      "Primera D",
      "Primera Nacional",
      "Reserve League",
      "Super Copa",
      "Super Copa Internacional",
      "Torneo Federal A",
      "Torneo Promocional Amateur",
      "Trofeo de Campeones de la Superliga"
    ]
  },
  {
    country: "Armenia",
    flag: "🇦🇲",
    leagues: [
      "Cup",
      "First League",
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Aruba",
    flag: "🇦🇼",
    leagues: [
      "Division di Honor"
    ]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    leagues: [
      "A-League",
      "A-League Women",
      "Australia Cup",
      "Brisbane Premier League",
      "Capital Territory NPL",
      "Capital Territory NPL 2",
      "New South Wales NPL",
      "New South Wales NPL 2",
      "NNSW League 1",
      "Northern NSW NPL",
      "Northern Territory Premier League",
      "Queensland NPL",
      "Queensland Premier League",
      "South Australia NPL",
      "South Australia State League 1",
      "Tasmania Northern Championship",
      "Tasmania NPL",
      "Tasmania Southern Championship",
      "Victoria NPL",
      "Victoria NPL 2",
      "Western Australia NPL",
      "Western Australia State League 1"
    ]
  },
  {
    country: "Austria",
    flag: "🇦🇹",
    leagues: [
      "2. Liga",
      "Bundesliga",
      "Cup",
      "Frauenliga",
      "Landesliga - Burgenland",
      "Landesliga - Karnten",
      "Landesliga - Niederosterreich",
      "Landesliga - Oberosterreich",
      "Landesliga - Salzburg",
      "Landesliga - Steiermark",
      "Landesliga - Tirol",
      "Landesliga - Vorarlbergliga",
      "Landesliga - Wien",
      "Regionalliga - Mitte",
      "Regionalliga - Ost",
      "Regionalliga - Salzburg",
      "Regionalliga - Tirol",
      "Regionalliga - West"
    ]
  },
  {
    country: "Azerbaijan",
    flag: "🇦🇿",
    leagues: [
      "Birinci Dasta",
      "Cup",
      "Premyer Liqa"
    ]
  },
  {
    country: "Bahrain",
    flag: "🇧🇭",
    leagues: [
      "Federation Cup",
      "King's Cup",
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Bangladesh",
    flag: "🇧🇩",
    leagues: [
      "Federation Cup",
      "Premier League"
    ]
  },
  {
    country: "Barbados",
    flag: "🇧🇧",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Belarus",
    flag: "🇧🇾",
    leagues: [
      "1. Division",
      "2. Division",
      "Coppa",
      "Premier League",
      "Reserve League",
      "Super Cup"
    ]
  },
  {
    country: "Belgium",
    flag: "🇧🇪",
    leagues: [
      "Challenger Pro League",
      "Cup",
      "First Amateur Division",
      "Jupiler Pro League",
      "Provincial - Antwerpen",
      "Provincial - Brabant ACFF",
      "Provincial - Brabant VFV",
      "Provincial - Hainaut",
      "Provincial - Liege",
      "Provincial - Limburg",
      "Provincial - Luxembourg",
      "Provincial - Namur",
      "Provincial - Oost-Vlaanderen",
      "Provincial - Play-offs ACFF",
      "Provincial - Play-offs VV",
      "Provincial - West-Vlaanderen",
      "Reserve Pro League",
      "Second Amateur Division - ACFF",
      "Second Amateur Division - Play-offs",
      "Second Amateur Division - VFV A",
      "Second Amateur Division - VFV B",
      "Super Cup",
      "Super League Women",
      "Third Amateur Division - ACFF A",
      "Third Amateur Division - ACFF B",
      "Third Amateur Division - Play-offs",
      "Third Amateur Division - VFV A",
      "Third Amateur Division - VFV B"
    ]
  },
  {
    country: "Belize",
    flag: "🇧🇿",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Benin",
    flag: "🇧🇯",
    leagues: [
      "Championnat National"
    ]
  },
  {
    country: "Bermuda",
    flag: "🇧🇲",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Bhutan",
    flag: "🇧🇹",
    leagues: [
      "Premier League",
      "Super League"
    ]
  },
  {
    country: "Bolivia",
    flag: "🇧🇴",
    leagues: [
      "Copa de la División Profesional",
      "Nacional B",
      "Primera División",
      "Torneo Amistoso de Verano"
    ]
  },
  {
    country: "Bosnia",
    flag: "🇧🇦",
    leagues: [
      "1st League - FBiH",
      "1st League - RS",
      "Cup",
      "Premijer Liga"
    ]
  },
  {
    country: "Botswana",
    flag: "🇧🇼",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    leagues: [
      "Acreano",
      "Alagoano",
      "Alagoano - 2",
      "Alagoano U20",
      "Amapaense",
      "Amazonense",
      "Amazonense - 2",
      "Baiano - 1",
      "Baiano - 2",
      "Baiano U20",
      "Brasileiro de Aspirantes",
      "Brasileiro U17",
      "Brasileiro U20 A",
      "Brasileiro U20 B",
      "Brasileiro Women",
      "Brasiliense",
      "Brasiliense B",
      "Brasiliense U20",
      "Capixaba",
      "Capixaba B",
      "Carioca - 1",
      "Carioca - 2",
      "Carioca A2",
      "Carioca B2",
      "Carioca C",
      "Carioca U20",
      "Catarinense - 1",
      "Catarinense - 2",
      "Catarinense - 3",
      "Catarinense U20",
      "Cearense - 1",
      "Cearense - 2",
      "Cearense - 3",
      "Cearense U20",
      "Copa Alagoas",
      "Copa Do Brasil",
      "Copa do Brasil U17",
      "Copa do Brasil U20",
      "Copa do Nordeste",
      "Copa Espirito Santo",
      "Copa Fares Lopes",
      "Copa Gaúcha",
      "Copa Grão Pará",
      "Copa Paulista"
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