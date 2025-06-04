import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { oddsApiService } from "./services/oddsApi";
import { DataTransformer } from "./services/dataTransformer";
import { insertBetslipItemSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: 'nilebet-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Sports events endpoints - now serving real data
  app.get("/api/sports-events", async (req, res) => {
    try {
      const upcomingGames = await oddsApiService.getUpcomingGames();
      const allEvents = Object.values(upcomingGames).flat();
      const transformedEvents = DataTransformer.transformToFeaturedEvents(allEvents);
      res.json(transformedEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sports events" });
    }
  });

  app.get("/api/live-events", async (req, res) => {
    try {
      const upcomingGames = await oddsApiService.getUpcomingGames();
      const allEvents = Object.values(upcomingGames).flat();
      const transformedEvents = DataTransformer.transformToFeaturedEvents(allEvents);
      const liveEvents = DataTransformer.getLiveEvents(transformedEvents);
      res.json(liveEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live events" });
    }
  });

  app.get("/api/sports-events/:sport", async (req, res) => {
    try {
      const { sport } = req.params;
      
      // Map frontend sport names to API sport keys
      const sportKeyMap: { [key: string]: string[] } = {
        'basketball': ['basketball_nba', 'basketball_wnba'],
        'football': ['soccer_epl', 'soccer_spain_la_liga', 'soccer_germany_bundesliga', 'soccer_italy_serie_a'],
        'american_football': ['americanfootball_nfl'],
        'baseball': ['baseball_mlb'],
        'hockey': ['icehockey_nhl']
      };

      const sportKeys = sportKeyMap[sport] || [];
      let allEvents: any[] = [];

      for (const sportKey of sportKeys) {
        try {
          const events = await oddsApiService.getOdds(sportKey);
          allEvents = allEvents.concat(events);
        } catch (error) {
          console.log(`Failed to fetch ${sportKey}, continuing...`);
        }
      }

      const transformedEvents = DataTransformer.transformToFeaturedEvents(allEvents);
      res.json(transformedEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by category" });
    }
  });

  // Real sports data from Odds API
  app.get("/api/odds/sports", async (req, res) => {
    try {
      const sports = await oddsApiService.getSports();
      res.json(sports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sports from API" });
    }
  });

  app.get("/api/odds/:sportKey", async (req, res) => {
    try {
      const { sportKey } = req.params;
      const events = await oddsApiService.getOdds(sportKey);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch odds for ${req.params.sportKey}` });
    }
  });

  app.get("/api/odds/upcoming/popular", async (req, res) => {
    try {
      const games = await oddsApiService.getUpcomingGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming games" });
    }
  });

  app.get("/api/odds/soccer/leagues", async (req, res) => {
    try {
      const leagues = await oddsApiService.getSoccerLeagues();
      res.json(leagues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch soccer leagues" });
    }
  });

  // Football games by country priority
  app.get("/api/football/countries", async (req, res) => {
    try {
      const footballData = await oddsApiService.getFootballGamesByCountryPriority();
      res.json(footballData);
    } catch (error) {
      console.error("Error fetching football data:", error);
      res.status(500).json({ error: "Failed to fetch football data" });
    }
  });

  // Basketball games by league priority
  app.get("/api/basketball/leagues", async (req, res) => {
    try {
      const basketballData = await oddsApiService.getBasketballGamesByPriority();
      res.json(basketballData);
    } catch (error) {
      console.error("Error fetching basketball data:", error);
      res.status(500).json({ error: "Failed to fetch basketball data" });
    }
  });

  // Ice Hockey games by league priority
  app.get("/api/hockey/leagues", async (req, res) => {
    try {
      const hockeyData = await oddsApiService.getIceHockeyGamesByPriority();
      res.json(hockeyData);
    } catch (error) {
      console.error("Error fetching hockey data:", error);
      res.status(500).json({ error: "Failed to fetch hockey data" });
    }
  });

  // Tennis games by tournament priority
  app.get("/api/tennis/tournaments", async (req, res) => {
    try {
      const tennisData = await oddsApiService.getTennisGamesByPriority();
      res.json(tennisData);
    } catch (error) {
      console.error("Error fetching tennis data:", error);
      res.status(500).json({ error: "Failed to fetch tennis data" });
    }
  });

  // Baseball games by league priority
  app.get("/api/baseball/leagues", async (req, res) => {
    try {
      const baseballData = await oddsApiService.getBaseballGamesByPriority();
      res.json(baseballData);
    } catch (error) {
      console.error("Error fetching baseball data:", error);
      res.status(500).json({ error: "Failed to fetch baseball data" });
    }
  });

  // Volleyball games by league priority
  app.get("/api/volleyball/leagues", async (req, res) => {
    try {
      const volleyballData = await oddsApiService.getVolleyballGamesByPriority();
      res.json(volleyballData);
    } catch (error) {
      console.error("Error fetching volleyball data:", error);
      res.status(500).json({ error: "Failed to fetch volleyball data" });
    }
  });

  // International competitions with real data
  app.get("/api/international/competitions", async (req, res) => {
    try {
      const internationalData = await oddsApiService.getInternationalCompetitions();
      res.json(internationalData);
    } catch (error) {
      console.error("Error fetching international competitions:", error);
      res.status(500).json({ error: "Failed to fetch international competitions" });
    }
  });

  // Top countries with real data
  app.get("/api/countries/top", async (req, res) => {
    try {
      const topCountriesData = await oddsApiService.getTopCountriesWithData();
      res.json(topCountriesData);
    } catch (error) {
      console.error("Error fetching top countries:", error);
      res.status(500).json({ error: "Failed to fetch top countries" });
    }
  });

  // Other countries with real data
  app.get("/api/countries/other", async (req, res) => {
    try {
      const otherCountriesData = await oddsApiService.getOtherCountriesWithData();
      res.json(otherCountriesData);
    } catch (error) {
      console.error("Error fetching other countries:", error);
      res.status(500).json({ error: "Failed to fetch other countries" });
    }
  });

  // Authentication endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: result.error.errors 
        });
      }

      const userData = result.data;

      // Check if user already exists
      const existingUser = await storage.getUserByPhoneNumber(userData.phoneNumber || '');
      if (existingUser) {
        return res.status(409).json({ message: "User with this phone number already exists" });
      }

      // Create new user
      const newUser = await storage.createUser(userData);
      
      // Set user session
      (req.session as any).userId = newUser.id;
      
      res.status(201).json({ 
        message: "User created successfully", 
        user: { 
          id: newUser.id, 
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          balance: newUser.balance,
          country: newUser.country,
          phoneNumber: newUser.phoneNumber
        } 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Phone number and password are required" });
      }

      const user = await storage.getUserByPhoneNumber(phoneNumber);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set user session
      (req.session as any).userId = user.id;
      
      res.json({ 
        message: "Login successful", 
        user: { 
          id: user.id, 
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          balance: user.balance,
          country: user.country,
          phoneNumber: user.phoneNumber
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          balance: user.balance,
          country: user.country,
          phoneNumber: user.phoneNumber
        } 
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/odds/basketball/leagues", async (req, res) => {
    try {
      const leagues = await oddsApiService.getBasketballLeagues();
      res.json(leagues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch basketball leagues" });
    }
  });

  // Betting markets endpoints
  app.get("/api/betting-markets/:eventId", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const markets = await storage.getBettingMarkets(eventId);
      res.json(markets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch betting markets" });
    }
  });

  // Betslip endpoints
  app.get("/api/betslip/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const items = await storage.getBetslipItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch betslip items" });
    }
  });

  app.post("/api/betslip", async (req, res) => {
    try {
      const validation = insertBetslipItemSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid betslip item data",
          errors: validation.error.errors 
        });
      }
      
      const item = await storage.addToBetslip(validation.data);
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to betslip" });
    }
  });

  app.delete("/api/betslip/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid betslip item ID" });
      }
      await storage.removeFromBetslip(id);
      res.json({ message: "Item removed from betslip" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from betslip" });
    }
  });

  // Casino games endpoints
  app.get("/api/casino-games", async (req, res) => {
    try {
      const games = await storage.getCasinoGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casino games" });
    }
  });

  app.get("/api/casino-games/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const games = await storage.getCasinoGamesByCategory(category);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casino games by category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
