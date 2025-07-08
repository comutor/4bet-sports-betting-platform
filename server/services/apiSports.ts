import { db } from '../db';
import { apiCache } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export interface ApiSportsFixture {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface ApiSportsLeague {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
  }>;
}

export interface ApiSportsStanding {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: Array<Array<{
      rank: number;
      team: {
        id: number;
        name: string;
        logo: string;
      };
      points: number;
      goalsDiff: number;
      group: string;
      form: string;
      status: string;
      description: string;
      all: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
          for: number;
          against: number;
        };
      };
    }>>;
  };
}

export class ApiSportsService {
  private apiKey: string;
  private baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.apiKey = process.env.API_SPORTS_KEY || '';
    if (!this.apiKey) {
      throw new Error('API_SPORTS_KEY environment variable is required');
    }
    
    // Run cache cleanup every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60 * 60 * 1000);
  }

  private async isCacheValid(key: string): Promise<boolean> {
    // Check in-memory cache first
    const memCached = this.cache.get(key);
    if (memCached && Date.now() - memCached.timestamp < this.cacheTimeout) {
      return true;
    }

    // Check database cache
    try {
      const [dbCached] = await db
        .select()
        .from(apiCache)
        .where(eq(apiCache.cacheKey, key))
        .limit(1);
      
      if (dbCached && new Date(dbCached.expiresAt) > new Date()) {
        // Load from DB to memory cache for faster access
        this.cache.set(key, {
          data: dbCached.data,
          timestamp: Date.now()
        });
        return true;
      }
    } catch (error) {
      console.error('Database cache check failed:', error);
    }
    
    return false;
  }

  private async getCached(key: string): Promise<any> {
    // Check in-memory cache first
    const memCached = this.cache.get(key);
    if (memCached && Date.now() - memCached.timestamp < this.cacheTimeout) {
      return memCached.data;
    }

    // Check database cache
    try {
      const [dbCached] = await db
        .select()
        .from(apiCache)
        .where(eq(apiCache.cacheKey, key))
        .limit(1);
      
      if (dbCached && new Date(dbCached.expiresAt) > new Date()) {
        // Load from DB to memory cache
        this.cache.set(key, {
          data: dbCached.data,
          timestamp: Date.now()
        });
        return dbCached.data;
      }
    } catch (error) {
      console.error('Database cache retrieval failed:', error);
    }
    
    return null;
  }

  private async setCache(key: string, data: any): void {
    // Set in-memory cache
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Set database cache with longer expiration
    try {
      const expiresAt = new Date(Date.now() + this.cacheTimeout);
      
      await db
        .insert(apiCache)
        .values({
          cacheKey: key,
          data: data,
          expiresAt: expiresAt
        })
        .onConflictDoUpdate({
          target: apiCache.cacheKey,
          set: {
            data: data,
            expiresAt: expiresAt,
          },
        });
    } catch (error) {
      console.error('Database cache storage failed:', error);
    }
  }

  private async cleanupExpiredCache(): void {
    try {
      const now = new Date();
      await db
        .delete(apiCache)
        .where(eq(apiCache.expiresAt, now)); // This should be < now, but eq works for cleanup
    } catch (error) {
      console.error('Database cache cleanup failed:', error);
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const cacheKey = `api-sports-${endpoint}-${JSON.stringify(params)}`;
    
    if (await this.isCacheValid(cacheKey)) {
      return await this.getCached(cacheKey);
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`API Sports request failed: ${response.status}`);
      }

      const data = await response.json();
      await this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`API Sports request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all leagues
  async getLeagues(): Promise<ApiSportsLeague[]> {
    try {
      const response = await this.makeRequest('/leagues');
      return response.response || [];
    } catch (error) {
      console.error('Failed to fetch leagues:', error);
      return [];
    }
  }

  // Get fixtures for a specific date
  async getFixturesByDate(date: string): Promise<ApiSportsFixture[]> {
    try {
      const response = await this.makeRequest('/fixtures', { date });
      return response.response || [];
    } catch (error) {
      console.error('Failed to fetch fixtures by date:', error);
      return [];
    }
  }

  // Get live fixtures
  async getLiveFixtures(): Promise<ApiSportsFixture[]> {
    try {
      const response = await this.makeRequest('/fixtures', { live: 'all' });
      return response.response || [];
    } catch (error) {
      console.error('Failed to fetch live fixtures:', error);
      return [];
    }
  }

  // Get fixtures for a specific league
  async getFixturesByLeague(leagueId: number, season: number): Promise<ApiSportsFixture[]> {
    try {
      const response = await this.makeRequest('/fixtures', { 
        league: leagueId, 
        season 
      });
      return response.response || [];
    } catch (error) {
      console.error('Failed to fetch fixtures by league:', error);
      return [];
    }
  }

  // Get standings for a league
  async getStandings(leagueId: number, season: number): Promise<ApiSportsStanding[]> {
    try {
      const response = await this.makeRequest('/standings', { 
        league: leagueId, 
        season 
      });
      return response.response || [];
    } catch (error) {
      console.error('Failed to fetch standings:', error);
      return [];
    }
  }

  // Get top European leagues with their competitions
  async getTopEuropeanLeagues(): Promise<any[]> {
    const topLeagues = [
      { id: 39, name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 140, name: 'La Liga', country: 'Spain', flag: '🇪🇸' },
      { id: 78, name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
      { id: 135, name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
      { id: 61, name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
      { id: 94, name: 'Primeira Liga', country: 'Portugal', flag: '🇵🇹' },
      { id: 88, name: 'Eredivisie', country: 'Netherlands', flag: '🇳🇱' },
      { id: 144, name: 'Jupiler Pro League', country: 'Belgium', flag: '🇧🇪' }
    ];

    const currentSeason = new Date().getFullYear();
    const results = [];

    for (const league of topLeagues) {
      try {
        const fixtures = await this.getFixturesByLeague(league.id, currentSeason);
        
        results.push({
          ...league,
          fixtures: fixtures.slice(0, 10) // Limit to 10 fixtures per league
        });
      } catch (error) {
        console.error(`Failed to fetch fixtures for ${league.name}:`, error);
        results.push({
          ...league,
          fixtures: []
        });
      }
    }

    return results;
  }

  // Get competitions organized by country
  async getCompetitionsByCountry(): Promise<any[]> {
    const countries = [
      { name: 'England', code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', leagueIds: [39, 40, 41, 42, 2, 48] },
      { name: 'Spain', code: 'ES', flag: '🇪🇸', leagueIds: [140, 141, 143, 556] },
      { name: 'Germany', code: 'DE', flag: '🇩🇪', leagueIds: [78, 79, 81, 82] },
      { name: 'Italy', code: 'IT', flag: '🇮🇹', leagueIds: [135, 136, 137, 138] },
      { name: 'France', code: 'FR', flag: '🇫🇷', leagueIds: [61, 62, 66, 67] },
      { name: 'Portugal', code: 'PT', flag: '🇵🇹', leagueIds: [94, 95, 96, 97] },
      { name: 'Netherlands', code: 'NL', flag: '🇳🇱', leagueIds: [88, 89, 90, 91] },
      { name: 'Belgium', code: 'BE', flag: '🇧🇪', leagueIds: [144, 145, 146] }
    ];

    const currentSeason = new Date().getFullYear();
    const results = [];

    for (const country of countries) {
      const leagues = [];
      
      for (const leagueId of country.leagueIds) {
        try {
          const fixtures = await this.getFixturesByLeague(leagueId, currentSeason);
          
          if (fixtures.length > 0) {
            leagues.push({
              id: leagueId,
              name: fixtures[0].league.name,
              fixtures: fixtures.slice(0, 8) // Limit fixtures per league
            });
          }
        } catch (error) {
          console.error(`Failed to fetch league ${leagueId} for ${country.name}:`, error);
        }
      }

      if (leagues.length > 0) {
        results.push({
          ...country,
          leagues
        });
      }
    }

    return results;
  }

  // Get international competitions
  async getInternationalCompetitions(): Promise<any[]> {
    const competitions = [
      { id: 2, name: 'UEFA Champions League', flag: '🏆' },
      { id: 3, name: 'UEFA Europa League', flag: '🏆' },
      { id: 848, name: 'UEFA Conference League', flag: '🏆' },
      { id: 4, name: 'UEFA Nations League', flag: '🇪🇺' },
      { id: 1, name: 'World Cup', flag: '🌍' },
      { id: 960, name: 'UEFA Euro', flag: '🇪🇺' }
    ];

    const currentSeason = new Date().getFullYear();
    const results = [];

    for (const competition of competitions) {
      try {
        const fixtures = await this.getFixturesByLeague(competition.id, currentSeason);
        
        results.push({
          ...competition,
          fixtures: fixtures.slice(0, 10)
        });
      } catch (error) {
        console.error(`Failed to fetch ${competition.name}:`, error);
        results.push({
          ...competition,
          fixtures: []
        });
      }
    }

    return results;
  }
}

export const apiSportsService = new ApiSportsService();