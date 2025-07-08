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
  private apiEnabled = false; // Temporarily disable until valid key

  constructor() {
    this.apiKey = process.env.API_SPORTS_KEY || '';
    if (!this.apiKey) {
      console.log('API_SPORTS_KEY not found, using fallback to Odds API');
      this.apiEnabled = false;
    } else {
      this.apiEnabled = true;
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
      throw new Error('API Sports service disabled - no valid subscription');
    }

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
        if (response.status === 429) {
          throw new Error('API Sports rate limit exceeded');
        }
        throw new Error(`API Sports request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if response indicates subscription issue
      if (data.message && data.message.includes('not subscribed')) {
        this.apiEnabled = false;
        throw new Error('API Sports subscription invalid');
      }
      
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

  // Get top European leagues with rate limiting for free tier
  async getTopEuropeanLeagues(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const fixtures = await this.getFixturesByDate(today);
      
      // Filter for top leagues
      const topLeagueNames = [
        'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1',
        'Champions League', 'Europa League', 'Conference League'
      ];
      
      const topLeagueFixtures = fixtures.filter(fixture => 
        topLeagueNames.some(league => 
          fixture.league.name.includes(league)
        )
      );
      
      // Group by league
      const leaguesMap = new Map();
      
      topLeagueFixtures.forEach(fixture => {
        const leagueName = fixture.league.name;
        if (!leaguesMap.has(leagueName)) {
          leaguesMap.set(leagueName, {
            id: fixture.league.id,
            name: leagueName,
            country: fixture.league.country,
            flag: this.getCountryFlag(fixture.league.country),
            fixtures: []
          });
        }
        leaguesMap.get(leagueName).fixtures.push(fixture);
      });
      
      return Array.from(leaguesMap.values());
    } catch (error) {
      console.error('Failed to fetch top European leagues:', error);
      return [];
    }
  }

  // Get competitions organized by country with rate limiting
  async getCompetitionsByCountry(): Promise<any[]> {
    // For free tier, limit to just Premier League to avoid rate limits
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const fixtures = await this.getFixturesByDate(today);
      
      const countriesData = [];
      const countries = new Map();
      
      // Group fixtures by country and league
      fixtures.forEach(fixture => {
        const countryName = fixture.league.country;
        const leagueName = fixture.league.name;
        
        if (!countries.has(countryName)) {
          countries.set(countryName, {
            name: countryName,
            flag: this.getCountryFlag(countryName),
            leagues: new Map()
          });
        }
        
        const country = countries.get(countryName);
        if (!country.leagues.has(leagueName)) {
          country.leagues.set(leagueName, {
            id: fixture.league.id,
            name: leagueName,
            fixtures: []
          });
        }
        
        country.leagues.get(leagueName).fixtures.push(fixture);
      });
      
      // Convert to expected format
      countries.forEach(country => {
        if (country.leagues.size > 0) {
          countriesData.push({
            name: country.name,
            flag: country.flag,
            leagues: Array.from(country.leagues.values())
          });
        }
      });
      
      return countriesData;
    } catch (error) {
      console.error('Failed to fetch competitions by country:', error);
      return [];
    }
  }

  private getCountryFlag(countryName: string): string {
    const flagMap: { [key: string]: string } = {
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'France': '🇫🇷',
      'Portugal': '🇵🇹',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Mexico': '🇲🇽',
      'USA': '🇺🇸',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺'
    };
    return flagMap[countryName] || '🏳️';
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