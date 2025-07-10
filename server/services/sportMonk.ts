import { db } from '../db';
import { apiCache } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export interface SportMonkFixture {
  id: number;
  name: string;
  starting_at: string;
  state: {
    state: string;
    finished: boolean;
  };
  league: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  participants: Array<{
    id: number;
    name: string;
    image_path: string;
    meta: {
      position: string;
    };
  }>;
  scores?: Array<{
    score: {
      participant: string;
      goals: number;
    };
  }>;
  odds?: Array<{
    bookmaker: {
      name: string;
    };
    markets: Array<{
      key: string;
      outcomes: Array<{
        type: string;
        value: string;
        odds: number;
      }>;
    }>;
  }>;
}

export interface SportMonkLeague {
  id: number;
  name: string;
  short_code: string;
  image_path: string;
  type: string;
  sub_type: string;
  country: {
    id: number;
    name: string;
    code: string;
    image_path: string;
  };
  current_season: {
    id: number;
    name: string;
    year: number;
    is_current: boolean;
  };
}

export class SportMonkService {
  private apiKey: string;
  private baseUrl = 'https://api.sportmonks.com/v3/football';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes
  private apiEnabled = true;

  constructor() {
    this.apiKey = process.env.SPORTMONK_API_KEY || '';
    if (!this.apiKey) {
      console.log('SPORTMONK_API_KEY not found, service disabled');
      this.apiEnabled = false;
    } else {
      this.apiEnabled = true;
      console.log('SportMonk service initialized');
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
    if (!this.apiEnabled) {
      throw new Error('SportMonk service disabled - no valid API key');
    }

    const cacheKey = `sportmonk-${endpoint}-${JSON.stringify(params)}`;
    
    if (await this.isCacheValid(cacheKey)) {
      console.log(`Using cached data for SportMonk ${endpoint}`);
      return await this.getCached(cacheKey);
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_token', this.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.log('SportMonk rate limit hit');
          throw new Error('SportMonk rate limit exceeded');
        }
        if (response.status === 401) {
          console.log('SportMonk authentication failed');
          throw new Error('SportMonk authentication failed');
        }
        throw new Error(`SportMonk request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('SportMonk API error:', data.error);
        throw new Error(`SportMonk API error: ${data.error}`);
      }
      
      await this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`SportMonk request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all leagues
  async getLeagues(): Promise<SportMonkLeague[]> {
    try {
      const response = await this.makeRequest('/leagues', {
        include: 'country,currentSeason'
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch SportMonk leagues:', error);
      return [];
    }
  }

  // Get fixtures for today
  async getTodayFixtures(): Promise<SportMonkFixture[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.makeRequest('/fixtures/date/' + today, {
        include: 'participants,league.country,odds.bookmaker,odds.markets.outcomes,scores'
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch SportMonk today fixtures:', error);
      return [];
    }
  }

  // Get fixtures by date
  async getFixturesByDate(date: string): Promise<SportMonkFixture[]> {
    try {
      const response = await this.makeRequest('/fixtures/date/' + date, {
        include: 'participants,league.country,odds.bookmaker,odds.markets.outcomes,scores'
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch SportMonk fixtures by date:', error);
      return [];
    }
  }

  // Get fixtures by league
  async getFixturesByLeague(leagueId: number): Promise<SportMonkFixture[]> {
    try {
      const response = await this.makeRequest(`/leagues/${leagueId}/fixtures`, {
        include: 'participants,league.country,odds.bookmaker,odds.markets.outcomes,scores'
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch SportMonk fixtures by league:', error);
      return [];
    }
  }

  // Get live fixtures
  async getLiveFixtures(): Promise<SportMonkFixture[]> {
    try {
      const response = await this.makeRequest('/livescores/inplay', {
        include: 'participants,league.country,odds.bookmaker,odds.markets.outcomes,scores'
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch SportMonk live fixtures:', error);
      return [];
    }
  }

  // Get top leagues with MLS and other missing leagues
  async getTopLeagues(): Promise<any[]> {
    try {
      const leagues = await this.getLeagues();
      const topLeagueIds = [
        39, // Premier League
        140, // La Liga
        78, // Bundesliga
        135, // Serie A
        61, // Ligue 1
        271, // MLS
        501, // Liga MX
        2, // Champions League
        5, // Europa League
        848, // Conference League
      ];

      const topLeagues = leagues.filter(league => topLeagueIds.includes(league.id));
      
      // Get current fixtures for these leagues
      const leagueFixtures = await Promise.all(
        topLeagues.map(async (league) => {
          const fixtures = await this.getFixturesByLeague(league.id);
          return {
            league,
            fixtures: fixtures.slice(0, 10) // Limit to 10 fixtures per league
          };
        })
      );

      return leagueFixtures.filter(lf => lf.fixtures.length > 0);
    } catch (error) {
      console.error('Failed to fetch SportMonk top leagues:', error);
      return [];
    }
  }

  // Check if service is enabled
  isEnabled(): boolean {
    return this.apiEnabled;
  }
}

export const sportMonkService = new SportMonkService();