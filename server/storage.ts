import { 
  users, 
  sportsEvents, 
  bettingMarkets, 
  betslipItems, 
  casinoGames,
  type User, 
  type InsertUser,
  type SportsEvent,
  type InsertSportsEvent,
  type BettingMarket,
  type InsertBettingMarket,
  type BetslipItem,
  type InsertBetslipItem,
  type CasinoGame,
  type InsertCasinoGame
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSportsEvents(): Promise<SportsEvent[]>;
  getLiveEvents(): Promise<SportsEvent[]>;
  getEventsByCategory(sport: string): Promise<SportsEvent[]>;
  createSportsEvent(event: InsertSportsEvent): Promise<SportsEvent>;
  
  getBettingMarkets(eventId: number): Promise<BettingMarket[]>;
  createBettingMarket(market: InsertBettingMarket): Promise<BettingMarket>;
  
  getBetslipItems(userId: number): Promise<BetslipItem[]>;
  addToBetslip(item: InsertBetslipItem): Promise<BetslipItem>;
  removeFromBetslip(id: number): Promise<void>;
  
  getCasinoGames(): Promise<CasinoGame[]>;
  getCasinoGamesByCategory(category: string): Promise<CasinoGame[]>;
  createCasinoGame(game: InsertCasinoGame): Promise<CasinoGame>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sportsEvents: Map<number, SportsEvent>;
  private bettingMarkets: Map<number, BettingMarket>;
  private betslipItems: Map<number, BetslipItem>;
  private casinoGames: Map<number, CasinoGame>;
  private currentUserId: number;
  private currentEventId: number;
  private currentMarketId: number;
  private currentBetslipId: number;
  private currentGameId: number;

  constructor() {
    this.users = new Map();
    this.sportsEvents = new Map();
    this.bettingMarkets = new Map();
    this.betslipItems = new Map();
    this.casinoGames = new Map();
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentMarketId = 1;
    this.currentBetslipId = 1;
    this.currentGameId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample sports events
    const events: SportsEvent[] = [
      {
        id: this.currentEventId++,
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        homeScore: 2,
        awayScore: 1,
        sport: "football",
        league: "Premier League",
        status: "live",
        startTime: new Date(),
        currentTime: "85:30"
      },
      {
        id: this.currentEventId++,
        homeTeam: "Chelsea",
        awayTeam: "Arsenal",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Premier League",
        status: "upcoming",
        startTime: new Date(Date.now() + 3600000),
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "Lakers",
        awayTeam: "Warriors",
        homeScore: 89,
        awayScore: 92,
        sport: "basketball",
        league: "NBA",
        status: "live",
        startTime: new Date(),
        currentTime: "Q3 08:45"
      }
    ];

    events.forEach(event => this.sportsEvents.set(event.id, event));

    // Initialize betting markets
    const markets: BettingMarket[] = [
      {
        id: this.currentMarketId++,
        eventId: 1,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.10",
        drawOdds: "3.40",
        awayOdds: "3.80"
      },
      {
        id: this.currentMarketId++,
        eventId: 2,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.75",
        drawOdds: "3.20",
        awayOdds: "2.85"
      },
      {
        id: this.currentMarketId++,
        eventId: 3,
        marketType: "moneyline",
        marketName: "Winner",
        homeOdds: "1.85",
        drawOdds: null,
        awayOdds: "1.95"
      }
    ];

    markets.forEach(market => this.bettingMarkets.set(market.id, market));

    // Initialize casino games
    const games: CasinoGame[] = [
      {
        id: this.currentGameId++,
        name: "Diamond Rush",
        category: "slots",
        jackpotAmount: "2400000.00",
        rtp: "96.50",
        isLive: false
      },
      {
        id: this.currentGameId++,
        name: "Blackjack Classic",
        category: "table_games",
        jackpotAmount: null,
        rtp: "99.50",
        isLive: false
      },
      {
        id: this.currentGameId++,
        name: "European Roulette",
        category: "live_dealer",
        jackpotAmount: null,
        rtp: "97.30",
        isLive: true
      },
      {
        id: this.currentGameId++,
        name: "Mega Fortune",
        category: "jackpots",
        jackpotAmount: "8100000.00",
        rtp: "96.60",
        isLive: false
      }
    ];

    games.forEach(game => this.casinoGames.set(game.id, game));

    // Initialize demo users
    const demoUsers: User[] = [
      {
        id: this.currentUserId++,
        firstName: "John",
        lastName: "Smith",
        username: "john_smith",
        password: "password123",
        country: "South Sudan",
        phoneNumber: "912345678",
        promoCode: null,
        balance: "1250.00"
      },
      {
        id: this.currentUserId++,
        firstName: "Maria",
        lastName: "Garcia",
        username: "maria_garcia",
        password: "password123",
        country: "Uganda",
        phoneNumber: "701234567",
        promoCode: "WELCOME",
        balance: "850.00"
      },
      {
        id: this.currentUserId++,
        firstName: "Ahmed",
        lastName: "Hassan",
        username: "ahmed_hassan",
        password: "password123",
        country: "South Sudan",
        phoneNumber: "955123456",
        promoCode: null,
        balance: "2100.00"
      }
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phoneNumber === phoneNumber,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Auto-generate username from first and last name
    const username = `${insertUser.firstName.toLowerCase()}_${insertUser.lastName.toLowerCase()}`;
    const user: User = { 
      id,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      username,
      password: insertUser.password,
      country: insertUser.country,
      phoneNumber: insertUser.phoneNumber || null,
      promoCode: insertUser.promoCode || null,
      balance: "1250.00" 
    };
    this.users.set(id, user);
    return user;
  }

  async getSportsEvents(): Promise<SportsEvent[]> {
    return Array.from(this.sportsEvents.values());
  }

  async getLiveEvents(): Promise<SportsEvent[]> {
    return Array.from(this.sportsEvents.values()).filter(
      event => event.status === "live"
    );
  }

  async getEventsByCategory(sport: string): Promise<SportsEvent[]> {
    return Array.from(this.sportsEvents.values()).filter(
      event => event.sport === sport
    );
  }

  async createSportsEvent(insertEvent: InsertSportsEvent): Promise<SportsEvent> {
    const id = this.currentEventId++;
    const event: SportsEvent = { ...insertEvent, id };
    this.sportsEvents.set(id, event);
    return event;
  }

  async getBettingMarkets(eventId: number): Promise<BettingMarket[]> {
    return Array.from(this.bettingMarkets.values()).filter(
      market => market.eventId === eventId
    );
  }

  async createBettingMarket(insertMarket: InsertBettingMarket): Promise<BettingMarket> {
    const id = this.currentMarketId++;
    const market: BettingMarket = { ...insertMarket, id };
    this.bettingMarkets.set(id, market);
    return market;
  }

  async getBetslipItems(userId: number): Promise<BetslipItem[]> {
    return Array.from(this.betslipItems.values()).filter(
      item => item.userId === userId
    );
  }

  async addToBetslip(insertItem: InsertBetslipItem): Promise<BetslipItem> {
    const id = this.currentBetslipId++;
    const item: BetslipItem = { ...insertItem, id };
    this.betslipItems.set(id, item);
    return item;
  }

  async removeFromBetslip(id: number): Promise<void> {
    this.betslipItems.delete(id);
  }

  async getCasinoGames(): Promise<CasinoGame[]> {
    return Array.from(this.casinoGames.values());
  }

  async getCasinoGamesByCategory(category: string): Promise<CasinoGame[]> {
    return Array.from(this.casinoGames.values()).filter(
      game => game.category === category
    );
  }

  async createCasinoGame(insertGame: InsertCasinoGame): Promise<CasinoGame> {
    const id = this.currentGameId++;
    const game: CasinoGame = { ...insertGame, id };
    this.casinoGames.set(id, game);
    return game;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Auto-generate username from first and last name
    const username = `${insertUser.firstName.toLowerCase()}_${insertUser.lastName.toLowerCase()}`;
    
    const userToInsert = {
      ...insertUser,
      username,
      balance: "1000.00" // Default starting balance
    };

    const [user] = await db
      .insert(users)
      .values(userToInsert)
      .returning();
    return user;
  }

  // Placeholder implementations for other methods (keeping interface compatibility)
  async getSportsEvents(): Promise<SportsEvent[]> {
    return [];
  }

  async getLiveEvents(): Promise<SportsEvent[]> {
    return [];
  }

  async getEventsByCategory(sport: string): Promise<SportsEvent[]> {
    return [];
  }

  async createSportsEvent(event: InsertSportsEvent): Promise<SportsEvent> {
    const [created] = await db.insert(sportsEvents).values(event).returning();
    return created;
  }

  async getBettingMarkets(eventId: number): Promise<BettingMarket[]> {
    return [];
  }

  async createBettingMarket(market: InsertBettingMarket): Promise<BettingMarket> {
    const [created] = await db.insert(bettingMarkets).values(market).returning();
    return created;
  }

  async getBetslipItems(userId: number): Promise<BetslipItem[]> {
    return [];
  }

  async addToBetslip(item: InsertBetslipItem): Promise<BetslipItem> {
    const [created] = await db.insert(betslipItems).values(item).returning();
    return created;
  }

  async removeFromBetslip(id: number): Promise<void> {
    await db.delete(betslipItems).where(eq(betslipItems.id, id));
  }

  async getCasinoGames(): Promise<CasinoGame[]> {
    return [];
  }

  async getCasinoGamesByCategory(category: string): Promise<CasinoGame[]> {
    return [];
  }

  async createCasinoGame(game: InsertCasinoGame): Promise<CasinoGame> {
    const [created] = await db.insert(casinoGames).values(game).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
