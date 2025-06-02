import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
});

export const sportsEvents = pgTable("sports_events", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  sport: text("sport").notNull(),
  league: text("league").notNull(),
  status: text("status").notNull(), // live, upcoming, finished
  startTime: timestamp("start_time").notNull(),
  currentTime: text("current_time"), // for live matches
});

export const bettingMarkets = pgTable("betting_markets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => sportsEvents.id),
  marketType: text("market_type").notNull(), // 1x2, over_under, etc
  marketName: text("market_name").notNull(),
  homeOdds: decimal("home_odds", { precision: 4, scale: 2 }),
  drawOdds: decimal("draw_odds", { precision: 4, scale: 2 }),
  awayOdds: decimal("away_odds", { precision: 4, scale: 2 }),
});

export const betslipItems = pgTable("betslip_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventId: integer("event_id").references(() => sportsEvents.id),
  marketId: integer("market_id").references(() => bettingMarkets.id),
  selection: text("selection").notNull(),
  odds: decimal("odds", { precision: 4, scale: 2 }).notNull(),
  stake: decimal("stake", { precision: 10, scale: 2 }).notNull(),
  potentialReturn: decimal("potential_return", { precision: 10, scale: 2 }).notNull(),
});

export const casinoGames = pgTable("casino_games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // slots, table_games, live_dealer, jackpots
  jackpotAmount: decimal("jackpot_amount", { precision: 12, scale: 2 }),
  rtp: decimal("rtp", { precision: 5, scale: 2 }),
  isLive: boolean("is_live").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSportsEventSchema = createInsertSchema(sportsEvents);
export const insertBettingMarketSchema = createInsertSchema(bettingMarkets);
export const insertBetslipItemSchema = createInsertSchema(betslipItems);
export const insertCasinoGameSchema = createInsertSchema(casinoGames);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SportsEvent = typeof sportsEvents.$inferSelect;
export type InsertSportsEvent = z.infer<typeof insertSportsEventSchema>;
export type BettingMarket = typeof bettingMarkets.$inferSelect;
export type InsertBettingMarket = z.infer<typeof insertBettingMarketSchema>;
export type BetslipItem = typeof betslipItems.$inferSelect;
export type InsertBetslipItem = z.infer<typeof insertBetslipItemSchema>;
export type CasinoGame = typeof casinoGames.$inferSelect;
export type InsertCasinoGame = z.infer<typeof insertCasinoGameSchema>;
