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
}

export const oddsApiService = new OddsApiService();