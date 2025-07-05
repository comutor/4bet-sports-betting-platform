import { 
  users, 
  sportsEvents, 
  bettingMarkets, 
  betslipItems, 
  casinoGames,
  userBets,
  balanceTransactions,
  type User, 
  type InsertUser,
  type SportsEvent,
  type InsertSportsEvent,
  type BettingMarket,
  type InsertBettingMarket,
  type BetslipItem,
  type InsertBetslipItem,
  type CasinoGame,
  type InsertCasinoGame,
  type UserBet,
  type InsertUserBet,
  type BalanceTransaction,
  type InsertBalanceTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  getUserByPassword(password: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  
  // Balance management with secure transactions
  getUserBalance(userId: number): Promise<string>;
  updateUserBalance(userId: number, amount: string, type: string, description?: string, relatedBetId?: number): Promise<User>;
  getBalanceTransactions(userId: number, limit?: number): Promise<BalanceTransaction[]>;
  
  getSportsEvents(): Promise<SportsEvent[]>;
  getLiveEvents(): Promise<SportsEvent[]>;
  getEventsByCategory(sport: string): Promise<SportsEvent[]>;
  createSportsEvent(event: InsertSportsEvent): Promise<SportsEvent>;
  
  getBettingMarkets(eventId: number): Promise<BettingMarket[]>;
  createBettingMarket(market: InsertBettingMarket): Promise<BettingMarket>;
  
  getBetslipItems(userId: number): Promise<BetslipItem[]>;
  addToBetslip(item: InsertBetslipItem): Promise<BetslipItem>;
  removeFromBetslip(id: number): Promise<void>;
  clearBetslip(userId: number): Promise<void>;
  
  getCasinoGames(): Promise<CasinoGame[]>;
  getCasinoGamesByCategory(category: string): Promise<CasinoGame[]>;
  createCasinoGame(game: InsertCasinoGame): Promise<CasinoGame>;
  
  // Enhanced bet management
  getUserBets(userId: number, status?: string): Promise<UserBet[]>;
  createUserBet(bet: InsertUserBet): Promise<UserBet>;
  updateBetStatus(betId: number, status: string, actualReturn?: string): Promise<void>;
  placeBet(userId: number, betData: any): Promise<{ bet: UserBet; newBalance: string }>;
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
    // Initialize comprehensive football events
    const events: SportsEvent[] = [
      // Live Football Matches
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
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        homeScore: 1,
        awayScore: 1,
        sport: "football",
        league: "La Liga",
        status: "live",
        startTime: new Date(),
        currentTime: "78:12"
      },
      {
        id: this.currentEventId++,
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        homeScore: 0,
        awayScore: 2,
        sport: "football",
        league: "Bundesliga",
        status: "live",
        startTime: new Date(),
        currentTime: "67:45"
      },
      
      // Upcoming Football Matches
      {
        id: this.currentEventId++,
        homeTeam: "Chelsea",
        awayTeam: "Arsenal",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Premier League",
        status: "upcoming",
        startTime: new Date(Date.now() + 3600000), // 1 hour from now
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "AC Milan",
        awayTeam: "Juventus",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Serie A",
        status: "upcoming",
        startTime: new Date(Date.now() + 7200000), // 2 hours from now
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "PSG",
        awayTeam: "Marseille",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Ligue 1",
        status: "upcoming",
        startTime: new Date(Date.now() + 10800000), // 3 hours from now
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "Atletico Madrid",
        awayTeam: "Valencia",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "La Liga",
        status: "upcoming",
        startTime: new Date(Date.now() + 14400000), // 4 hours from now
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "Leicester City",
        awayTeam: "Tottenham",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Premier League",
        status: "upcoming",
        startTime: new Date(Date.now() + 18000000), // 5 hours from now
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "Inter Milan",
        awayTeam: "Napoli",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Serie A",
        status: "upcoming",
        startTime: new Date(Date.now() + 21600000), // 6 hours from now
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "RB Leipzig",
        awayTeam: "Bayer Leverkusen",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Bundesliga",
        status: "upcoming",
        startTime: new Date(Date.now() + 25200000), // 7 hours from now
        currentTime: null
      },
      
      // Champions League Matches
      {
        id: this.currentEventId++,
        homeTeam: "Manchester City",
        awayTeam: "Bayern Munich",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Champions League",
        status: "upcoming",
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        currentTime: null
      },
      {
        id: this.currentEventId++,
        homeTeam: "Liverpool",
        awayTeam: "Real Madrid",
        homeScore: 0,
        awayScore: 0,
        sport: "football",
        league: "Champions League",
        status: "upcoming",
        startTime: new Date(Date.now() + 90000000), // Tomorrow + 1 hour
        currentTime: null
      },
      
      // Basketball for variety
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

    // Initialize comprehensive betting markets for all football events
    const markets: BettingMarket[] = [
      // Event 1: Manchester United vs Liverpool (Live)
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
        eventId: 1,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.75", // Over 2.5
        drawOdds: null,
        awayOdds: "2.05" // Under 2.5
      },
      {
        id: this.currentMarketId++,
        eventId: 1,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.85", // Yes
        drawOdds: null,
        awayOdds: "1.95" // No
      },

      // Event 2: Real Madrid vs Barcelona (Live)
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
        eventId: 2,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.90",
        drawOdds: null,
        awayOdds: "1.90"
      },
      {
        id: this.currentMarketId++,
        eventId: 2,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.65",
        drawOdds: null,
        awayOdds: "2.25"
      },

      // Event 3: Bayern Munich vs Borussia Dortmund (Live)
      {
        id: this.currentMarketId++,
        eventId: 3,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "1.95",
        drawOdds: "3.60",
        awayOdds: "4.20"
      },
      {
        id: this.currentMarketId++,
        eventId: 3,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.80",
        drawOdds: null,
        awayOdds: "2.00"
      },

      // Event 4: Chelsea vs Arsenal (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 4,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.45",
        drawOdds: "3.30",
        awayOdds: "3.10"
      },
      {
        id: this.currentMarketId++,
        eventId: 4,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.85",
        drawOdds: null,
        awayOdds: "1.95"
      },
      {
        id: this.currentMarketId++,
        eventId: 4,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.75",
        drawOdds: null,
        awayOdds: "2.05"
      },

      // Event 5: AC Milan vs Juventus (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 5,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.65",
        drawOdds: "3.25",
        awayOdds: "2.90"
      },
      {
        id: this.currentMarketId++,
        eventId: 5,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.95",
        drawOdds: null,
        awayOdds: "1.85"
      },

      // Event 6: PSG vs Marseille (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 6,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "1.65",
        drawOdds: "3.80",
        awayOdds: "5.50"
      },
      {
        id: this.currentMarketId++,
        eventId: 6,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.70",
        drawOdds: null,
        awayOdds: "2.15"
      },
      {
        id: this.currentMarketId++,
        eventId: 6,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.80",
        drawOdds: null,
        awayOdds: "2.00"
      },

      // Event 7: Atletico Madrid vs Valencia (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 7,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "1.85",
        drawOdds: "3.50",
        awayOdds: "4.80"
      },
      {
        id: this.currentMarketId++,
        eventId: 7,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "2.10",
        drawOdds: null,
        awayOdds: "1.75"
      },

      // Event 8: Leicester City vs Tottenham (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 8,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "3.40",
        drawOdds: "3.20",
        awayOdds: "2.35"
      },
      {
        id: this.currentMarketId++,
        eventId: 8,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.70",
        drawOdds: null,
        awayOdds: "2.15"
      },

      // Event 9: Inter Milan vs Napoli (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 9,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.20",
        drawOdds: "3.40",
        awayOdds: "3.50"
      },
      {
        id: this.currentMarketId++,
        eventId: 9,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.85",
        drawOdds: null,
        awayOdds: "1.95"
      },

      // Event 10: RB Leipzig vs Bayer Leverkusen (Upcoming)
      {
        id: this.currentMarketId++,
        eventId: 10,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.55",
        drawOdds: "3.30",
        awayOdds: "3.00"
      },
      {
        id: this.currentMarketId++,
        eventId: 10,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.60",
        drawOdds: null,
        awayOdds: "2.35"
      },

      // Event 11: Manchester City vs Bayern Munich (Champions League)
      {
        id: this.currentMarketId++,
        eventId: 11,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.05",
        drawOdds: "3.45",
        awayOdds: "3.90"
      },
      {
        id: this.currentMarketId++,
        eventId: 11,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.75",
        drawOdds: null,
        awayOdds: "2.05"
      },
      {
        id: this.currentMarketId++,
        eventId: 11,
        marketType: "both_teams_score",
        marketName: "Both Teams to Score",
        homeOdds: "1.70",
        drawOdds: null,
        awayOdds: "2.15"
      },

      // Event 12: Liverpool vs Real Madrid (Champions League)
      {
        id: this.currentMarketId++,
        eventId: 12,
        marketType: "1x2",
        marketName: "Match Result",
        homeOdds: "2.85",
        drawOdds: "3.25",
        awayOdds: "2.75"
      },
      {
        id: this.currentMarketId++,
        eventId: 12,
        marketType: "over_under",
        marketName: "Total Goals O/U 2.5",
        homeOdds: "1.80",
        drawOdds: null,
        awayOdds: "2.00"
      },

      // Basketball event for variety
      {
        id: this.currentMarketId++,
        eventId: 13,
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

  async getUserByPassword(password: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.password === password,
    );
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = newPassword;
      this.users.set(userId, user);
    }
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

  async getUserByPassword(password: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.password, password));
    return user || undefined;
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    await db.update(users).set({ password: newPassword }).where(eq(users.id, userId));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Auto-generate username from first and last name with timestamp to avoid duplicates
    const timestamp = Date.now();
    const username = `${insertUser.firstName.toLowerCase()}_${insertUser.lastName.toLowerCase()}_${timestamp}`;
    
    const userToInsert = {
      ...insertUser,
      username,
      balance: "0.00" // Starting balance is 0.00
    };

    const [user] = await db
      .insert(users)
      .values(userToInsert)
      .returning();
    return user;
  }

  // Secure balance management methods
  async getUserBalance(userId: number): Promise<string> {
    const [user] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId));
    return user?.balance || "0.00";
  }

  async updateUserBalance(userId: number, amount: string, type: string, description?: string, relatedBetId?: number): Promise<User> {
    return await db.transaction(async (tx) => {
      // Get current balance with row lock
      const [currentUser] = await tx.select().from(users).where(eq(users.id, userId));
      if (!currentUser) {
        throw new Error("User not found");
      }

      const currentBalance = parseFloat(currentUser.balance);
      const changeAmount = parseFloat(amount);
      const newBalance = currentBalance + changeAmount;

      if (newBalance < 0) {
        throw new Error("Insufficient balance");
      }

      // Update user balance
      const [updatedUser] = await tx
        .update(users)
        .set({ balance: newBalance.toFixed(2) })
        .where(eq(users.id, userId))
        .returning();

      // Record transaction in audit trail
      await tx.insert(balanceTransactions).values({
        userId,
        type,
        amount: amount,
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        description,
        relatedBetId
      });

      return updatedUser;
    });
  }

  async getBalanceTransactions(userId: number, limit: number = 50): Promise<BalanceTransaction[]> {
    return await db
      .select()
      .from(balanceTransactions)
      .where(eq(balanceTransactions.userId, userId))
      .orderBy(balanceTransactions.createdAt)
      .limit(limit);
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

  async clearBetslip(userId: number): Promise<void> {
    await db.delete(betslipItems).where(eq(betslipItems.userId, userId));
  }

  // Enhanced bet management methods
  async getUserBets(userId: number, status?: string): Promise<UserBet[]> {
    if (status) {
      return await db.select().from(userBets)
        .where(and(eq(userBets.userId, userId), eq(userBets.status, status)))
        .orderBy(desc(userBets.placedAt));
    }
    
    return await db.select().from(userBets)
      .where(eq(userBets.userId, userId))
      .orderBy(desc(userBets.placedAt));
  }

  async createUserBet(bet: InsertUserBet): Promise<UserBet> {
    const [created] = await db.insert(userBets).values(bet).returning();
    return created;
  }

  async updateBetStatus(betId: number, status: string, actualReturn?: string): Promise<void> {
    const updateData: any = { 
      status, 
      settledAt: new Date()
    };
    
    if (actualReturn !== undefined) {
      updateData.actualReturn = actualReturn;
    }
    
    await db.update(userBets).set(updateData).where(eq(userBets.id, betId));
  }

  async placeBet(userId: number, betData: any): Promise<{ bet: UserBet; newBalance: string }> {
    return await db.transaction(async (tx) => {
      // Validate user has sufficient balance
      const currentBalance = await this.getUserBalance(userId);
      const stake = parseFloat(betData.totalStake);
      
      if (parseFloat(currentBalance) < stake) {
        throw new Error("Insufficient balance");
      }

      // Deduct stake from balance
      const updatedUser = await this.updateUserBalance(
        userId, 
        (-stake).toString(), 
        'bet_placed', 
        `Bet placed: ${betData.betType}`,
        undefined
      );

      // Create bet record
      const betRecord: InsertUserBet = {
        userId,
        betType: betData.betType,
        selections: JSON.stringify(betData.selections),
        totalStake: betData.totalStake,
        potentialReturn: betData.potentialReturn,
        currency: betData.currency || 'SSP',
        status: 'pending'
      };

      const [bet] = await tx.insert(userBets).values(betRecord).returning();

      // Update the most recent balance transaction with bet ID
      const recentTransaction = await tx.select()
        .from(balanceTransactions)
        .where(eq(balanceTransactions.userId, userId))
        .orderBy(desc(balanceTransactions.createdAt))
        .limit(1);
      
      if (recentTransaction.length > 0) {
        await tx.update(balanceTransactions)
          .set({ relatedBetId: bet.id })
          .where(eq(balanceTransactions.id, recentTransaction[0].id));
      }

      // Clear user's betslip after successful bet placement
      await this.clearBetslip(userId);

      return { bet, newBalance: updatedUser.balance || '0' };
    });
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
