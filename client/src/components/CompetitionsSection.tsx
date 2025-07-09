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
      "Srpska Liga - West"
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