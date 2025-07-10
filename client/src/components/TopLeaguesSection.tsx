import { useState } from 'react';
import { Trophy, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { MatchCard } from './MatchCard';

interface TopLeaguesSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  onLeagueClick: (leagueId: string, leagueName: string) => void;
  sport?: string;
}



export function TopLeaguesSection({ onBetClick, onLeagueClick, sport = 'football' }: TopLeaguesSectionProps) {
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set());

  // Define top-tier leagues for each sport
  const topLeagues = {
    football: [
      // European Top Leagues
      { id: 'premier-league', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'soccer_epl' },
      { id: 'championship', name: 'Championship', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'soccer_england_championship' },
      { id: 'la-liga', name: 'La Liga', country: 'Spain', flag: '🇪🇸', apiKey: 'soccer_spain_la_liga' },
      { id: 'segunda-division', name: 'Segunda División', country: 'Spain', flag: '🇪🇸', apiKey: 'soccer_spain_segunda_division' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', apiKey: 'soccer_germany_bundesliga' },
      { id: 'serie-a', name: 'Serie A', country: 'Italy', flag: '🇮🇹', apiKey: 'soccer_italy_serie_a' },
      { id: 'ligue-1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', apiKey: 'soccer_france_ligue_one' },
      { id: 'eredivisie', name: 'Eredivisie', country: 'Netherlands', flag: '🇳🇱', apiKey: 'soccer_netherlands_eredivisie' },
      { id: 'primeira-liga', name: 'Primeira Liga', country: 'Portugal', flag: '🇵🇹', apiKey: 'soccer_portugal_primeira_liga' },
      { id: 'scottish-premiership', name: 'Scottish Premiership', country: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', apiKey: 'soccer_scotland_premiership' },
      { id: 'bundesliga-austria', name: 'Bundesliga', country: 'Austria', flag: '🇦🇹', apiKey: 'soccer_austria_bundesliga' },
      { id: 'pro-league', name: 'Pro League', country: 'Belgium', flag: '🇧🇪', apiKey: 'soccer_belgium_pro_league' },
      { id: 'czech-liga', name: 'Czech Liga', country: 'Czech Republic', flag: '🇨🇿', apiKey: 'soccer_czech_liga' },
      { id: 'superliga', name: 'Superliga', country: 'Denmark', flag: '🇩🇰', apiKey: 'soccer_denmark_superliga' },
      { id: 'veikkausliiga', name: 'Veikkausliiga', country: 'Finland', flag: '🇫🇮', apiKey: 'soccer_finland_veikkausliiga' },
      { id: 'super-league', name: 'Super League', country: 'Greece', flag: '🇬🇷', apiKey: 'soccer_greece_super_league' },
      { id: 'nb1', name: 'NB1', country: 'Hungary', flag: '🇭🇺', apiKey: 'soccer_hungary_nb1' },
      { id: 'premier-division', name: 'Premier Division', country: 'Ireland', flag: '🇮🇪', apiKey: 'soccer_ireland_premier_division' },
      { id: 'allsvenskan', name: 'Allsvenskan', country: 'Sweden', flag: '🇸🇪', apiKey: 'soccer_sweden_allsvenskan' },
      { id: 'super-league-swiss', name: 'Super League', country: 'Switzerland', flag: '🇨🇭', apiKey: 'soccer_switzerland_super_league' },
      { id: 'super-lig', name: 'Süper Lig', country: 'Turkey', flag: '🇹🇷', apiKey: 'soccer_turkey_super_lig' },
      
      // South American Top Leagues
      { id: 'brasileirao', name: 'Brasileirão', country: 'Brazil', flag: '🇧🇷', apiKey: 'soccer_brazil_campeonato' },
      { id: 'primera-division-argentina', name: 'Primera División', country: 'Argentina', flag: '🇦🇷', apiKey: 'soccer_argentina_primera_division' },
      { id: 'primera-division-chile', name: 'Primera División', country: 'Chile', flag: '🇨🇱', apiKey: 'soccer_chile_primera_division' },
      { id: 'primera-division-colombia', name: 'Primera División', country: 'Colombia', flag: '🇨🇴', apiKey: 'soccer_colombia_primera_division' },
      { id: 'primera-division-uruguay', name: 'Primera División', country: 'Uruguay', flag: '🇺🇾', apiKey: 'soccer_uruguay_primera_division' },
      
      // North American Top Leagues
      { id: 'mls', name: 'MLS', country: 'USA', flag: '🇺🇸', apiKey: 'soccer_usa_mls' },
      { id: 'liga-mx', name: 'Liga MX', country: 'Mexico', flag: '🇲🇽', apiKey: 'soccer_mexico_liga_mx' },
      { id: 'cpl', name: 'Canadian Premier League', country: 'Canada', flag: '🇨🇦', apiKey: 'soccer_canada_cpl' },
      
      // Asian Top Leagues
      { id: 'j-league', name: 'J-League', country: 'Japan', flag: '🇯🇵', apiKey: 'soccer_japan_j_league' },
      { id: 'k-league', name: 'K-League', country: 'South Korea', flag: '🇰🇷', apiKey: 'soccer_korea_k_league' },
      { id: 'chinese-super-league', name: 'Chinese Super League', country: 'China', flag: '🇨🇳', apiKey: 'soccer_china_super_league' },
      { id: 'a-league', name: 'A-League', country: 'Australia', flag: '🇦🇺', apiKey: 'soccer_australia_aleague' },
      { id: 'indian-super-league', name: 'Indian Super League', country: 'India', flag: '🇮🇳', apiKey: 'soccer_india_super_league' },
      
      // African Top Leagues
      { id: 'premier-league-south-africa', name: 'Premier League', country: 'South Africa', flag: '🇿🇦', apiKey: 'soccer_south_africa_premier_league' },
      { id: 'premier-league-egypt', name: 'Premier League', country: 'Egypt', flag: '🇪🇬', apiKey: 'soccer_egypt_premier_league' },
      { id: 'premier-league-nigeria', name: 'Premier League', country: 'Nigeria', flag: '🇳🇬', apiKey: 'soccer_nigeria_premier_league' },
      
      // Continental Competitions
      { id: 'champions-league', name: 'UEFA Champions League', country: 'Europe', flag: '🇪🇺', apiKey: 'soccer_uefa_champions_league' },
      { id: 'europa-league', name: 'UEFA Europa League', country: 'Europe', flag: '🇪🇺', apiKey: 'soccer_uefa_europa_league' },
      { id: 'conference-league', name: 'UEFA Conference League', country: 'Europe', flag: '🇪🇺', apiKey: 'soccer_uefa_conference_league' },
      { id: 'copa-libertadores', name: 'Copa Libertadores', country: 'South America', flag: '🇦🇷', apiKey: 'soccer_conmebol_libertadores' },
      { id: 'copa-sudamericana', name: 'Copa Sudamericana', country: 'South America', flag: '🇦🇷', apiKey: 'soccer_conmebol_sudamericana' },
      { id: 'concacaf-champions-league', name: 'CONCACAF Champions League', country: 'North America', flag: '🇺🇸', apiKey: 'soccer_concacaf_champions_league' },
      { id: 'caf-champions-league', name: 'CAF Champions League', country: 'Africa', flag: '🇿🇦', apiKey: 'soccer_caf_champions_league' },
      { id: 'afc-champions-league', name: 'AFC Champions League', country: 'Asia', flag: '🇯🇵', apiKey: 'soccer_afc_champions_league' }
    ],
    basketball: [
      // North American Top Leagues
      { id: 'nba', name: 'NBA', country: 'USA', flag: '🇺🇸', apiKey: 'basketball_nba' },
      { id: 'wnba', name: 'WNBA', country: 'USA', flag: '🇺🇸', apiKey: 'basketball_wnba' },
      { id: 'g-league', name: 'G League', country: 'USA', flag: '🇺🇸', apiKey: 'basketball_g_league' },
      { id: 'ncaa', name: 'NCAA Division I', country: 'USA', flag: '🇺🇸', apiKey: 'basketball_ncaa' },
      { id: 'nbl-canada', name: 'NBL Canada', country: 'Canada', flag: '🇨🇦', apiKey: 'basketball_nbl_canada' },
      
      // European Top Leagues
      { id: 'euroleague', name: 'EuroLeague', country: 'Europe', flag: '🇪🇺', apiKey: 'basketball_euroleague' },
      { id: 'eurocup', name: 'EuroCup', country: 'Europe', flag: '🇪🇺', apiKey: 'basketball_eurocup' },
      { id: 'bbl', name: 'BBL', country: 'Germany', flag: '🇩🇪', apiKey: 'basketball_bbl' },
      { id: 'liga-acb', name: 'Liga ACB', country: 'Spain', flag: '🇪🇸', apiKey: 'basketball_liga_acb' },
      { id: 'lega-basket', name: 'Lega Basket Serie A', country: 'Italy', flag: '🇮🇹', apiKey: 'basketball_lega_basket' },
      { id: 'pro-a', name: 'Pro A', country: 'France', flag: '🇫🇷', apiKey: 'basketball_pro_a' },
      { id: 'vtb-league', name: 'VTB United League', country: 'Russia', flag: '🇷🇺', apiKey: 'basketball_vtb' },
      { id: 'greek-basket', name: 'Greek Basket League', country: 'Greece', flag: '🇬🇷', apiKey: 'basketball_greek' },
      
      // Asia-Pacific Top Leagues
      { id: 'nbl-australia', name: 'NBL', country: 'Australia', flag: '🇦🇺', apiKey: 'basketball_nbl' },
      { id: 'b-league', name: 'B.League', country: 'Japan', flag: '🇯🇵', apiKey: 'basketball_b_league' },
      { id: 'kbl', name: 'KBL', country: 'South Korea', flag: '🇰🇷', apiKey: 'basketball_kbl' },
      { id: 'cba', name: 'CBA', country: 'China', flag: '🇨🇳', apiKey: 'basketball_cba' },
      
      // South American Top Leagues
      { id: 'nbb', name: 'NBB', country: 'Brazil', flag: '🇧🇷', apiKey: 'basketball_nbb' },
      { id: 'liga-nacional', name: 'Liga Nacional', country: 'Argentina', flag: '🇦🇷', apiKey: 'basketball_liga_nacional' }
    ],
    cricket: [
      // International Competitions
      { id: 'icc-world-cup', name: 'ICC Cricket World Cup', country: 'World', flag: '🌍', apiKey: 'cricket_world_cup' },
      { id: 'icc-t20-world-cup', name: 'ICC T20 World Cup', country: 'World', flag: '🌍', apiKey: 'cricket_t20_world_cup' },
      { id: 'champions-trophy', name: 'ICC Champions Trophy', country: 'World', flag: '🌍', apiKey: 'cricket_champions_trophy' },
      { id: 'world-test-championship', name: 'World Test Championship', country: 'World', flag: '🌍', apiKey: 'cricket_test_championship' },
      
      // Premier T20 Leagues
      { id: 'ipl', name: 'Indian Premier League', country: 'India', flag: '🇮🇳', apiKey: 'cricket_ipl' },
      { id: 'big-bash', name: 'Big Bash League', country: 'Australia', flag: '🇦🇺', apiKey: 'cricket_big_bash' },
      { id: 'psl', name: 'Pakistan Super League', country: 'Pakistan', flag: '🇵🇰', apiKey: 'cricket_psl' },
      { id: 'cpl', name: 'Caribbean Premier League', country: 'West Indies', flag: '🇼🇸', apiKey: 'cricket_cpl' },
      { id: 'hundred', name: 'The Hundred', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'cricket_hundred' },
      { id: 'vitality-blast', name: 'Vitality Blast', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'cricket_blast' },
      
      // International Test/ODI/T20 Series
      { id: 'test-matches', name: 'Test Matches', country: 'World', flag: '🌍', apiKey: 'cricket_test_match' },
      { id: 'odi-series', name: 'ODI Series', country: 'World', flag: '🌍', apiKey: 'cricket_odi' },
      { id: 't20-internationals', name: 'T20 Internationals', country: 'World', flag: '🌍', apiKey: 'cricket_t20' },
      
      // Domestic First-Class Competitions
      { id: 'county-championship', name: 'County Championship', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'cricket_county_championship' },
      { id: 'sheffield-shield', name: 'Sheffield Shield', country: 'Australia', flag: '🇦🇺', apiKey: 'cricket_sheffield_shield' },
      { id: 'ranji-trophy', name: 'Ranji Trophy', country: 'India', flag: '🇮🇳', apiKey: 'cricket_ranji_trophy' }
    ],
    tennis: [
      // Grand Slams
      { id: 'australian-open', name: 'Australian Open', country: 'Australia', flag: '🇦🇺', apiKey: 'tennis_australian_open' },
      { id: 'french-open', name: 'French Open', country: 'France', flag: '🇫🇷', apiKey: 'tennis_french_open' },
      { id: 'wimbledon', name: 'Wimbledon', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'tennis_wimbledon' },
      { id: 'us-open', name: 'US Open', country: 'USA', flag: '🇺🇸', apiKey: 'tennis_us_open' },
      
      // ATP Masters 1000
      { id: 'indian-wells', name: 'Indian Wells Masters', country: 'USA', flag: '🇺🇸', apiKey: 'tennis_indian_wells' },
      { id: 'miami-open', name: 'Miami Open', country: 'USA', flag: '🇺🇸', apiKey: 'tennis_miami' },
      { id: 'monte-carlo', name: 'Monte Carlo Masters', country: 'Monaco', flag: '🇲🇨', apiKey: 'tennis_monte_carlo' },
      { id: 'madrid-open', name: 'Madrid Open', country: 'Spain', flag: '🇪🇸', apiKey: 'tennis_madrid' },
      { id: 'rome-masters', name: 'Italian Open', country: 'Italy', flag: '🇮🇹', apiKey: 'tennis_rome' },
      { id: 'canada-masters', name: 'Canada Masters', country: 'Canada', flag: '🇨🇦', apiKey: 'tennis_canada' },
      { id: 'cincinnati', name: 'Cincinnati Masters', country: 'USA', flag: '🇺🇸', apiKey: 'tennis_cincinnati' },
      { id: 'shanghai', name: 'Shanghai Masters', country: 'China', flag: '🇨🇳', apiKey: 'tennis_shanghai' },
      { id: 'paris-masters', name: 'Paris Masters', country: 'France', flag: '🇫🇷', apiKey: 'tennis_paris' },
      
      // ATP/WTA Tours
      { id: 'atp-finals', name: 'ATP Finals', country: 'World', flag: '🌍', apiKey: 'tennis_atp_finals' },
      { id: 'wta-finals', name: 'WTA Finals', country: 'World', flag: '🌍', apiKey: 'tennis_wta_finals' },
      { id: 'davis-cup', name: 'Davis Cup', country: 'World', flag: '🌍', apiKey: 'tennis_davis_cup' },
      { id: 'billie-jean-king-cup', name: 'Billie Jean King Cup', country: 'World', flag: '🌍', apiKey: 'tennis_bjk_cup' }
    ],
    hockey: [
      // North American Top Leagues
      { id: 'nhl', name: 'NHL', country: 'North America', flag: '🇺🇸', apiKey: 'icehockey_nhl' },
      { id: 'ahl', name: 'AHL', country: 'North America', flag: '🇺🇸', apiKey: 'icehockey_ahl' },
      { id: 'echl', name: 'ECHL', country: 'USA', flag: '🇺🇸', apiKey: 'icehockey_echl' },
      { id: 'pwhl', name: 'PWHL', country: 'North America', flag: '🇺🇸', apiKey: 'icehockey_pwhl' },
      
      // European Top Leagues
      { id: 'khl', name: 'KHL', country: 'Russia', flag: '🇷🇺', apiKey: 'icehockey_khl' },
      { id: 'shl', name: 'SHL', country: 'Sweden', flag: '🇸🇪', apiKey: 'icehockey_sweden_hockey_league' },
      { id: 'liiga', name: 'Liiga', country: 'Finland', flag: '🇫🇮', apiKey: 'icehockey_finland_liiga' },
      { id: 'del', name: 'DEL', country: 'Germany', flag: '🇩🇪', apiKey: 'icehockey_del' },
      { id: 'nla', name: 'National League', country: 'Switzerland', flag: '🇨🇭', apiKey: 'icehockey_nla' },
      { id: 'extraliga', name: 'Extraliga', country: 'Czech Republic', flag: '🇨🇿', apiKey: 'icehockey_extraliga' },
      { id: 'extraliga-slovakia', name: 'Extraliga', country: 'Slovakia', flag: '🇸🇰', apiKey: 'icehockey_slovakia_extraliga' },
      { id: 'get-ligaen', name: 'GET-ligaen', country: 'Norway', flag: '🇳🇴', apiKey: 'icehockey_get_ligaen' },
      { id: 'metal-ligaen', name: 'Metal Ligaen', country: 'Denmark', flag: '🇩🇰', apiKey: 'icehockey_metal_ligaen' },
      
      // International Competitions
      { id: 'iihf-world-championship', name: 'IIHF World Championship', country: 'World', flag: '🌍', apiKey: 'icehockey_world_championship' },
      { id: 'world-juniors', name: 'World Junior Championship', country: 'World', flag: '🌍', apiKey: 'icehockey_world_juniors' },
      { id: 'champions-hockey-league', name: 'Champions Hockey League', country: 'Europe', flag: '🇪🇺', apiKey: 'icehockey_chl' }
    ],
    volleyball: [
      // European Top Leagues
      { id: 'cev-champions-league', name: 'CEV Champions League', country: 'Europe', flag: '🇪🇺', apiKey: 'volleyball_cev_champions' },
      { id: 'cev-cup', name: 'CEV Cup', country: 'Europe', flag: '🇪🇺', apiKey: 'volleyball_cev_cup' },
      { id: 'serie-a1', name: 'Serie A1', country: 'Italy', flag: '🇮🇹', apiKey: 'volleyball_serie_a1' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', apiKey: 'volleyball_bundesliga' },
      { id: 'plusliga', name: 'PlusLiga', country: 'Poland', flag: '🇵🇱', apiKey: 'volleyball_plusliga' },
      { id: 'tauron-liga', name: 'Tauron Liga', country: 'Poland', flag: '🇵🇱', apiKey: 'volleyball_tauron_liga' },
      { id: 'superliga', name: 'Superliga', country: 'Russia', flag: '🇷🇺', apiKey: 'volleyball_superliga' },
      { id: 'ligue-am', name: 'Ligue A Masculine', country: 'France', flag: '🇫🇷', apiKey: 'volleyball_ligue_am' },
      { id: 'ligue-af', name: 'Ligue A Féminine', country: 'France', flag: '🇫🇷', apiKey: 'volleyball_ligue_af' },
      
      // Asian Top Leagues
      { id: 'v-league', name: 'V.League', country: 'Japan', flag: '🇯🇵', apiKey: 'volleyball_v_league' },
      { id: 'kovo', name: 'KOVO', country: 'South Korea', flag: '🇰🇷', apiKey: 'volleyball_kovo' },
      { id: 'chinese-league', name: 'Chinese Volleyball League', country: 'China', flag: '🇨🇳', apiKey: 'volleyball_chinese' },
      
      // International Competitions
      { id: 'vnl', name: 'Volleyball Nations League', country: 'World', flag: '🌍', apiKey: 'volleyball_vnl' },
      { id: 'world-championship', name: 'FIVB World Championship', country: 'World', flag: '🌍', apiKey: 'volleyball_world_championship' },
      { id: 'olympic-games', name: 'Olympic Games', country: 'World', flag: '🌍', apiKey: 'volleyball_olympics' }
    ],
    rugby: [
      // International Competitions
      { id: 'six-nations', name: 'Six Nations', country: 'Europe', flag: '🇪🇺', apiKey: 'rugby_six_nations' },
      { id: 'rugby-championship', name: 'Rugby Championship', country: 'World', flag: '🌍', apiKey: 'rugby_championship' },
      { id: 'world-cup', name: 'Rugby World Cup', country: 'World', flag: '🌍', apiKey: 'rugby_world_cup' },
      { id: 'sevens-world-series', name: "Seven's World Series", country: 'World', flag: '🌍', apiKey: 'rugby_sevens_world_series' },
      
      // Club Competitions
      { id: 'champions-cup', name: 'European Rugby Champions Cup', country: 'Europe', flag: '🇪🇺', apiKey: 'rugby_champions_cup' },
      { id: 'challenge-cup', name: 'Challenge Cup', country: 'Europe', flag: '🇪🇺', apiKey: 'rugby_challenge_cup' },
      { id: 'urc', name: 'United Rugby Championship', country: 'Europe', flag: '🇪🇺', apiKey: 'rugby_urc' },
      
      // Domestic Top Leagues
      { id: 'premiership', name: 'Premiership Rugby', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiKey: 'rugby_premiership' },
      { id: 'top-14', name: 'Top 14', country: 'France', flag: '🇫🇷', apiKey: 'rugby_top_14' },
      { id: 'pro-d2', name: 'Pro D2', country: 'France', flag: '🇫🇷', apiKey: 'rugby_pro_d2' },
      { id: 'super-rugby', name: 'Super Rugby', country: 'World', flag: '🌍', apiKey: 'rugby_super_rugby' },
      { id: 'currie-cup', name: 'Currie Cup', country: 'South Africa', flag: '🇿🇦', apiKey: 'rugby_currie_cup' },
      { id: 'major-league-rugby', name: 'Major League Rugby', country: 'USA', flag: '🇺🇸', apiKey: 'rugby_mlr' }
    ],
    baseball: [
      // North American Top Leagues
      { id: 'mlb', name: 'MLB', country: 'USA', flag: '🇺🇸', apiKey: 'baseball_mlb' },
      { id: 'triple-a', name: 'Triple-A', country: 'USA', flag: '🇺🇸', apiKey: 'baseball_triple_a' },
      { id: 'double-a', name: 'Double-A', country: 'USA', flag: '🇺🇸', apiKey: 'baseball_double_a' },
      { id: 'ncaa-baseball', name: 'NCAA Baseball', country: 'USA', flag: '🇺🇸', apiKey: 'baseball_ncaa' },
      { id: 'mlb-draft', name: 'MLB Draft League', country: 'USA', flag: '🇺🇸', apiKey: 'baseball_draft_league' },
      
      // Asian Top Leagues
      { id: 'npb', name: 'NPB', country: 'Japan', flag: '🇯🇵', apiKey: 'baseball_npb' },
      { id: 'kbo', name: 'KBO League', country: 'South Korea', flag: '🇰🇷', apiKey: 'baseball_kbo' },
      { id: 'cpbl', name: 'CPBL', country: 'Taiwan', flag: '🇹🇼', apiKey: 'baseball_cpbl' },
      
      // Latin American Top Leagues
      { id: 'liga-mexicana', name: 'Liga Mexicana de Beisbol', country: 'Mexico', flag: '🇲🇽', apiKey: 'baseball_liga_mexicana' },
      { id: 'lidom', name: 'LIDOM', country: 'Dominican Republic', flag: '🇩🇴', apiKey: 'baseball_lidom' },
      { id: 'lvbp', name: 'LVBP', country: 'Venezuela', flag: '🇻🇪', apiKey: 'baseball_lvbp' },
      
      // European Top Leagues
      { id: 'bundesliga-baseball', name: 'Baseball Bundesliga', country: 'Germany', flag: '🇩🇪', apiKey: 'baseball_bundesliga' },
      { id: 'serie-a-baseball', name: 'Serie A Baseball', country: 'Italy', flag: '🇮🇹', apiKey: 'baseball_serie_a' },
      { id: 'hoofdklasse', name: 'Hoofdklasse', country: 'Netherlands', flag: '🇳🇱', apiKey: 'baseball_hoofdklasse' },
      
      // International Competitions
      { id: 'world-baseball-classic', name: 'World Baseball Classic', country: 'World', flag: '🌍', apiKey: 'baseball_wbc' },
      { id: 'premier-12', name: 'WBSC Premier12', country: 'World', flag: '🌍', apiKey: 'baseball_premier12' },
      { id: 'olympic-baseball', name: 'Olympic Games', country: 'World', flag: '🌍', apiKey: 'baseball_olympics' }
    ]
  };

  // Fetch live top leagues data
  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/top-leagues', sport],
    queryFn: () => fetch(`/api/top-leagues/${sport}`).then(res => res.json()),
  });



  const getSportName = (sport: string) => {
    const names: { [key: string]: string } = {
      football: 'Football',
      basketball: 'Basketball', 
      tennis: 'Tennis',
      hockey: 'Hockey',
      'ice-hockey': 'Hockey',
      cricket: 'Cricket',
      volleyball: 'Volleyball',
      rugby: 'Rugby',
      baseball: 'Baseball'
    };
    return names[sport] || 'Football';
  };

  // Toggle function for league dropdowns
  const toggleLeague = (league: string) => {
    const newExpanded = new Set(expandedLeagues);
    if (newExpanded.has(league)) {
      newExpanded.delete(league);
    } else {
      newExpanded.add(league);
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

  // Get current sport's top leagues
  const currentSportLeagues = topLeagues[sport as keyof typeof topLeagues] || [];
  
  // Group matches by league (only showing top leagues)
  const groupedMatches = matches
    .filter(match => {
      // Only show matches from top-tier leagues
      const matchLeague = match.league.toLowerCase();
      return currentSportLeagues.some(league => 
        matchLeague.includes(league.name.toLowerCase()) ||
        matchLeague.includes(league.country.toLowerCase())
      );
    })
    .reduce((acc, match) => {
      const key = match.league;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    }, {} as { [key: string]: any[] });

  // Group leagues by region
  const groupedLeagues = currentSportLeagues.reduce((acc, league) => {
    let region = 'Other';
    
    // European countries
    if (['England', 'Spain', 'Germany', 'Italy', 'France', 'Netherlands', 'Portugal', 'Scotland', 'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Finland', 'Greece', 'Hungary', 'Ireland', 'Sweden', 'Switzerland', 'Turkey', 'Norway', 'Slovakia', 'Russia', 'Poland', 'Monaco'].includes(league.country)) {
      region = 'Europe';
    } 
    // South American countries
    else if (['Brazil', 'Argentina', 'Uruguay', 'Chile', 'Colombia', 'Paraguay', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia'].includes(league.country)) {
      region = 'South America';
    } 
    // North American countries
    else if (['USA', 'Canada', 'Mexico', 'North America'].includes(league.country)) {
      region = 'North America';
    } 
    // Asia-Pacific countries
    else if (['Japan', 'South Korea', 'Australia', 'China', 'India', 'Thailand', 'Singapore', 'New Zealand', 'Pakistan', 'Taiwan'].includes(league.country)) {
      region = 'Asia-Pacific';
    } 
    // African countries
    else if (['South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Ghana', 'Morocco', 'Tunisia', 'Algeria'].includes(league.country)) {
      region = 'Africa';
    }
    // Caribbean and Other regions
    else if (['West Indies', 'Dominican Republic'].includes(league.country)) {
      region = 'Caribbean';
    }
    // Continental/International competitions
    else if (['Europe', 'World'].includes(league.country)) {
      region = 'International';
    }
    
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(league);
    return acc;
  }, {} as { [key: string]: typeof currentSportLeagues });

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Top {getSportName(sport)} Leagues
        </h1>
        <p className="text-gray-400 mt-1">
          Premier competitions from around the world
        </p>
      </div>

      <div className="px-4 py-4">
        {Object.keys(groupedLeagues).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No top leagues available for {getSportName(sport)}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Show data availability status */}
            {matches.length === 0 && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  Live match data is currently unavailable. League structure is displayed below for reference.
                </p>
              </div>
            )}

            {Object.entries(groupedLeagues).map(([region, leagues]) => (
              <div key={region} className="border-b border-gray-700/30 pb-6">
                {/* Region Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">{region}</h2>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
                </div>

                {/* Leagues in this region */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leagues.map((league) => {
                    const leagueMatches = groupedMatches[league.name] || [];
                    const hasMatches = leagueMatches.length > 0;
                    
                    return (
                      <Button
                        key={league.id}
                        variant="ghost"
                        onClick={() => hasMatches && onLeagueClick(league.id, league.name)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg text-left border border-gray-700/30 ${
                          hasMatches ? 'hover:bg-gray-800/50 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{league.flag}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{league.name}</span>
                            <span className="text-xs text-gray-400">{league.country}</span>
                            {hasMatches && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full mt-1 w-fit">
                                {leagueMatches.length} matches
                              </span>
                            )}
                          </div>
                        </div>
                        <Trophy className={`w-4 h-4 ${hasMatches ? 'text-yellow-400' : 'text-gray-500'}`} />
                      </Button>
                    );
                  })}
                </div>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}