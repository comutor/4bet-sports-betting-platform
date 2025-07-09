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
      "Copa Paulista",
      "Copa Rio",
      "Copa Rio U20",
      "Copa Santa Catarina",
      "Copa Verde",
      "Estadual Junior U20",
      "Gaúcho - 1",
      "Gaúcho - 2",
      "Gaúcho - 3",
      "Goiano - 1",
      "Goiano - 2",
      "Goiano - 3",
      "Goiano U20",
      "Maranhense",
      "Maranhense - 2",
      "Matogrossense",
      "Matogrossense 2",
      "Mineiro - 1",
      "Mineiro - 2",
      "Mineiro - 3",
      "Mineiro U20",
      "Paraense",
      "Paraense B1",
      "Paraense B2",
      "Paraense U20",
      "Paraibano",
      "Paraibano 2",
      "Paraibano U20",
      "Paranaense - 1",
      "Paranaense - 2",
      "Paranaense - 3",
      "Paranaense U20",
      "Paulista - A1",
      "Paulista - A2",
      "Paulista - A3",
      "Paulista - A4",
      "Paulista - U20",
      "Paulista Série B",
      "Pernambucano - 1",
      "Pernambucano - 2",
      "Pernambucano - 3",
      "Pernambucano - U20",
      "Piauiense",
      "Potiguar",
      "Potiguar - 2",
      "Potiguar - U20",
      "Recopa Catarinense",
      "Rondoniense",
      "Roraimense",
      "São Paulo Youth Cup",
      "Sergipano",
      "Sergipano - 2",
      "Sergipano U20",
      "Serie A",
      "Serie B",
      "Serie C",
      "Serie D",
      "Sul-Matogrossense",
      "Supercopa do Brasil",
      "Tocantinense"
    ]
  },
  {
    country: "Bulgaria",
    flag: "🇧🇬",
    leagues: [
      "Cup",
      "First League",
      "Second League",
      "Super Cup",
      "Third League - Northeast",
      "Third League - Northwest",
      "Third League - Southeast",
      "Third League - Southwest"
    ]
  },
  {
    country: "Burkina-Faso",
    flag: "🇧🇫",
    leagues: [
      "Ligue 1"
    ]
  },
  {
    country: "Burundi",
    flag: "🇧🇮",
    leagues: [
      "Ligue A"
    ]
  },
  {
    country: "Cambodia",
    flag: "🇰🇭",
    leagues: [
      "C-League",
      "Hun Sen Cup"
    ]
  },
  {
    country: "Cameroon",
    flag: "🇨🇲",
    leagues: [
      "Elite One",
      "Elite Two",
      "Super Cup"
    ]
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    leagues: [
      "Canadian Championship",
      "Canadian Premier League",
      "Canadian Soccer League",
      "League 1 Ontario",
      "Northern Super League",
      "Pacific Coast Soccer League"
    ]
  },
  {
    country: "Chile",
    flag: "🇨🇱",
    leagues: [
      "Copa Chile",
      "Primera B",
      "Primera División",
      "Segunda División",
      "Super Cup"
    ]
  },
  {
    country: "China",
    flag: "🇨🇳",
    leagues: [
      "FA Cup",
      "League One",
      "League Two",
      "Super Cup",
      "Super League"
    ]
  },
  {
    country: "Chinese-Taipei",
    flag: "🇹🇼",
    leagues: [
      "Taiwan Football Premier League"
    ]
  },
  {
    country: "Colombia",
    flag: "🇨🇴",
    leagues: [
      "Copa Colombia",
      "Liga Femenina",
      "Primera A",
      "Primera B",
      "Superliga"
    ]
  },
  {
    country: "Congo",
    flag: "🇨🇬",
    leagues: [
      "Ligue 1"
    ]
  },
  {
    country: "Congo-DR",
    flag: "🇨🇩",
    leagues: [
      "Ligue 1"
    ]
  },
  {
    country: "Costa-Rica",
    flag: "🇨🇷",
    leagues: [
      "Copa Costa Rica",
      "Liga de Ascenso",
      "Primera División",
      "Recopa",
      "Supercopa"
    ]
  },
  {
    country: "Crimea",
    flag: "🇺🇦",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Croatia",
    flag: "🇭🇷",
    leagues: [
      "Cup",
      "First NL",
      "HNL",
      "Second NL",
      "Super Cup",
      "Third NL - Istok",
      "Third NL - Jug",
      "Third NL - Sjever",
      "Third NL - Sredite",
      "Third NL - Zapad"
    ]
  },
  {
    country: "Cuba",
    flag: "🇨🇺",
    leagues: [
      "Primera División"
    ]
  },
  {
    country: "Curacao",
    flag: "🇨🇼",
    leagues: [
      "Curaçao Sekshon Pagá"
    ]
  },
  {
    country: "Cyprus",
    flag: "🇨🇾",
    leagues: [
      "1. Division",
      "2. Division",
      "3. Division",
      "Cup",
      "Super Cup"
    ]
  },
  {
    country: "Czech-Republic",
    flag: "🇨🇿",
    leagues: [
      "1. Liga U19",
      "1. Liga Women",
      "3. liga - CFL A",
      "3. liga - CFL B",
      "3. liga - MSFL",
      "3. liga - Promotion Play-off",
      "4. liga - Divizie A",
      "4. liga - Divizie B",
      "4. liga - Divizie C",
      "4. liga - Divizie D",
      "4. liga - Divizie E",
      "4. liga - Divizie F",
      "Cup",
      "Czech Liga",
      "FNL",
      "Super Cup"
    ]
  },
  {
    country: "Denmark",
    flag: "🇩🇰",
    leagues: [
      "1. Division",
      "2. Division",
      "2nd Division - Group 2",
      "3. Division",
      "DBU Pokalen",
      "Denmark Series - Group 1",
      "Denmark Series - Group 2",
      "Denmark Series - Group 3",
      "Denmark Series - Group 4",
      "Denmark Series - Promotion Round",
      "Denmark Series - Relegation Round",
      "Kvindeliga",
      "Superliga"
    ]
  },
  {
    country: "Dominican-Republic",
    flag: "🇩🇴",
    leagues: [
      "Copa LDF",
      "Liga Mayor"
    ]
  },
  {
    country: "Ecuador",
    flag: "🇪🇨",
    leagues: [
      "Copa Ecuador",
      "Liga Pro",
      "Liga Pro Serie B",
      "Supercopa de Ecuador"
    ]
  },
  {
    country: "Egypt",
    flag: "🇪🇬",
    leagues: [
      "Cup",
      "League Cup",
      "Premier League",
      "Second League",
      "Second League - Group B",
      "Second League - Group C",
      "Second League - Play-offs",
      "Super Cup"
    ]
  },
  {
    country: "El-Salvador",
    flag: "🇸🇻",
    leagues: [
      "Primera Division"
    ]
  },
  {
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    leagues: [
      "Championship",
      "Community Shield",
      "Community Shield Women",
      "EFL Trophy",
      "FA Cup",
      "FA Trophy",
      "FA Women's Cup",
      "FA WSL",
      "FA Youth Cup",
      "League Cup",
      "League One",
      "League Two",
      "National League",
      "National League - North",
      "National League - North - Play-offs",
      "National League - Play-offs",
      "National League - South",
      "National League - South - Play-offs",
      "National League Cup",
      "Non League Div One - Isthmian North",
      "Non League Div One - Isthmian South Central",
      "Non League Div One - Isthmian South East",
      "Non League Div One - Northern East",
      "Non League Div One - Northern Midlands",
      "Non League Div One - Northern West",
      "Non League Div One - Play-offs",
      "Non League Div One - Southern Central",
      "Non League Div One - Southern South",
      "Non League Premier - Isthmian",
      "Non League Premier - Isthmian - Play-offs",
      "Non League Premier - Northern",
      "Non League Premier - Northern - Play-offs",
      "Non League Premier - Southern Central",
      "Non League Premier - Southern Central - Play-offs",
      "Non League Premier - Southern South",
      "Non League Premier - Southern South - Play-offs",
      "Premier League",
      "Premier League - Summer Series",
      "Premier League 2 Division One",
      "Premier League Cup",
      "Professional Development League",
      "U18 Premier League - Championship",
      "U18 Premier League - North",
      "U18 Premier League - South",
      "Women's Championship",
      "WSL Cup"
    ]
  },
  {
    country: "Estonia",
    flag: "🇪🇪",
    leagues: [
      "Cup",
      "Esiliiga A",
      "Esiliiga B",
      "Meistriliiga"
    ]
  },
  {
    country: "Eswatini",
    flag: "🇸🇿",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Ethiopia",
    flag: "🇪🇹",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Faroe-Islands",
    flag: "🇫🇴",
    leagues: [
      "1. Deild",
      "Løgmanssteypid",
      "Meistaradeildin",
      "Super Cup"
    ]
  },
  {
    country: "Fiji",
    flag: "🇫🇯",
    leagues: [
      "National Football League"
    ]
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    leagues: [
      "Kakkonen - Lohko A",
      "Kakkonen - Lohko B",
      "Kakkonen - Lohko C",
      "Kakkonen - Play-offs",
      "Kakkosen Cup",
      "Kansallinen Liiga",
      "League Cup",
      "Suomen Cup",
      "Veikkausliiga",
      "Ykkönen",
      "Ykkösscup",
      "Ykkösliiga"
    ]
  },
  {
    country: "France",
    flag: "🇫🇷",
    leagues: [
      "Coupe de France",
      "Coupe de la Ligue",
      "Feminine Division 1",
      "Ligue 1",
      "Ligue 2",
      "National 1",
      "National 2 - Group A",
      "National 2 - Group B",
      "National 2 - Group C",
      "National 2 - Group D",
      "National 3 - Group A",
      "National 3 - Group B",
      "National 3 - Group C",
      "National 3 - Group D",
      "National 3 - Group E",
      "National 3 - Group F",
      "National 3 - Group G",
      "National 3 - Group H",
      "National 3 - Group I",
      "National 3 - Group J",
      "National 3 - Group K",
      "National 3 - Group L",
      "National 3 - Group M",
      "Trophée des Champions"
    ]
  },
  {
    country: "Gabon",
    flag: "🇬🇦",
    leagues: [
      "Championnat D1"
    ]
  },
  {
    country: "Gambia",
    flag: "🇬🇲",
    leagues: [
      "GFA League"
    ]
  },
  {
    country: "Georgia",
    flag: "🇬🇪",
    leagues: [
      "David Kipiani Cup",
      "Erovnuli Liga",
      "Erovnuli Liga 2",
      "Liga 3",
      "Super Cup"
    ]
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    leagues: [
      "2. Bundesliga",
      "2. Frauen Bundesliga",
      "3. Liga",
      "Bundesliga",
      "DFB Junioren Pokal",
      "DFB Pokal",
      "DFB Pokal - Women",
      "Frauen Bundesliga",
      "Oberliga - Baden-Württemberg",
      "Oberliga - Bayern Nord",
      "Oberliga - Bayern Süd",
      "Oberliga - Bremen",
      "Oberliga - Hamburg",
      "Oberliga - Hessen",
      "Oberliga - Mittelrhein",
      "Oberliga - Niederrhein",
      "Oberliga - Niedersachsen",
      "Oberliga - Nordost-Nord",
      "Oberliga - Nordost-Süd",
      "Oberliga - Promotion Round",
      "Oberliga - Relegation Round",
      "Oberliga - Rheinland-Pfalz / Saar",
      "Oberliga - Schleswig-Holstein",
      "Oberliga - Westfalen",
      "Regionalliga - Bayern",
      "Regionalliga - Nord",
      "Regionalliga - Nordost",
      "Regionalliga - Promotion Play-offs",
      "Regionalliga - Relegation Round",
      "Regionalliga - SudWest",
      "Regionalliga - West",
      "Super Cup",
      "Supercup der Frauen",
      "U19 Bundesliga"
    ]
  },
  {
    country: "Ghana",
    flag: "🇬🇭",
    leagues: [
      "Cup",
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Gibraltar",
    flag: "🇬🇮",
    leagues: [
      "Premier Division",
      "Rock Cup",
      "Super Cup"
    ]
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    leagues: [
      "Cup",
      "Football League",
      "Gamma Ethniki - Group 1",
      "Gamma Ethniki - Group 2",
      "Gamma Ethniki - Group 3",
      "Gamma Ethniki - Group 4",
      "Gamma Ethniki - Group 5",
      "Gamma Ethniki - Group 6",
      "Gamma Ethniki - Group 7",
      "Gamma Ethniki - Group 8",
      "Gamma Ethniki - Group 9",
      "Gamma Ethniki - Group 10",
      "Gamma Ethniki - Promotion Group",
      "Gamma Ethniki - Relegation Play-offs",
      "Super League 1",
      "Super League 2"
    ]
  },
  {
    country: "Grenada",
    flag: "🇬🇩",
    leagues: [
      "Premier Division"
    ]
  },
  {
    country: "Guadeloupe",
    flag: "🇬🇵",
    leagues: [
      "Division d'Honneur"
    ]
  },
  {
    country: "Guatemala",
    flag: "🇬🇹",
    leagues: [
      "Liga Nacional",
      "Primera Division"
    ]
  },
  {
    country: "Guinea",
    flag: "🇬🇳",
    leagues: [
      "Ligue 1"
    ]
  },
  {
    country: "Haiti",
    flag: "🇭🇹",
    leagues: [
      "Ligue Haïtienne"
    ]
  },
  {
    country: "Honduras",
    flag: "🇭🇳",
    leagues: [
      "Liga Nacional"
    ]
  },
  {
    country: "Hong-Kong",
    flag: "🇭🇰",
    leagues: [
      "FA Cup",
      "HKFA 1st Division",
      "HKPL Cup",
      "Premier League",
      "Sapling Cup",
      "Senior Shield"
    ]
  },
  {
    country: "Hungary",
    flag: "🇭🇺",
    leagues: [
      "Magyar Kupa",
      "NB I",
      "NB II",
      "NB III - Northeast",
      "NB III - Northwest",
      "NB III - Promotion Play-offs",
      "NB III - Southeast",
      "NB III - Southwest"
    ]
  },
  {
    country: "Iceland",
    flag: "🇮🇸",
    leagues: [
      "1. Deild",
      "2. Deild",
      "Cup",
      "Fotbolti.net Cup A",
      "League Cup",
      "Reykjavik Cup",
      "Super Cup",
      "Úrvalsdeild",
      "Úrvalsdeild Women"
    ]
  },
  {
    country: "India",
    flag: "🇮🇳",
    leagues: [
      "AIFF Super Cup",
      "Calcutta Premier Division",
      "I-League",
      "I-League - 2nd Division",
      "Indian Super League",
      "Santosh Trophy"
    ]
  },
  {
    country: "Indonesia",
    flag: "🇮🇩",
    leagues: [
      "Liga 1",
      "Liga 2",
      "Piala Indonesia",
      "Piala Presiden"
    ]
  },
  {
    country: "Iran",
    flag: "🇮🇷",
    leagues: [
      "Azadegan League",
      "Hazfi Cup",
      "Persian Gulf Pro League",
      "Super Cup"
    ]
  },
  {
    country: "Iraq",
    flag: "🇮🇶",
    leagues: [
      "Iraqi League"
    ]
  },
  {
    country: "Ireland",
    flag: "🇮🇪",
    leagues: [
      "FAI Cup",
      "FAI President's Cup",
      "First Division",
      "League Cup",
      "Premier Division",
      "Women's President's Cup"
    ]
  },
  {
    country: "Israel",
    flag: "🇮🇱",
    leagues: [
      "Liga Alef",
      "Liga Leumit",
      "Ligat Ha'al",
      "State Cup",
      "Super Cup",
      "Toto Cup Ligat Al"
    ]
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    leagues: [
      "Campionato Primavera - 1",
      "Campionato Primavera - 2",
      "Coppa Italia",
      "Coppa Italia Primavera",
      "Coppa Italia Serie C",
      "Coppa Italia Serie D",
      "Coppa Italia Women",
      "Serie A",
      "Serie A Women",
      "Serie B",
      "Serie C",
      "Serie C - Girone B",
      "Serie C - Girone C",
      "Serie C - Promotion - Play-offs",
      "Serie C - Relegation - Play-offs",
      "Serie C - Supercoppa Lega Finals",
      "Serie D - Championship Round",
      "Serie D - Girone A",
      "Serie D - Girone B",
      "Serie D - Girone C",
      "Serie D - Girone D",
      "Serie D - Girone E",
      "Serie D - Girone F",
      "Serie D - Girone G",
      "Serie D - Girone H",
      "Serie D - Girone I",
      "Serie D - Promotion - Play-offs",
      "Serie D - Relegation - Play-offs",
      "Super Cup",
      "Super Cup Primavera"
    ]
  },
  {
    country: "Ivory-Coast",
    flag: "🇨🇮",
    leagues: [
      "Ligue 1"
    ]
  },
  {
    country: "Jamaica",
    flag: "🇯🇲",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    leagues: [
      "Emperor Cup",
      "J-League Cup",
      "J1 League",
      "J2 League",
      "J3 League",
      "Japan Football League",
      "Super Cup",
      "WE League"
    ]
  },
  {
    country: "Jordan",
    flag: "🇯🇴",
    leagues: [
      "Cup",
      "League",
      "Shield Cup",
      "Super Cup"
    ]
  },
  {
    country: "Kazakhstan",
    flag: "🇰🇿",
    leagues: [
      "1. Division",
      "Cup",
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Kenya",
    flag: "🇰🇪",
    leagues: [
      "FKF Premier League",
      "Shield Cup",
      "Super League"
    ]
  },
  {
    country: "Kosovo",
    flag: "🇽🇰",
    leagues: [
      "Cup",
      "Super Cup",
      "Superliga"
    ]
  },
  {
    country: "Kuwait",
    flag: "🇰🇼",
    leagues: [
      "Crown Prince Cup",
      "Division 1",
      "Emir Cup",
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Kyrgyzstan",
    flag: "🇰🇬",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Laos",
    flag: "🇱🇦",
    leagues: [
      "Lao League"
    ]
  },
  {
    country: "Latvia",
    flag: "🇱🇻",
    leagues: [
      "1. Liga",
      "Cup",
      "Super Cup",
      "Virsliga"
    ]
  },
  {
    country: "Lebanon",
    flag: "🇱🇧",
    leagues: [
      "Cup",
      "Federation Cup",
      "Premier League"
    ]
  },
  {
    country: "Lesotho",
    flag: "🇱🇸",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Liberia",
    flag: "🇱🇷",
    leagues: [
      "LFA First Division"
    ]
  },
  {
    country: "Libya",
    flag: "🇱🇾",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Liechtenstein",
    flag: "🇱🇮",
    leagues: [
      "Cup"
    ]
  },
  {
    country: "Lithuania",
    flag: "🇱🇹",
    leagues: [
      "1 Lyga",
      "A Lyga",
      "Cup",
      "Super Cup"
    ]
  },
  {
    country: "Luxembourg",
    flag: "🇱🇺",
    leagues: [
      "Cup",
      "National Division"
    ]
  },
  {
    country: "Macao",
    flag: "🇲🇴",
    leagues: [
      "Primeira Divisão"
    ]
  },
  {
    country: "Macedonia",
    flag: "🇲🇰",
    leagues: [
      "Cup",
      "First League",
      "Second League"
    ]
  },
  {
    country: "Malawi",
    flag: "🇲🇼",
    leagues: [
      "Super League"
    ]
  },
  {
    country: "Malaysia",
    flag: "🇲🇾",
    leagues: [
      "FA Cup",
      "Malaysia Cup",
      "MFL Cup",
      "Premier League",
      "Super League"
    ]
  },
  {
    country: "Maldives",
    flag: "🇲🇻",
    leagues: [
      "Dhivehi Premier League"
    ]
  },
  {
    country: "Mali",
    flag: "🇲🇱",
    leagues: [
      "Première Division"
    ]
  },
  {
    country: "Malta",
    flag: "🇲🇹",
    leagues: [
      "Challenge Cup",
      "Challenge League",
      "FA Trophy",
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Mauritania",
    flag: "🇲🇷",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Mauritius",
    flag: "🇲🇺",
    leagues: [
      "Mauritian League"
    ]
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    leagues: [
      "Campeón de Campeones",
      "Copa MX",
      "Copa por México",
      "Liga de Expansión MX",
      "Liga MX",
      "Liga MX Femenil",
      "Liga Premier Serie A",
      "Liga Premier Serie B",
      "U20 League",
      "U23 League"
    ]
  },
  {
    country: "Moldova",
    flag: "🇲🇩",
    leagues: [
      "Cupa",
      "Liga 1",
      "Super Liga"
    ]
  },
  {
    country: "Mongolia",
    flag: "🇲🇳",
    leagues: [
      "Premier League",
      "Super Cup"
    ]
  },
  {
    country: "Montenegro",
    flag: "🇲🇪",
    leagues: [
      "Cup",
      "First League",
      "Second League"
    ]
  },
  {
    country: "Morocco",
    flag: "🇲🇦",
    leagues: [
      "Botola 2",
      "Botola Pro",
      "Cup"
    ]
  },
  {
    country: "Myanmar",
    flag: "🇲🇲",
    leagues: [
      "National League"
    ]
  },
  {
    country: "Namibia",
    flag: "🇳🇦",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Nepal",
    flag: "🇳🇵",
    leagues: [
      "A Division"
    ]
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    leagues: [
      "Derde Divisie - Relegation Round",
      "Derde Divisie - Saturday",
      "Derde Divisie - Sunday",
      "Eerste Divisie",
      "Eredivisie",
      "Eredivisie Women",
      "KNVB Beker",
      "Reserve League",
      "Super Cup",
      "Tweede Divisie",
      "U18 Divisie 1",
      "U19 Divisie 1",
      "U21 Divisie 1"
    ]
  },
  {
    country: "New-Zealand",
    flag: "🇳🇿",
    leagues: [
      "Chatham Cup",
      "National League - Central",
      "National League - Championship - Final",
      "National League - National",
      "National League - Northern",
      "National League - Southern",
      "Premiership"
    ]
  },
  {
    country: "Nicaragua",
    flag: "🇳🇮",
    leagues: [
      "Copa Nicaragua",
      "Liga Primera U20",
      "Primera Division"
    ]
  },
  {
    country: "Nigeria",
    flag: "🇳🇬",
    leagues: [
      "NPFL"
    ]
  },
  {
    country: "Northern-Ireland",
    flag: "🇬🇧",
    leagues: [
      "Championship",
      "Charity Shield",
      "Irish Cup",
      "League Cup",
      "Premier Intermediate League",
      "Premiership",
      "Premiership Women"
    ]
  },
  {
    country: "Norway",
    flag: "🇳🇴",
    leagues: [
      "1. Division",
      "1. Division Women",
      "2. Division - Group 1",
      "2. Division - Group 2",
      "2. Division - Play-offs",
      "3. Division - Girone 1",
      "3. Division - Girone 2",
      "3. Division - Girone 3",
      "3. Division - Girone 4",
      "3. Division - Girone 5",
      "3. Division - Girone 6",
      "Eliteserien",
      "Nasjonal U19 Champions League",
      "NM Cupen",
      "Super Cup",
      "Toppserien"
    ]
  },
  {
    country: "Oman",
    flag: "🇴🇲",
    leagues: [
      "Professional League",
      "Sultan Cup",
      "Super Cup"
    ]
  },
  {
    country: "Pakistan",
    flag: "🇵🇰",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Palestine",
    flag: "🇵🇸",
    leagues: [
      "West Bank Premier League"
    ]
  },
  {
    country: "Panama",
    flag: "🇵🇦",
    leagues: [
      "Liga Panameña de Fútbol"
    ]
  },
  {
    country: "Paraguay",
    flag: "🇵🇾",
    leagues: [
      "Copa Paraguay",
      "Division Intermedia",
      "Division Profesional - Apertura",
      "Division Profesional - Clausura",
      "Supercopa"
    ]
  },
  {
    country: "Peru",
    flag: "🇵🇪",
    leagues: [
      "Copa Bicentenario",
      "Copa Perú",
      "Primera División",
      "Segunda División",
      "Supercopa"
    ]
  },
  {
    country: "Philippines",
    flag: "🇵🇭",
    leagues: [
      "Copa Paulino Alcantara",
      "PFL"
    ]
  },
  {
    country: "Poland",
    flag: "🇵🇱",
    leagues: [
      "Central Youth League",
      "Cup",
      "Ekstraklasa",
      "Ekstraliga Women",
      "I Liga",
      "II Liga - East",
      "III Liga - Group 1",
      "III Liga - Group 2",
      "III Liga - Group 3",
      "III Liga - Group 4",
      "Super Cup"
    ]
  },
  {
    country: "Portugal",
    flag: "🇵🇹",
    leagues: [
      "1a Divisão - Women",
      "Campeonato de Portugal Prio - Group A",
      "Campeonato de Portugal Prio - Group B",
      "Campeonato de Portugal Prio - Group C",
      "Campeonato de Portugal Prio - Group D",
      "Campeonato de Portugal Prio - Group E",
      "Campeonato de Portugal Prio - Group F",
      "Campeonato de Portugal Prio - Group G",
      "Campeonato de Portugal Prio - Group H",
      "Campeonato de Portugal Prio - Promotion Round",
      "Júniores U19",
      "Liga 3",
      "Liga Revelação U23",
      "Primeira Liga",
      "Segunda Liga",
      "Super Cup",
      "Taça da Liga",
      "Taça de Portugal",
      "Taça Revelação U23"
    ]
  },
  {
    country: "Qatar",
    flag: "🇶🇦",
    leagues: [
      "Emir Cup",
      "Qatar Cup",
      "QFA Cup",
      "QSL Cup",
      "Second Division",
      "Stars League"
    ]
  },
  {
    country: "Romania",
    flag: "🇷🇴",
    leagues: [
      "Cupa României",
      "Liga 1 Feminin",
      "Liga I",
      "Liga II",
      "Liga III - Play-offs",
      "Liga III - Serie 1",
      "Liga III - Serie 10",
      "Liga III - Serie 2",
      "Liga III - Serie 3",
      "Liga III - Serie 4",
      "Liga III - Serie 5",
      "Liga III - Serie 6",
      "Liga III - Serie 7",
      "Liga III - Serie 8",
      "Liga III - Serie 9",
      "Supercupa"
    ]
  },
  {
    country: "Russia",
    flag: "🇷🇺",
    leagues: [
      "Cup",
      "First League",
      "Premier League",
      "Second League - Group 1",
      "Second League - Group 2",
      "Second League - Group 3",
      "Second League - Group 4",
      "Second League A - Fall Season Gold",
      "Second League A - Fall Season Silver",
      "Second League A - Promotion Play-offs",
      "Second League A - Spring Season Gold",
      "Second League A - Spring Season Silver",
      "Super Cup",
      "Supreme Division Women",
      "Youth Championship"
    ]
  },
  {
    country: "Rwanda",
    flag: "🇷🇼",
    leagues: [
      "National Soccer League"
    ]
  },
  {
    country: "San-Marino",
    flag: "🇸🇲",
    leagues: [
      "Campionato",
      "Coppa Titano",
      "Super Cup"
    ]
  },
  {
    country: "Saudi-Arabia",
    flag: "🇸🇦",
    leagues: [
      "Crown Prince Cup",
      "Division 1",
      "Division 2",
      "King's Cup",
      "Pro League",
      "Super Cup"
    ]
  },
  {
    country: "Scotland",
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    leagues: [
      "Challenge Cup",
      "Championship",
      "FA Cup",
      "Football League - Championship",
      "Football League - Highland League",
      "Football League - Lowland League",
      "League Cup",
      "League One",
      "League Two",
      "Premiership",
      "SWF Scottish Cup",
      "SWPL Cup"
    ]
  },
  {
    country: "Senegal",
    flag: "🇸🇳",
    leagues: [
      "Ligue 1"
    ]
  },
  {
    country: "Serbia",
    flag: "🇷🇸",
    leagues: [
      "Cup",
      "Prva Liga",
      "Srpska Liga - Belgrade",
      "Srpska Liga - East",
      "Srpska Liga - Vojvodina",
      "Srpska Liga - West",
      "Super Liga"
    ]
  },
  {
    country: "Singapore",
    flag: "🇸🇬",
    leagues: [
      "Cup",
      "League Cup",
      "Premier League"
    ]
  },
  {
    country: "Slovakia",
    flag: "🇸🇰",
    leagues: [
      "2. liga",
      "3. liga - Bratislava",
      "3. liga - Center",
      "3. liga - East",
      "3. liga - Play-offs",
      "3. liga - West",
      "Cup",
      "I Liga - Women",
      "Super Liga"
    ]
  },
  {
    country: "Slovenia",
    flag: "🇸🇮",
    leagues: [
      "1. SNL",
      "2. SNL",
      "3. SNL - East",
      "3. SNL - West",
      "Cup"
    ]
  },
  {
    country: "Somalia",
    flag: "🇸🇴",
    leagues: [
      "Somali Premier League"
    ]
  },
  {
    country: "South-Africa",
    flag: "🇿🇦",
    leagues: [
      "1st Division",
      "8 Cup",
      "Cup",
      "Diski Challenge",
      "Diski Shield",
      "League Cup",
      "Premier Soccer League"
    ]
  },
  {
    country: "South-Korea",
    flag: "🇰🇷",
    leagues: [
      "FA Cup",
      "K League 1",
      "K League 2",
      "K3 League",
      "WK-League"
    ]
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    leagues: [
      "Copa del Rey",
      "Copa Federacion",
      "La Liga",
      "Primera División Femenina",
      "Primera División RFEF - Group 1",
      "Primera División RFEF - Group 2",
      "Primera División RFEF - Group 3",
      "Primera División RFEF - Group 4",
      "Primera División RFEF - Group 5",
      "Primera División RFEF - Play Offs",
      "Segunda División",
      "Segunda División RFEF - Group 1",
      "Segunda División RFEF - Group 2",
      "Segunda División RFEF - Group 3",
      "Segunda División RFEF - Group 4",
      "Segunda División RFEF - Group 5",
      "Segunda División RFEF - Play-offs",
      "Super Cup",
      "Supercopa Femenina",
      "Tercera División RFEF - Group 1",
      "Tercera División RFEF - Group 10",
      "Tercera División RFEF - Group 11",
      "Tercera División RFEF - Group 12",
      "Tercera División RFEF - Group 13",
      "Tercera División RFEF - Group 14",
      "Tercera División RFEF - Group 15",
      "Tercera División RFEF - Group 16",
      "Tercera División RFEF - Group 17",
      "Tercera División RFEF - Group 18",
      "Tercera División RFEF - Group 2",
      "Tercera División RFEF - Group 3",
      "Tercera División RFEF - Group 4",
      "Tercera División RFEF - Group 5",
      "Tercera División RFEF - Group 6",
      "Tercera División RFEF - Group 7",
      "Tercera División RFEF - Group 8",
      "Tercera División RFEF - Group 9",
      "Tercera División RFEF - Promotion - Play-offs"
    ]
  },
  {
    country: "Sudan",
    flag: "🇸🇩",
    leagues: [
      "Sudani Premier League"
    ]
  },
  {
    country: "Suriname",
    flag: "🇸🇷",
    leagues: [
      "Eerste Divisie"
    ]
  },
  {
    country: "Sweden",
    flag: "🇸🇪",
    leagues: [
      "Allsvenskan",
      "Damallsvenskan",
      "Division 2 - Norra Götaland",
      "Division 2 - Norra Svealand",
      "Division 2 - Norrland",
      "Division 2 - Östra Götaland",
      "Division 2 - Play-offs",
      "Division 2 - Södra Svealand",
      "Division 2 - Västra Götaland",
      "Elitettan",
      "Ettan - Norra",
      "Ettan - Relegation Round",
      "Ettan - Södra",
      "Superettan",
      "Svenska Cupen",
      "Svenska Cupen - Women"
    ]
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    leagues: [
      "1. Liga Classic - Group 1",
      "1. Liga Classic - Group 2",
      "1. Liga Classic - Group 3",
      "1. Liga Classic - Play-offs",
      "1. Liga Promotion",
      "2. Liga Interregional - Group 1",
      "2. Liga Interregional - Group 2",
      "2. Liga Interregional - Group 3",
      "2. Liga Interregional - Group 4",
      "2. Liga Interregional - Group 5",
      "2. Liga Interregional - Group 6",
      "AXA Women's Super League",
      "Challenge League",
      "Erste Liga Cup",
      "Schweizer Cup",
      "Super League"
    ]
  },
  {
    country: "Syria",
    flag: "🇸🇾",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Tajikistan",
    flag: "🇹🇯",
    leagues: [
      "Vysshaya Liga"
    ]
  },
  {
    country: "Tanzania",
    flag: "🇹🇿",
    leagues: [
      "Ligi kuu Bara"
    ]
  },
  {
    country: "Thailand",
    flag: "🇹🇭",
    leagues: [
      "FA Cup",
      "League Cup",
      "Thai Champions Cup",
      "Thai League 1",
      "Thai League 2"
    ]
  },
  {
    country: "Togo",
    flag: "🇹🇬",
    leagues: [
      "Championnat National"
    ]
  },
  {
    country: "Trinidad-And-Tobago",
    flag: "🇹🇹",
    leagues: [
      "Pro League"
    ]
  },
  {
    country: "Tunisia",
    flag: "🇹🇳",
    leagues: [
      "Cup",
      "Ligue 1",
      "Ligue 2"
    ]
  },
  {
    country: "Turkey",
    flag: "🇹🇷",
    leagues: [
      "1. Lig",
      "2. Lig",
      "3. Lig - Group 1",
      "3. Lig - Group 2",
      "3. Lig - Group 3",
      "3. Lig - Group 4",
      "3. Lig - Play-offs",
      "Cup",
      "Super Cup",
      "Süper Lig"
    ]
  },
  {
    country: "Turkmenistan",
    flag: "🇹🇲",
    leagues: [
      "Yokary Liga",
      "Youth League"
    ]
  },
  {
    country: "Uganda",
    flag: "🇺🇬",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Ukraine",
    flag: "🇺🇦",
    leagues: [
      "Cup",
      "Druha Liga",
      "Druha Liga - Group B",
      "Persha Liga",
      "Premier League",
      "Super Cup",
      "U19 League",
      "U21 League"
    ]
  },
  {
    country: "United-Arab-Emirates",
    flag: "🇦🇪",
    leagues: [
      "Division 1",
      "League Cup",
      "Presidents Cup",
      "Pro League",
      "Super Cup"
    ]
  },
  {
    country: "Uruguay",
    flag: "🇺🇾",
    leagues: [
      "Copa Uruguay",
      "Primera División - Apertura",
      "Primera División - Clausura",
      "Segunda División",
      "Super Copa"
    ]
  },
  {
    country: "USA",
    flag: "🇺🇸",
    leagues: [
      "Major League Soccer",
      "MLS All-Star",
      "MLS Next Pro",
      "NISA",
      "NPSL",
      "NWSL - Liga MXF Summer Cup",
      "NWSL Women",
      "NWSL Women - Challenge Cup",
      "US Open Cup",
      "USL Championship",
      "USL League One",
      "USL League One Cup",
      "USL League Two",
      "USL Super League",
      "USL W League",
      "WPSL"
    ]
  },
  {
    country: "Uzbekistan",
    flag: "🇺🇿",
    leagues: [
      "Cup",
      "Pro League A",
      "Super Cup",
      "Super League"
    ]
  },
  {
    country: "Venezuela",
    flag: "🇻🇪",
    leagues: [
      "Copa Venezuela",
      "Primera División",
      "Segunda División",
      "Supercopa"
    ]
  },
  {
    country: "Vietnam",
    flag: "🇻🇳",
    leagues: [
      "Cup",
      "Super Cup",
      "V.League 1",
      "V.League 2"
    ]
  },
  {
    country: "Wales",
    flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    leagues: [
      "FAW Championship",
      "League Cup",
      "Premier League",
      "Welsh Cup"
    ]
  },
  {
    country: "World",
    flag: "🌍",
    leagues: [
      "AFC Challenge Cup",
      "AFC Challenge League",
      "AFC Champions League",
      "AFC Cup",
      "AFC U17 Asian Cup",
      "AFC U17 Asian Cup - Qualification",
      "AFC U17 Asian Cup - Women",
      "AFC U20 Asian Cup",
      "AFC U20 Asian Cup - Qualification",
      "AFC U20 Asian Cup - Women",
      "AFC U23 Asian Cup",
      "AFC U23 Asian Cup - Qualification",
      "AFC Women's Champions League",
      "AFF Championship",
      "AFF U19 Championship",
      "AFF U23 Championship",
      "Africa Cup of Nations",
      "Africa Cup of Nations - Qualification",
      "Africa Cup of Nations - Women",
      "Africa Cup of Nations U20",
      "Africa U23 Cup of Nations - Qualification",
      "African Football League",
      "African Nations Championship",
      "African Nations Championship - Qualification",
      "AGCFF Gulf Champions League",
      "Algarve Cup",
      "All Africa Games",
      "All-Island Cup - Women",
      "Arab Championship - U20",
      "Arab Club Champions Cup",
      "Arab Cup",
      "ASEAN Club Championship",
      "Asian Cup",
      "Asian Cup - Qualification",
      "Asian Cup Women",
      "Asian Cup Women - Qualification",
      "Asian Games",
      "Baltic Cup",
      "CAC Games",
      "CAF Champions League",
      "CAF Confederation Cup",
      "CAF Cup of Nations - U17",
      "CAF Super Cup",
      "CAF U23 Cup of Nations",
      "CAF Women's Champions League",
      "CAFA Nations Cup",
      "Campeones Cup",
      "Caribbean Cup",
      "CECAFA Club Cup",
      "CECAFA Senior Challenge Cup",
      "CECAFA U20 Championship",
      "China Cup",
      "CONCACAF Caribbean Club Championship",
      "CONCACAF Caribbean Club Shield",
      "Concacaf Central American Cup",
      "CONCACAF Champions League",
      "CONCACAF Gold Cup",
      "CONCACAF Gold Cup - Qualification",
      "CONCACAF Gold Cup - Qualification - Women",
      "CONCACAF Gold Cup - Women",
      "CONCACAF League",
      "CONCACAF Nations League",
      "CONCACAF Nations League - Qualification",
      "CONCACAF U17",
      "CONCACAF U20",
      "CONCACAF U20 - Qualification",
      "CONCACAF W Champions Cup",
      "CONCACAF Women U17",
      "CONCACAF Women U20",
      "Confederations Cup",
      "CONMEBOL - Pre-Olympic Tournament",
      "CONMEBOL - U17",
      "CONMEBOL - U17 Femenino",
      "CONMEBOL - UEFA Finalissima",
      "CONMEBOL Libertadores",
      "CONMEBOL Libertadores Femenina",
      "CONMEBOL Libertadores U20",
      "CONMEBOL Recopa",
      "CONMEBOL Sudamericana",
      "CONMEBOL U20 Femenino",
      "Copa America",
      "Copa America Femenina",
      "Copa Centroamericana",
      "COSAFA Cup",
      "COSAFA U20 Championship",
      "COTIF Tournament",
      "EAFF E-1 Football Championship",
      "EAFF E-1 Football Championship - Qualification",
      "Emirates Cup",
      "Euro Championship",
      "Euro Championship - Qualification",
      "FIFA Club World Cup",
      "FIFA Club World Cup - Play-In",
      "FIFA Intercontinental Cup",
      "Friendlies",
      "Friendlies Clubs",
      "Friendlies Women",
      "Gulf Cup of Nations",
      "International Champions Cup",
      "International Champions Cup - Women",
      "Islamic Solidarity Games",
      "King's Cup",
      "Kirin Cup",
      "Leagues Cup",
      "Mediterranean Games",
      "OFC Champions League",
      "OFC Nations Cup",
      "OFC U19 Championship",
      "Olympics - Intercontinental Play-offs",
      "Olympics Men",
      "Olympics Men - Qualification Concacaf",
      "Olympics Women",
      "Olympics Women - Qualification Asia",
      "Olympics Women - Qualification CAF",
      "Pacific Games",
      "Pan American Games",
      "Premier League Asia Trophy",
      "Premier League International Cup",
      "Qatar-UAE Super Cup",
      "SAFF Championship",
      "SheBelieves Cup",
      "South American Youth Games",
      "Southeast Asian Games",
      "Sudamericano U20",
      "The Atlantic Cup",
      "Tipsport Malta Cup",
      "Tournoi Maurice Revello",
      "U20 Elite League",
      "UAE-Qatar - Super Shield",
      "UEFA - CONMEBOL - Club Challenge",
      "UEFA Champions League",
      "UEFA Champions League Women",
      "UEFA Championship - Women",
      "UEFA Championship - Women - Qualification",
      "UEFA Europa Conference League",
      "UEFA Europa League",
      "UEFA Nations League",
      "UEFA Nations League - Women",
      "UEFA Super Cup",
      "UEFA U17 Championship",
      "UEFA U17 Championship - Qualification",
      "UEFA U17 Championship - Women",
      "UEFA U19 Championship",
      "UEFA U19 Championship - Qualification",
      "UEFA U19 Championship - Women",
      "UEFA U21 Championship",
      "UEFA U21 Championship - Qualification",
      "UEFA Youth League",
      "WAFF Championship U23",
      "World Cup",
      "World Cup - Qualification Africa",
      "World Cup - Qualification Asia",
      "World Cup - Qualification CONCACAF",
      "World Cup - Qualification Europe",
      "World Cup - Qualification Intercontinental Play-offs",
      "World Cup - Qualification Oceania",
      "World Cup - Qualification South America",
      "World Cup - U17",
      "World Cup - U17 - Women",
      "World Cup - U20",
      "World Cup - U20 - Women",
      "World Cup - Women",
      "World Cup - Women - Qualification Concacaf",
      "World Cup - Women - Qualification Europe",
      "Youth Viareggio Cup"
    ]
  },
  {
    country: "Yemen",
    flag: "🇾🇪",
    leagues: [
      "Yemeni League"
    ]
  },
  {
    country: "Zambia",
    flag: "🇿🇲",
    leagues: [
      "Super League"
    ]
  },
  {
    country: "Zimbabwe",
    flag: "🇿🇼",
    leagues: [
      "Premier Soccer League"
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
    country: "Africa",
    flag: "🌍",
    leagues: [
      "Africa Champions Cup",
      "Africa Champions Cup Women",
      "African Championship",
      "African Championship U16",
      "African Championship U16 Women",
      "African Championship U18",
      "African Championship U18 Women",
      "AfroBasket",
      "AfroBasket Women",
      "AfroCan",
      "BAL"
    ]
  },
  {
    country: "Albania",
    flag: "🇦🇱",
    leagues: [
      "Superliga"
    ]
  },
  {
    country: "Argentina",
    flag: "🇦🇷",
    leagues: [
      "Liga A",
      "Liga Femenina Women",
      "Super 4",
      "Super Cup",
      "Torneo Super 20"
    ]
  },
  {
    country: "Asia",
    flag: "🌏",
    leagues: [
      "ABL",
      "Asia Challenge",
      "Asia Champions Cup",
      "Asia Champions League",
      "Asia Championship U16",
      "Asia Championship U16 B Women",
      "Asia Championship U16 Women",
      "Asia Championship U18",
      "Asia Championship U18 B Women",
      "Asia Championship U18 Women",
      "Asia Cup",
      "Asia Cup Women",
      "Asian Games",
      "Asian Games Women",
      "EABA Championship",
      "EASL",
      "SEABA Championship",
      "SEABA Championship Women",
      "Southeast Asian Games",
      "Southeast Asian Games Women",
      "The Super 8",
      "WASL"
    ]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    leagues: [
      "NBL",
      "NBL 1",
      "NBL 1 W",
      "NBL W",
      "NBL1 Central",
      "NBL1 Central Women",
      "NBL1 East",
      "NBL1 East Women",
      "NBL1 North",
      "NBL1 North Women",
      "NBL1 South",
      "NBL1 South Women",
      "NBL1 West",
      "NBL1 West Women",
      "SEABL",
      "SEABL Women"
    ]
  },
  {
    country: "Austria",
    flag: "🇦🇹",
    leagues: [
      "ABL",
      "Austria Cup",
      "AWBL Women",
      "Super Cup",
      "Superliga",
      "Superliga Women",
      "Zweite Liga"
    ]
  },
  {
    country: "Bahrain",
    flag: "🇧🇭",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Belarus",
    flag: "🇧🇾",
    leagues: [
      "Premier League",
      "Premier League W"
    ]
  },
  {
    country: "Belgium",
    flag: "🇧🇪",
    leagues: [
      "Belgian Cup",
      "EuroMillions Basketball League",
      "Pro Basketball League",
      "Top Division Women"
    ]
  },
  {
    country: "Bolivia",
    flag: "🇧🇴",
    leagues: [
      "Libobasquet"
    ]
  },
  {
    country: "Bosnia-and-Herzegovina",
    flag: "🇧🇦",
    leagues: [
      "Prvenstvo BiH",
      "Prvenstvo BiH Women"
    ]
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    leagues: [
      "CBB",
      "LBF W",
      "LNB",
      "Super 8"
    ]
  },
  {
    country: "Bulgaria",
    flag: "🇧🇬",
    leagues: [
      "Bulgarian Cup",
      "NBL",
      "Super Cup"
    ]
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    leagues: [
      "CEBL",
      "CIS",
      "NBL",
      "Super League"
    ]
  },
  {
    country: "Chile",
    flag: "🇨🇱",
    leagues: [
      "Copa Chile",
      "Copa LNB",
      "DIMAYOR",
      "LNB",
      "LNB 2",
      "Supercopa"
    ]
  },
  {
    country: "China",
    flag: "🇨🇳",
    leagues: [
      "CBA",
      "WCBA Women"
    ]
  },
  {
    country: "Colombia",
    flag: "🇨🇴",
    leagues: [
      "LBP"
    ]
  },
  {
    country: "Croatia",
    flag: "🇭🇷",
    leagues: [
      "A1 Liga",
      "Croatian Cup",
      "Premijer Liga Women",
      "Prva Liga"
    ]
  },
  {
    country: "Cyprus",
    flag: "🇨🇾",
    leagues: [
      "Division A"
    ]
  },
  {
    country: "Czech Republic",
    flag: "🇨🇿",
    leagues: [
      "1. Liga",
      "Czech Cup",
      "Czech Cup Women",
      "NBL",
      "ZBL W"
    ]
  },
  {
    country: "Denmark",
    flag: "🇩🇰",
    leagues: [
      "Basketligaen",
      "Dameligaen W",
      "Denmark Cup",
      "Denmark Cup Women"
    ]
  },
  {
    country: "Dominican-Republic",
    flag: "🇩🇴",
    leagues: [
      "LNB"
    ]
  },
  {
    country: "Estonia",
    flag: "🇪🇪",
    leagues: [
      "Estonia Cup",
      "Korvpalli Meistriliiga"
    ]
  },
  {
    country: "Europe",
    flag: "🇪🇺",
    leagues: [
      "ABA League",
      "ABA League 2",
      "ABA Supercup",
      "Acropolis Tournament",
      "Alpe Adria Cup",
      "Baltic League",
      "Baltic League Cup",
      "Baltic League Women",
      "Beko Supercup",
      "BIBL",
      "BNXT League",
      "CEWL Women",
      "Champions League",
      "Czech-Slovak Cup",
      "ENBL",
      "EuroBasket",
      "EuroBasket B",
      "EuroBasket U16",
      "EuroBasket U16 B",
      "EuroBasket U16 C",
      "EuroBasket U18",
      "EuroBasket U18 B",
      "EuroBasket U18 C",
      "EuroBasket U20",
      "EuroBasket U20 B",
      "EuroChallenge",
      "Eurocup",
      "EuroCup Women",
      "Euroleague",
      "Euroleague Women",
      "European Challengers U16",
      "European Challengers U16 Women",
      "European Challengers U18",
      "European Challengers U18 Women",
      "European Challengers U20",
      "European Challengers U20 Women",
      "European Championship U16 B Women",
      "European Championship U16 C Women",
      "European Championship U16 Women",
      "European Championship U18 B Women",
      "European Championship U18 C Women",
      "European Championship U18 Women",
      "European Championship U20 B Women",
      "European Championship U20 Women",
      "European Championship Women",
      "EWBL Women",
      "Federal Cup",
      "Federal Cup Women",
      "FIBA Europe Cup",
      "Games of the Small States of Europe",
      "Games of the Small States of Europe Women",
      "Gomelsky Cup",
      "Latvia-Estonian League",
      "Liga Unike",
      "Liga Unike Women",
      "MZRKL Women",
      "Small Countries European Championship",
      "Small Countries European Championship Women",
      "SuperCup Women",
      "WBBL Women"
    ]
  },
  {
    country: "South-America",
    flag: "🌎",
    leagues: [
      "South American Championship",
      "South American Championship U17",
      "South American Championship U17 Women",
      "South American Championship U18",
      "South American Championship Women",
      "South American League"
    ]
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    leagues: [
      "I Divisioona A",
      "I Divisioona Women",
      "Korisliiga",
      "Korisliiga W",
      "Suomen Cup",
      "Suomen Cup Women"
    ]
  },
  {
    country: "France",
    flag: "🇫🇷",
    leagues: [
      "All Stars",
      "Betclic Elite",
      "Espoirs U21",
      "French Cup",
      "French Cup Women",
      "Leaders Cup",
      "LFB Super Cup Women",
      "LFB W",
      "Ligue 2 Women",
      "LNB",
      "LNB Super Cup",
      "Pro A",
      "Pro B"
    ]
  },
  {
    country: "Georgia",
    flag: "🇬🇪",
    leagues: [
      "Georgian Cup",
      "Superleague"
    ]
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    leagues: [
      "BBL",
      "DBBL Women",
      "German Cup",
      "Pro A",
      "Pro B",
      "Super Cup"
    ]
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    leagues: [
      "A1",
      "A1 Women",
      "A2",
      "A2 Women",
      "Basket League",
      "Greek Cup",
      "Greek Cup Women",
      "Super Cup"
    ]
  },
  {
    country: "Hungary",
    flag: "🇭🇺",
    leagues: [
      "Hungarian Cup",
      "Hungarian Cup Women",
      "NB I A",
      "NB I A W"
    ]
  },
  {
    country: "Iceland",
    flag: "🇮🇸",
    leagues: [
      "Icelandic Cup",
      "Premier league",
      "Premier League W"
    ]
  },
  {
    country: "Indonesia",
    flag: "🇮🇩",
    leagues: [
      "IBL"
    ]
  },
  {
    country: "Iran",
    flag: "🇮🇷",
    leagues: [
      "Super League"
    ]
  },
  {
    country: "Ireland",
    flag: "🇮🇪",
    leagues: [
      "Super League"
    ]
  },
  {
    country: "Israel",
    flag: "🇮🇱",
    leagues: [
      "Chance Cup",
      "Israel Cup",
      "Liga Leumit",
      "Super League",
      "WBL Women"
    ]
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    leagues: [
      "A2 - Play Offs",
      "A2 - Play Out",
      "A2 - West",
      "A2 East",
      "Coppa Italia Women",
      "Italian Cup",
      "Lega A",
      "Lega A - Super Cup",
      "Lega Basket Serie A",
      "Serie A1 W",
      "Serie A2",
      "Serie A2 Women - North",
      "Serie A2 Women - South",
      "Super Cup Women"
    ]
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    leagues: [
      "B League",
      "B2.League",
      "BJ League",
      "JBL League",
      "NBL",
      "W League Women"
    ]
  },
  {
    country: "Kazakhstan",
    flag: "🇰🇿",
    leagues: [
      "Championship Women",
      "Division I",
      "Higher League",
      "National League Women",
      "Premier League"
    ]
  },
  {
    country: "Kosovo",
    flag: "🇽🇰",
    leagues: [
      "Superliga",
      "Superliga Women"
    ]
  },
  {
    country: "Latvia",
    flag: "🇱🇻",
    leagues: [
      "Latvian Cup",
      "LBL"
    ]
  },
  {
    country: "Lebanon",
    flag: "🇱🇧",
    leagues: [
      "Division 1"
    ]
  },
  {
    country: "Lithuania",
    flag: "🇱🇹",
    leagues: [
      "King Mindaugas Cup",
      "LKF Cup",
      "LKL",
      "Moteru Lyga W",
      "NKL"
    ]
  },
  {
    country: "Luxembourg",
    flag: "🇱🇺",
    leagues: [
      "Total League",
      "Total League Women"
    ]
  },
  {
    country: "Macedonia",
    flag: "🇲🇰",
    leagues: [
      "Macedonian Cup",
      "Prva Liga",
      "Prva Liga Women",
      "Superleague"
    ]
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    leagues: [
      "CIBACOPA",
      "LMBPF Women",
      "LNBP"
    ]
  },
  {
    country: "Montenegro",
    flag: "🇲🇪",
    leagues: [
      "Montenegrin Cup",
      "Prva A Liga"
    ]
  },
  {
    country: "New Zealand",
    flag: "🇳🇿",
    leagues: [
      "NBL",
      "NBL Women",
      "Tauihi Women"
    ]
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    leagues: [
      "DBL",
      "DBL Cup",
      "NBB Cup",
      "Supercup",
      "WBL Women"
    ]
  },
  {
    country: "Norway",
    flag: "🇳🇴",
    leagues: [
      "BLNO",
      "Kvinneligaen W"
    ]
  },
  {
    country: "Paraguay",
    flag: "🇵🇾",
    leagues: [
      "LNB"
    ]
  },
  {
    country: "Philippines",
    flag: "🇵🇭",
    leagues: [
      "Commissioners Cup",
      "Fiesta Conference",
      "Governors Cup",
      "MPBL",
      "Philippine Cup"
    ]
  },
  {
    country: "Poland",
    flag: "🇵🇱",
    leagues: [
      "1 Liga",
      "Ekstraklasa Women",
      "Energa Basket Liga",
      "PBA Cup",
      "Polish Cup",
      "Polish Cup W",
      "Super Cup",
      "Super Cup Women"
    ]
  },
  {
    country: "Portugal",
    flag: "🇵🇹",
    leagues: [
      "LFB Women",
      "LPB",
      "Proliga",
      "Super Cup",
      "Super Cup Women",
      "Taca da Liga",
      "Taca de Portugal",
      "Taca de Portugal Women"
    ]
  },
  {
    country: "Puerto Rico",
    flag: "🇵🇷",
    leagues: [
      "BSN"
    ]
  },
  {
    country: "Qatar",
    flag: "🇶🇦",
    leagues: [
      "QBL"
    ]
  },
  {
    country: "Romania",
    flag: "🇷🇴",
    leagues: [
      "Divizia A",
      "Liga National W",
      "Romanian Cup",
      "Romanian Cup Women",
      "Super Cup"
    ]
  },
  {
    country: "Russia",
    flag: "🇷🇺",
    leagues: [
      "PBL",
      "Premier League W",
      "Russian Cup",
      "Russian Cup W",
      "Super League",
      "VTB Super Cup",
      "VTB United League"
    ]
  },
  {
    country: "Saudi Arabia",
    flag: "🇸🇦",
    leagues: [
      "Premier League"
    ]
  },
  {
    country: "Serbia",
    flag: "🇷🇸",
    leagues: [
      "1. ZLS Women",
      "First League",
      "Korac cup",
      "Super League"
    ]
  },
  {
    country: "Singapore",
    flag: "🇸🇬",
    leagues: [
      "NBL"
    ]
  },
  {
    country: "Slovakia",
    flag: "🇸🇰",
    leagues: [
      "Extraliga",
      "Extraliga W",
      "Slovakia Cup"
    ]
  },
  {
    country: "Slovenia",
    flag: "🇸🇮",
    leagues: [
      "1 SKL W",
      "Liga Nova KBM",
      "Slovenian Cup",
      "Supercup"
    ]
  },
  {
    country: "South Korea",
    flag: "🇰🇷",
    leagues: [
      "KBL",
      "KBL Cup",
      "WKBL W"
    ]
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    leagues: [
      "ACB",
      "LEB - Oro",
      "LEB - Plata",
      "Liga Femenina W",
      "Spanish Cup",
      "Spanish Cup Women",
      "Supercopa ACB",
      "Supercopa Women"
    ]
  },
  {
    country: "Sweden",
    flag: "🇸🇪",
    leagues: [
      "Basketettan W",
      "Basketligan",
      "Basketligan W",
      "Superettan"
    ]
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    leagues: [
      "LNA",
      "SB League W"
    ]
  },
  {
    country: "Taiwan",
    flag: "🇹🇼",
    leagues: [
      "P. League+",
      "SBL",
      "T1 League",
      "WSBL Women"
    ]
  },
  {
    country: "Tajikistan",
    flag: "🇹🇯",
    leagues: [
      "National League",
      "Northern Cup"
    ]
  },
  {
    country: "Thailand",
    flag: "🇹🇭",
    leagues: [
      "TBL"
    ]
  },
  {
    country: "Turkey",
    flag: "🇹🇷",
    leagues: [
      "Federation Cup",
      "Federation Cup Women",
      "KBSL W",
      "Super Cup",
      "Super Cup Women",
      "Super Ligi",
      "TB2L",
      "TB2L",
      "TKBL Women",
      "Turkish Cup",
      "Turkish Cup Women"
    ]
  },
  {
    country: "Turkmenistan",
    flag: "🇹🇲",
    leagues: [
      "NBLT"
    ]
  },
  {
    country: "Ukraine",
    flag: "🇺🇦",
    leagues: [
      "ACBU Superleague",
      "FBU Superleague",
      "Super Cup",
      "Superleague W",
      "Ukrainian Cup"
    ]
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    leagues: [
      "BBL",
      "BBL Cup",
      "BBL Trophy",
      "Betty Codona Trophy Women",
      "WBBL Cup Women",
      "WBBL W"
    ]
  },
  {
    country: "Uruguay",
    flag: "🇺🇾",
    leagues: [
      "Liga Capital"
    ]
  },
  {
    country: "United States",
    flag: "🇺🇸",
    leagues: [
      "BIG3",
      "California Classic",
      "CBI",
      "CIT",
      "IBL",
      "NBA",
      "NBA - D League",
      "NBA - Las Vegas Summer League",
      "NBA - Sacramento Summer League",
      "NBA - Utah Summer League",
      "NBA Cup",
      "NBA In-Season Tournament",
      "NBA Orlando Summer League",
      "NBA Salt Lake City Summer League",
      "NBA W",
      "NCAA",
      "NCAA Women",
      "NIT",
      "Vegas 16"
    ]
  },
  {
    country: "Venezuela",
    flag: "🇻🇪",
    leagues: [
      "LPB",
      "Superliga"
    ]
  },
  {
    country: "Vietnam",
    flag: "🇻🇳",
    leagues: [
      "VBA"
    ]
  },
  {
    country: "World",
    flag: "🌍",
    leagues: [
      "Albert Schweitzer Tournament",
      "Americas Championship",
      "Americas Championship U16",
      "Americas Championship U16 Women",
      "Americas Championship U18",
      "Americas Championship U18 Women",
      "Americas Championship Women",
      "Americas League",
      "Champions League Americas",
      "Commonwealth Games",
      "Commonwealth Games Women",
      "Friendly International",
      "Friendly International Women",
      "Intercontinental Cup",
      "Olympic Games",
      "Olympic Games Women",
      "Pan American Games",
      "Pan American Games Women",
      "Stankovic Continental Cup",
      "Universiade",
      "Universiade Women",
      "WBLA Women",
      "World Championship U17",
      "World Championship U17 Women",
      "World Championship U19",
      "World Championship U19 Women",
      "World Championship Women",
      "World Cup",
      "World Cup Women"
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
    country: "Australia",
    flag: "🇦🇺",
    leagues: [
      "Adelaide",
      "Adelaide, Doubles",
      "Auckland",
      "Auckland, Doubles",
      "Australian Open",
      "Australian Open, Doubles",
      "Australian Open, Mixed Doubles",
      "Brisbane",
      "Brisbane, Doubles"
    ]
  },
  {
    country: "France",
    flag: "🇫🇷",
    leagues: [
      "Montpellier",
      "Montpellier, Doubles",
      "Marseille",
      "Marseille, Doubles",
      "Metz",
      "Metz, Doubles",
      "Paris",
      "Paris, Doubles",
      "Roland Garros",
      "Roland Garros, Doubles",
      "Roland Garros, Mixed Doubles"
    ]
  },
  {
    country: "United States",
    flag: "🇺🇸",
    leagues: [
      "Dallas",
      "Dallas, Doubles",
      "Delray Beach",
      "Delray Beach, Doubles",
      "Indian Wells",
      "Indian Wells, Doubles",
      "Indian Wells, Mixed Doubles",
      "Miami",
      "Miami, Doubles",
      "Houston",
      "Houston, Doubles",
      "San Diego",
      "San Diego, Doubles",
      "Cincinnati",
      "Cincinnati, Doubles",
      "Winston Salem",
      "Winston Salem, Doubles",
      "US Open",
      "US Open, Doubles",
      "US Open, Mixed Doubles"
    ]
  },
  {
    country: "Argentina",
    flag: "🇦🇷",
    leagues: [
      "Buenos Aires",
      "Buenos Aires, Doubles"
    ]
  },
  {
    country: "Austria",
    flag: "🇦🇹",
    leagues: [
      "Kitzbuhel",
      "Kitzbuhel, Doubles",
      "Vienna",
      "Vienna, Doubles"
    ]
  },
  {
    country: "Belgium",
    flag: "🇧🇪",
    leagues: [
      "Antwerp",
      "Antwerp, Doubles"
    ]
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    leagues: [
      "Rio de Janeiro",
      "Rio de Janeiro, Doubles"
    ]
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    leagues: [
      "Toronto",
      "Toronto, Doubles",
      "Washington",
      "Washington, Doubles"
    ]
  },
  {
    country: "Chile",
    flag: "🇨🇱",
    leagues: [
      "Santiago",
      "Santiago, Doubles"
    ]
  },
  {
    country: "China",
    flag: "🇨🇳",
    leagues: [
      "Chengdu",
      "Chengdu, Doubles",
      "Hangzhou",
      "Hangzhou, Doubles",
      "Beijing",
      "Beijing, Doubles",
      "Shanghai",
      "Shanghai, Doubles"
    ]
  },
  {
    country: "Croatia",
    flag: "🇭🇷",
    leagues: [
      "Umag",
      "Umag, Doubles"
    ]
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    leagues: [
      "Munich",
      "Munich, Doubles",
      "Hamburg",
      "Hamburg, Doubles",
      "Stuttgart",
      "Stuttgart, Doubles",
      "Halle",
      "Halle, Doubles"
    ]
  },
  {
    country: "Hong Kong",
    flag: "🇭🇰",
    leagues: [
      "Hong Kong Men Singles",
      "Hong Kong Men Doubles"
    ]
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    leagues: [
      "Rome",
      "Rome, Doubles"
    ]
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    leagues: [
      "Tokyo",
      "Tokyo, Doubles"
    ]
  },
  {
    country: "Kazakhstan",
    flag: "🇰🇿",
    leagues: [
      "Almaty",
      "Almaty, Doubles"
    ]
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    leagues: [
      "Acapulco",
      "Acapulco, Doubles",
      "Los Cabos",
      "Los Cabos, Doubles"
    ]
  },
  {
    country: "Monaco",
    flag: "🇲🇨",
    leagues: [
      "Monte Carlo",
      "Monte Carlo, Doubles"
    ]
  },
  {
    country: "Morocco",
    flag: "🇲🇦",
    leagues: [
      "Marrakech",
      "Marrakech, Doubles"
    ]
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    leagues: [
      "Rotterdam",
      "Rotterdam, Doubles",
      "'s-Hertogenbosch",
      "'s-Hertogenbosch, Doubles"
    ]
  },
  {
    country: "Qatar",
    flag: "🇶🇦",
    leagues: [
      "Doha",
      "Doha, Doubles"
    ]
  },
  {
    country: "Romania",
    flag: "🇷🇴",
    leagues: [
      "Bucharest",
      "Bucharest, Doubles"
    ]
  },
  {
    country: "Serbia",
    flag: "🇷🇸",
    leagues: [
      "Belgrade",
      "Belgrade, Doubles"
    ]
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    leagues: [
      "Barcelona",
      "Barcelona, Doubles",
      "Madrid",
      "Madrid, Doubles",
      "Mallorca",
      "Mallorca, Doubles"
    ]
  },
  {
    country: "Sweden",
    flag: "🇸🇪",
    leagues: [
      "Bastad",
      "Bastad, Doubles",
      "Stockholm",
      "Stockholm, Doubles"
    ]
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    leagues: [
      "Gstaad",
      "Gstaad, Doubles",
      "Geneva",
      "Geneva, Doubles",
      "Basel, Doubles"
    ]
  },
  {
    country: "United Arab Emirates",
    flag: "🇦🇪",
    leagues: [
      "Dubai",
      "Dubai, Doubles"
    ]
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    leagues: [
      "London",
      "London, Doubles",
      "Eastbourne",
      "Eastbourne, Doubles",
      "Wimbledon",
      "Wimbledon, Doubles",
      "Wimbledon, Mixed Doubles"
    ]
  },
  {
    country: "World",
    flag: "🌍",
    leagues: [
      "ATP Finals",
      "ATP Finals, Doubles",
      "Next Gen Finals",
      "Billie Jean King Cup",
      "Challenger",
      "Davis Cup",
      "Exhibition",
      "Grand Slam",
      "In Progress",
      "ITF Men",
      "ITF Women",
      "United Cup",
      "UTR Men",
      "UTR Women",
      "WTA",
      "WTA 125"
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