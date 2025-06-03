import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { oddsApiService } from "./services/oddsApi";
import { insertBetslipItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sports events endpoints
  app.get("/api/sports-events", async (req, res) => {
    try {
      const events = await storage.getSportsEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sports events" });
    }
  });

  app.get("/api/live-events", async (req, res) => {
    try {
      const events = await storage.getLiveEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live events" });
    }
  });

  app.get("/api/sports-events/:sport", async (req, res) => {
    try {
      const { sport } = req.params;
      const events = await storage.getEventsByCategory(sport);
      res.json(events);
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
