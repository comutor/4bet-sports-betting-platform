import { log } from "../vite";

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface Outcome {
  name: string;
  price: number;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Event {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
  }[];
}

export class OddsApiService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = process.env.ODDS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ODDS_API_KEY environment variable is required');
    }
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private getCached(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getSports(): Promise<Sport[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sports/?apiKey=${this.apiKey}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const sports = await response.json();
      log(`Fetched ${sports.length} sports from Odds API`);
      return sports;
    } catch (error) {
      log(`Error fetching sports: ${error}`);
      throw error;
    }
  }

  async getOdds(sportKey: string, regions = 'us', markets = 'h2h', oddsFormat = 'decimal'): Promise<Event[]> {
    const cacheKey = `odds_${sportKey}_${regions}_${markets}`;
    
    if (this.isCacheValid(cacheKey)) {
      log(`Using cached data for ${sportKey}`);
      return this.getCached(cacheKey);
    }

    try {
      const url = `${this.baseUrl}/sports/${sportKey}/odds/?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const events = await response.json();
      this.setCache(cacheKey, events);
      log(`Fetched ${events.length} events for ${sportKey}`);
      return events;
    } catch (error) {
      log(`Error fetching odds for ${sportKey}: ${error}`);
      throw error;
    }
  }

  async getEventOdds(sportKey: string, eventId: string, regions = 'us', markets = 'h2h'): Promise<Event> {
    try {
      const url = `${this.baseUrl}/sports/${sportKey}/odds/?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&eventIds=${eventId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const events = await response.json();
      if (events.length === 0) {
        throw new Error(`Event ${eventId} not found`);
      }
      
      log(`Fetched odds for event ${eventId}`);
      return events[0];
    } catch (error) {
      log(`Error fetching event odds: ${error}`);
      throw error;
    }
  }

  // Get upcoming games for popular sports
  async getUpcomingGames() {
    const popularSports = ['basketball_nba', 'americanfootball_nfl', 'soccer_epl', 'soccer_spain_la_liga'];
    const results: { [key: string]: Event[] } = {};

    for (const sport of popularSports) {
      try {
        results[sport] = await this.getOdds(sport);
      } catch (error) {
        log(`Failed to fetch odds for ${sport}: ${error}`);
        results[sport] = [];
      }
    }

    return results;
  }

  // Get football/soccer leagues
  async getSoccerLeagues() {
    const soccerLeagues = [
      'soccer_epl', // Premier League
      'soccer_spain_la_liga', // La Liga
      'soccer_germany_bundesliga', // Bundesliga
      'soccer_italy_serie_a', // Serie A
      'soccer_france_ligue_one', // Ligue 1
      'soccer_uefa_champs_league' // Champions League
    ];

    const results: { [key: string]: Event[] } = {};

    for (const league of soccerLeagues) {
      try {
        results[league] = await this.getOdds(league);
      } catch (error) {
        log(`Failed to fetch odds for ${league}: ${error}`);
        results[league] = [];
      }
    }

    return results;
  }

  // Get basketball leagues
  async getBasketballLeagues() {
    const basketballLeagues = ['basketball_nba', 'basketball_wnba'];
    const results: { [key: string]: Event[] } = {};

    for (const league of basketballLeagues) {
      try {
        results[league] = await this.getOdds(league);
      } catch (error) {
        log(`Failed to fetch odds for ${league}: ${error}`);
        results[league] = [];
      }
    }

    return results;
  }

  // Get basketball games organized by league priority
  async getBasketballGamesByPriority() {
    const basketballLeagues = [
      { name: 'NBA', key: 'basketball_nba', country: 'USA', flag: '🇺🇸', priority: 1 },
      { name: 'WNBA', key: 'basketball_wnba', country: 'USA', flag: '🇺🇸', priority: 2 },
      { name: 'NBL', key: 'basketball_nbl', country: 'Australia', flag: '🇦🇺', priority: 3 },
      { name: 'EuroLeague', key: 'basketball_euroleague', country: 'Europe', flag: '🇪🇺', priority: 4 }
    ];

    const allGames = [];

    for (const league of basketballLeagues) {
      try {
        const games = await this.getOdds(league.key);
        console.log(`Fetched ${games.length} events for ${league.key}`);
        
        const transformedGames = games.map(game => ({
          ...game,
          league_name: league.name,
          country: league.country,
          country_flag: league.flag,
          priority: league.priority
        }));

        if (transformedGames.length > 0) {
          allGames.push({
            league: league.name,
            country: league.country,
            flag: league.flag,
            games: transformedGames,
            priority: league.priority
          });
        }
      } catch (error) {
        console.error(`Error fetching ${league.key}:`, error);
      }
    }

    return allGames.sort((a, b) => a.priority - b.priority);
  }

  // Get ice hockey games organized by league priority
  async getIceHockeyGamesByPriority() {
    const hockeyLeagues = [
      { name: 'NHL', key: 'icehockey_nhl', country: 'North America', flag: '🏒', priority: 1 },
      { name: 'KHL', key: 'icehockey_khl', country: 'Russia', flag: '🇷🇺', priority: 2 },
      { name: 'SHL', key: 'icehockey_sweden_hockey_league', country: 'Sweden', flag: '🇸🇪', priority: 3 },
      { name: 'Finnish Liiga', key: 'icehockey_finland_liiga', country: 'Finland', flag: '🇫🇮', priority: 4 }
    ];

    const allGames = [];

    for (const league of hockeyLeagues) {
      try {
        const games = await this.getOdds(league.key);
        console.log(`Fetched ${games.length} events for ${league.key}`);
        
        const transformedGames = games.map(game => ({
          ...game,
          league_name: league.name,
          country: league.country,
          country_flag: league.flag,
          priority: league.priority
        }));

        if (transformedGames.length > 0) {
          allGames.push({
            league: league.name,
            country: league.country,
            flag: league.flag,
            games: transformedGames,
            priority: league.priority
          });
        }
      } catch (error) {
        console.error(`Error fetching ${league.key}:`, error);
      }
    }

    return allGames.sort((a, b) => a.priority - b.priority);
  }

  // Get tennis games organized by tournament priority
  async getTennisGamesByPriority() {
    const tennisLeagues = [
      { name: 'ATP', key: 'tennis_atp', country: 'International', flag: '🎾', priority: 1 },
      { name: 'WTA', key: 'tennis_wta', country: 'International', flag: '🎾', priority: 2 },
      { name: 'ITF Men', key: 'tennis_itf_men', country: 'International', flag: '🎾', priority: 3 },
      { name: 'ITF Women', key: 'tennis_itf_women', country: 'International', flag: '🎾', priority: 4 }
    ];

    const allGames = [];

    for (const league of tennisLeagues) {
      try {
        const games = await this.getOdds(league.key);
        console.log(`Fetched ${games.length} events for ${league.key}`);
        
        const transformedGames = games.map(game => ({
          ...game,
          league_name: league.name,
          country: league.country,
          country_flag: league.flag,
          priority: league.priority
        }));

        if (transformedGames.length > 0) {
          allGames.push({
            league: league.name,
            country: league.country,
            flag: league.flag,
            games: transformedGames,
            priority: league.priority
          });
        }
      } catch (error) {
        console.error(`Error fetching ${league.key}:`, error);
      }
    }

    return allGames.sort((a, b) => a.priority - b.priority);
  }

  // Get baseball games organized by league priority
  async getBaseballGamesByPriority() {
    const baseballLeagues = [
      { name: 'MLB', key: 'baseball_mlb', country: 'USA', flag: '🇺🇸', priority: 1 },
      { name: 'NPB', key: 'baseball_npb', country: 'Japan', flag: '🇯🇵', priority: 2 },
      { name: 'KBO', key: 'baseball_kbo', country: 'South Korea', flag: '🇰🇷', priority: 3 }
    ];

    const allGames = [];

    for (const league of baseballLeagues) {
      try {
        const games = await this.getOdds(league.key);
        console.log(`Fetched ${games.length} events for ${league.key}`);
        
        const transformedGames = games.map(game => ({
          ...game,
          league_name: league.name,
          country: league.country,
          country_flag: league.flag,
          priority: league.priority
        }));

        if (transformedGames.length > 0) {
          allGames.push({
            league: league.name,
            country: league.country,
            flag: league.flag,
            games: transformedGames,
            priority: league.priority
          });
        }
      } catch (error) {
        console.error(`Error fetching ${league.key}:`, error);
      }
    }

    return allGames.sort((a, b) => a.priority - b.priority);
  }

  // Get volleyball games organized by league priority
  async getVolleyballGamesByPriority() {
    const volleyballLeagues = [
      { name: 'FIVB World Championship', key: 'volleyball_fivb_world_championship', country: 'International', flag: '🏐', priority: 1 },
      { name: 'FIVB Nations League', key: 'volleyball_fivb_nations_league', country: 'International', flag: '🏐', priority: 2 }
    ];

    const allGames = [];

    for (const league of volleyballLeagues) {
      try {
        const games = await this.getOdds(league.key);
        console.log(`Fetched ${games.length} events for ${league.key}`);
        
        const transformedGames = games.map(game => ({
          ...game,
          league_name: league.name,
          country: league.country,
          country_flag: league.flag,
          priority: league.priority
        }));

        if (transformedGames.length > 0) {
          allGames.push({
            league: league.name,
            country: league.country,
            flag: league.flag,
            games: transformedGames,
            priority: league.priority
          });
        }
      } catch (error) {
        console.error(`Error fetching ${league.key}:`, error);
      }
    }

    return allGames.sort((a, b) => a.priority - b.priority);
  }

  // Get football games organized by country priority
  async getFootballGamesByCountryPriority() {
    try {
      // Popular countries first (6 countries)
      const popularCountries = [
        { name: 'England', leagues: ['soccer_epl', 'soccer_england_league_one', 'soccer_england_league_two'] },
        { name: 'Spain', leagues: ['soccer_spain_la_liga', 'soccer_spain_segunda_division'] },
        { name: 'Germany', leagues: ['soccer_germany_bundesliga', 'soccer_germany_bundesliga2'] },
        { name: 'Italy', leagues: ['soccer_italy_serie_a', 'soccer_italy_serie_b'] },
        { name: 'France', leagues: ['soccer_france_ligue_one', 'soccer_france_ligue_two'] },
        { name: 'Brazil', leagues: ['soccer_brazil_campeonato', 'soccer_brazil_serie_b'] }
      ];

      // Additional countries A-Z
      const additionalCountries = [
        { name: 'Argentina', leagues: ['soccer_argentina_primera_division'] },
        { name: 'Australia', leagues: ['soccer_australia_aleague'] },
        { name: 'Austria', leagues: ['soccer_austria_bundesliga'] },
        { name: 'Belgium', leagues: ['soccer_belgium_first_div'] },
        { name: 'Chile', leagues: ['soccer_chile_campeonato'] },
        { name: 'Denmark', leagues: ['soccer_denmark_superliga'] },
        { name: 'Netherlands', leagues: ['soccer_netherlands_eredivisie'] },
        { name: 'Norway', leagues: ['soccer_norway_eliteserien'] },
        { name: 'Poland', leagues: ['soccer_poland_ekstraklasa'] },
        { name: 'Portugal', leagues: ['soccer_portugal_primeira_liga'] },
        { name: 'Sweden', leagues: ['soccer_sweden_allsvenskan'] },
        { name: 'Switzerland', leagues: ['soccer_switzerland_superleague'] },
        { name: 'Turkey', leagues: ['soccer_turkey_super_league'] },
        { name: 'USA', leagues: ['soccer_usa_mls'] }
      ];

      const allCountries = [...popularCountries, ...additionalCountries];
      const allGames = [];

      // Fetch games for each country (limit to first few for initial load)
      for (const country of allCountries.slice(0, 8)) {
        const countryGames = [];
        
        for (const league of country.leagues.slice(0, 1)) { // Get main league first
          try {
            const games = await this.getOdds(league);
            countryGames.push(...games.map(game => ({
              ...game,
              country: country.name,
              league_name: this.getLeagueName(league),
              country_flag: this.getCountryFlag(country.name)
            })));
          } catch (error) {
            log(`Error fetching ${league}: ${error}`);
          }
        }

        if (countryGames.length > 0) {
          allGames.push({
            country: country.name,
            flag: this.getCountryFlag(country.name),
            games: countryGames,
            isPopular: popularCountries.some(pc => pc.name === country.name)
          });
        }
      }

      return allGames;
    } catch (error) {
      log(`Error in getFootballGamesByCountryPriority: ${error}`);
      throw error;
    }
  }

  private getLeagueName(sportKey: string): string {
    const leagueNames: { [key: string]: string } = {
      'soccer_epl': 'Premier League',
      'soccer_spain_la_liga': 'La Liga',
      'soccer_germany_bundesliga': 'Bundesliga',
      'soccer_italy_serie_a': 'Serie A',
      'soccer_france_ligue_one': 'Ligue 1',
      'soccer_brazil_campeonato': 'Serie A',
      'soccer_argentina_primera_division': 'Primera División',
      'soccer_australia_aleague': 'A-League',
      'soccer_austria_bundesliga': 'Bundesliga',
      'soccer_belgium_first_div': 'First Division A',
      'soccer_chile_campeonato': 'Primera División',
      'soccer_denmark_superliga': 'Superliga',
      'soccer_netherlands_eredivisie': 'Eredivisie',
      'soccer_norway_eliteserien': 'Eliteserien',
      'soccer_poland_ekstraklasa': 'Ekstraklasa',
      'soccer_portugal_primeira_liga': 'Primeira Liga',
      'soccer_sweden_allsvenskan': 'Allsvenskan',
      'soccer_switzerland_superleague': 'Super League',
      'soccer_turkey_super_league': 'Süper Lig',
      'soccer_usa_mls': 'MLS'
    };
    return leagueNames[sportKey] || sportKey.replace('soccer_', '').replace(/_/g, ' ');
  }

  // Get international competitions with real data
  async getInternationalCompetitions() {
    const internationalLeagues = [
      { name: 'UEFA Nations League', key: 'soccer_uefa_nations_league', priority: 1 },
      { name: 'World Cup Qualification UEFA', key: 'soccer_uefa_euro_qualification', priority: 2 },
      { name: 'WC Qual. CONMEBOL', key: 'soccer_conmebol_copa_america', priority: 3 },
      { name: 'WC Qualification, AFC', key: 'soccer_afc_asian_cup', priority: 4 },
      { name: 'Copa Sudamericana', key: 'soccer_conmebol_copa_sudamericana', priority: 5 },
      { name: 'UEFA Super Cup', key: 'soccer_uefa_super_cup', priority: 6 },
      { name: 'FIFA Club World Cup', key: 'soccer_fifa_world_cup', priority: 7 },
      { name: 'Int. Friendly Games', key: 'soccer_international_friendlies', priority: 8 },
      { name: 'World Cup Qualification CONCACAF', key: 'soccer_concacaf_gold_cup', priority: 9 },
      { name: 'UEFA Nations League, Women', key: 'soccer_uefa_womens_euro', priority: 10 }
    ];

    const availableLeagues = [];

    for (const league of internationalLeagues) {
      try {
        const games = await this.getOdds(league.key);
        if (games.length > 0) {
          availableLeagues.push({
            name: league.name,
            key: league.key,
            gameCount: games.length,
            priority: league.priority
          });
        }
      } catch (error) {
        console.log(`League ${league.name} not available`);
      }
    }

    return availableLeagues.sort((a, b) => a.priority - b.priority);
  }

  // Get dynamic top countries with real data
  async getTopCountriesWithData() {
    const topCountries = [
      { name: 'England', leagues: ['soccer_epl', 'soccer_england_league_one', 'soccer_england_league_two'], flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', priority: 1 },
      { name: 'Spain', leagues: ['soccer_spain_la_liga', 'soccer_spain_segunda_division'], flag: '🇪🇸', priority: 2 },
      { name: 'Germany', leagues: ['soccer_germany_bundesliga', 'soccer_germany_bundesliga2'], flag: '🇩🇪', priority: 3 },
      { name: 'Italy', leagues: ['soccer_italy_serie_a', 'soccer_italy_serie_b'], flag: '🇮🇹', priority: 4 },
      { name: 'France', leagues: ['soccer_france_ligue_one', 'soccer_france_ligue_two'], flag: '🇫🇷', priority: 5 },
      { name: 'Brazil', leagues: ['soccer_brazil_campeonato', 'soccer_brazil_serie_b'], flag: '🇧🇷', priority: 6 },
      { name: 'USA', leagues: ['soccer_usa_mls'], flag: '🇺🇸', priority: 7 },
      { name: 'Argentina', leagues: ['soccer_argentina_primera_division'], flag: '🇦🇷', priority: 8 },
      { name: 'Netherlands', leagues: ['soccer_netherlands_eredivisie'], flag: '🇳🇱', priority: 9 },
      { name: 'Portugal', leagues: ['soccer_portugal_primeira_liga'], flag: '🇵🇹', priority: 10 },
      { name: 'Belgium', leagues: ['soccer_belgium_first_div'], flag: '🇧🇪', priority: 11 },
      { name: 'Turkey', leagues: ['soccer_turkey_super_league'], flag: '🇹🇷', priority: 12 }
    ];

    const availableCountries = [];

    for (const country of topCountries) {
      const availableLeagues = [];
      let totalGames = 0;

      for (const leagueKey of country.leagues) {
        try {
          const games = await this.getOdds(leagueKey);
          if (games.length > 0) {
            availableLeagues.push(this.getLeagueName(leagueKey));
            totalGames += games.length;
          }
        } catch (error) {
          console.log(`League ${leagueKey} not available for ${country.name}`);
        }
      }

      if (availableLeagues.length > 0) {
        availableCountries.push({
          id: country.name.toLowerCase(),
          name: country.name,
          flag: country.flag,
          leagues: availableLeagues,
          gameCount: totalGames,
          priority: country.priority
        });
      }
    }

    return availableCountries.sort((a, b) => a.priority - b.priority);
  }

  // Get dynamic other countries with real data
  async getOtherCountriesWithData() {
    const otherCountries = [
      { name: 'Russia', leagues: ['soccer_russia_premier_league'], flag: '🇷🇺', priority: 1 },
      { name: 'Mexico', leagues: ['soccer_mexico_ligamx'], flag: '🇲🇽', priority: 2 },
      { name: 'Japan', leagues: ['soccer_japan_j_league'], flag: '🇯🇵', priority: 3 },
      { name: 'Australia', leagues: ['soccer_australia_aleague'], flag: '🇦🇺', priority: 4 },
      { name: 'China', leagues: ['soccer_china_superleague'], flag: '🇨🇳', priority: 5 },
      { name: 'South Korea', leagues: ['soccer_south_korea_kleague1'], flag: '🇰🇷', priority: 6 },
      { name: 'Greece', leagues: ['soccer_greece_super_league'], flag: '🇬🇷', priority: 7 },
      { name: 'Scotland', leagues: ['soccer_scotland_premiership'], flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', priority: 8 },
      { name: 'Norway', leagues: ['soccer_norway_eliteserien'], flag: '🇳🇴', priority: 9 },
      { name: 'Sweden', leagues: ['soccer_sweden_allsvenskan'], flag: '🇸🇪', priority: 10 },
      { name: 'Denmark', leagues: ['soccer_denmark_superliga'], flag: '🇩🇰', priority: 11 },
      { name: 'Switzerland', leagues: ['soccer_switzerland_superleague'], flag: '🇨🇭', priority: 12 },
      { name: 'Austria', leagues: ['soccer_austria_bundesliga'], flag: '🇦🇹', priority: 13 },
      { name: 'Poland', leagues: ['soccer_poland_ekstraklasa'], flag: '🇵🇱', priority: 14 },
      { name: 'Chile', leagues: ['soccer_chile_campeonato'], flag: '🇨🇱', priority: 15 }
    ];

    const availableCountries = [];

    for (const country of otherCountries) {
      const availableLeagues = [];
      let totalGames = 0;

      for (const leagueKey of country.leagues) {
        try {
          const games = await this.getOdds(leagueKey);
          if (games.length > 0) {
            availableLeagues.push(this.getLeagueName(leagueKey));
            totalGames += games.length;
          }
        } catch (error) {
          console.log(`League ${leagueKey} not available for ${country.name}`);
        }
      }

      if (availableLeagues.length > 0) {
        availableCountries.push({
          id: country.name.toLowerCase().replace(' ', '_'),
          name: country.name,
          flag: country.flag,
          leagues: availableLeagues,
          gameCount: totalGames,
          priority: country.priority
        });
      }
    }

    return availableCountries.sort((a, b) => a.priority - b.priority);
  }

  private getCountryFlag(countryName: string): string {
    const flags: { [key: string]: string } = {
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'France': '🇫🇷',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Australia': '🇦🇺',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Chile': '🇨🇱',
      'Denmark': '🇩🇰',
      'Netherlands': '🇳🇱',
      'Norway': '🇳🇴',
      'Poland': '🇵🇱',
      'Portugal': '🇵🇹',
      'Sweden': '🇸🇪',
      'Switzerland': '🇨🇭',
      'Turkey': '🇹🇷',
      'USA': '🇺🇸'
    };
    return flags[countryName] || '⚽';
  }
}

export const oddsApiService = new OddsApiService();