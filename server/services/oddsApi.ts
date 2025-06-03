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

  constructor() {
    this.apiKey = process.env.ODDS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ODDS_API_KEY environment variable is required');
    }
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
    try {
      const url = `${this.baseUrl}/sports/${sportKey}/odds/?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const events = await response.json();
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