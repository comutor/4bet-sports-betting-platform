import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { storage } from "./storage";
import { oddsApiService } from "./services/oddsApi";
import { apiSportsService } from "./services/apiSports";
import { aviatorGame } from "./services/aviatorGame";
import { spribeService } from "./services/spribeService";
import { insertBetslipItemSchema, insertUserSchema, insertUserBetSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: '4bet-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Simple authentication middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.session?.user) {
      next();
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  };

  // Sports events endpoints - now serving real data
  app.get("/api/sports-events", async (req, res) => {
    try {
      const upcomingGames = await oddsApiService.getUpcomingGames();
      const allEvents = Object.values(upcomingGames).flat();
      res.json(allEvents);
    } catch (error) {
      res.status(503).json({ 
        message: "Sports data temporarily unavailable - API quota exceeded", 
        availableFeatures: ["Virtual Games", "Aviator", "Casino Games"],
        note: "Quota resets monthly"
      });
    }
  });

  app.get("/api/live-events", async (req, res) => {
    try {
      const liveEvents: any[] = [];
      let eventId = 1;

      // Fetch live data from all sports
      const [footballData, basketballData, cricketData, tennisData, hockeyData] = await Promise.all([
        oddsApiService.getFootballGamesByCountryPriority(),
        oddsApiService.getBasketballGamesByPriority(), 
        oddsApiService.getCricketGamesByPriority(),
        oddsApiService.getTennisGamesByPriority(),
        oddsApiService.getIceHockeyGamesByPriority()
      ]);

      // Process Football events - simulate some as live
      if (footballData && footballData.length > 0) {
        footballData.slice(0, 2).forEach(country => {
          if (country.games && country.games.length > 0) {
            country.games.slice(0, 3).forEach(match => {
              liveEvents.push({
                id: eventId++,
                sport: 'Football',
                status: 'live',
                homeTeam: match.home_team,
                awayTeam: match.away_team,
                homeScore: Math.floor(Math.random() * 3),
                awayScore: Math.floor(Math.random() * 3),
                league: match.league_name || match.sport_title,
                country: country.country,
                startTime: new Date(Date.now() - Math.floor(Math.random() * 90) * 60000), // Started within last 90 mins
                currentTime: `${Math.floor(Math.random() * 90) + 1}'`,
                odds: {
                  home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.0,
                  draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.0,
                  away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.5
                }
              });
            });
          }
        });
      }

      // Process Basketball events - simulate some as live
      if (basketballData && basketballData.length > 0) {
        basketballData.slice(0, 1).forEach(league => {
          if (league.games && league.games.length > 0) {
            league.games.slice(0, 2).forEach(match => {
              liveEvents.push({
                id: eventId++,
                sport: 'Basketball',
                status: 'live',
                homeTeam: match.home_team,
                awayTeam: match.away_team,
                homeScore: Math.floor(Math.random() * 120) + 60,
                awayScore: Math.floor(Math.random() * 120) + 60,
                league: league.league,
                startTime: new Date(Date.now() - Math.floor(Math.random() * 180) * 60000), // Started within last 3 hours
                currentTime: `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                odds: {
                  home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.9,
                  away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 1.9
                }
              });
            });
          }
        });
      }

      res.json(liveEvents);
    } catch (error) {
      console.error("Error fetching live events:", error);
      res.status(500).json({ message: "Failed to fetch live events" });
    }
  });

  app.get("/api/sports-events/:sport", async (req, res) => {
    try {
      const { sport } = req.params;
      
      // Map frontend sport names to API sport keys
      const sportKeyMap: { [key: string]: string[] } = {
        'basketball': ['basketball_nba', 'basketball_wnba'],
        'cricket': ['cricket_ipl', 'cricket_test_match', 'cricket_odi'],
        'tennis': ['tennis_atp', 'tennis_wta'],
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

      res.json(allEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by category" });
    }
  });

  // Cricket endpoints - using Odds API
  app.get("/api/sports/cricket", async (req, res) => {
    try {
      const cricketData = await oddsApiService.getCricketGamesByPriority();
      res.json(cricketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cricket data" });
    }
  });

  // Tennis endpoints - using Odds API
  app.get("/api/sports/tennis", async (req, res) => {
    try {
      const tennisData = await oddsApiService.getTennisGamesByPriority();
      res.json(tennisData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tennis data" });
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

  // Get matches by date for ALL filter - Live API Integration (with query parameters)
  app.get('/api/events/by-date', async (req, res) => {
    try {
      const dateParam = req.query.date as string;
      const targetDate = dateParam ? new Date(dateParam) : new Date();
      
      // Set target date to start of day for comparison
      targetDate.setHours(0, 0, 0, 0);
      
      const allEvents: any[] = [];

      // Fetch live data from all sports
      const [footballData, basketballData, cricketData, tennisData, hockeyData] = await Promise.all([
        oddsApiService.getFootballGamesByCountryPriority(),
        oddsApiService.getBasketballGamesByPriority(), 
        oddsApiService.getCricketGamesByPriority(),
        oddsApiService.getTennisGamesByPriority(),
        oddsApiService.getIceHockeyGamesByPriority()
      ]);

      let eventId = 1;

      // Process Football events by country and league
      if (footballData && footballData.length > 0) {
        footballData.forEach(country => {
          if (country.games && country.games.length > 0) {
            country.games.forEach(match => {
              const matchDate = new Date(match.commence_time);
              matchDate.setHours(0, 0, 0, 0);
              
              // Check if match is on the target date
              if (matchDate.getTime() === targetDate.getTime()) {
                allEvents.push({
                  id: eventId++,
                  sport: 'Football',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: match.league_name || match.sport_title,
                  country: country.country,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.0,
                    draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.0,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.5
                  }
                });
              }
            });
          }
        });
      }

      // Process Basketball events
      if (basketballData && basketballData.length > 0) {
        basketballData.forEach(league => {
          if (league.games && league.games.length > 0) {
            league.games.forEach(match => {
              const matchDate = new Date(match.commence_time);
              matchDate.setHours(0, 0, 0, 0);
              
              // Check if match is on the target date
              if (matchDate.getTime() === targetDate.getTime()) {
                allEvents.push({
                  id: eventId++,
                  sport: 'Basketball',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: league.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.9,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 1.9
                  }
                });
              }
            });
          }
        });
      }

      // Process Cricket events
      if (cricketData && cricketData.length > 0) {
        cricketData.forEach(tournament => {
          if (tournament.games && tournament.games.length > 0) {
            tournament.games.forEach(match => {
              const matchDate = new Date(match.commence_time);
              matchDate.setHours(0, 0, 0, 0);
              
              // Check if match is on the target date
              if (matchDate.getTime() === targetDate.getTime()) {
                allEvents.push({
                  id: eventId++,
                  sport: 'Cricket',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: tournament.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.8,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.0
                  }
                });
              }
            });
          }
        });
      }

      // Process Tennis events
      if (tennisData && tennisData.length > 0) {
        tennisData.forEach(tournament => {
          if (tournament.games && tournament.games.length > 0) {
            tournament.games.forEach(match => {
              const matchDate = new Date(match.commence_time);
              matchDate.setHours(0, 0, 0, 0);
              
              // Check if match is on the target date
              if (matchDate.getTime() === targetDate.getTime()) {
                allEvents.push({
                  id: eventId++,
                  sport: 'Tennis',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: tournament.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.8,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.0
                  }
                });
              }
            });
          }
        });
      }

      // Process Ice Hockey events
      if (hockeyData && hockeyData.length > 0) {
        hockeyData.forEach(league => {
          if (league.games && league.games.length > 0) {
            league.games.forEach(match => {
              const matchDate = new Date(match.commence_time);
              matchDate.setHours(0, 0, 0, 0);
              
              // Check if match is on the target date
              if (matchDate.getTime() === targetDate.getTime()) {
                allEvents.push({
                  id: eventId++,
                  sport: 'Ice Hockey',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: league.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.1,
                    draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.2,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.3
                  }
                });
              }
            });
          }
        });
      }

      // Define league popularity order (most popular to least)
      const leaguePopularityOrder = [
        // Football
        'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League', 'Europa League',
        'Brasileirão', 'Primera División', 'Eredivisie', 'Primeira Liga', 'Liga MX',
        // Basketball 
        'NBA', 'EuroLeague', 'WNBA', 'NBL',
        // Tennis
        'Wimbledon', 'US Open', 'French Open', 'Australian Open', 'ATP', 'WTA',
        // Ice Hockey
        'NHL', 'KHL', 'SHL'
      ];

      // Sort events by league popularity, then by sport, then by start time
      allEvents.sort((a, b) => {
        const aPopularity = leaguePopularityOrder.indexOf(a.league);
        const bPopularity = leaguePopularityOrder.indexOf(b.league);
        
        // If both leagues are in popularity list, sort by popularity
        if (aPopularity !== -1 && bPopularity !== -1) {
          return aPopularity - bPopularity;
        }
        
        // If only one is in popularity list, prioritize it
        if (aPopularity !== -1) return -1;
        if (bPopularity !== -1) return 1;
        
        // If neither is in popularity list, sort by sport then time
        if (a.sport !== b.sport) {
          return a.sport.localeCompare(b.sport);
        }
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });

      res.json(allEvents);
    } catch (error) {
      console.error('Error fetching events by date:', error);
      res.status(500).json({ message: 'Failed to fetch events' });
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

  // Football games by country priority - fallback to Odds API temporarily
  app.get("/api/football/countries", async (req, res) => {
    try {
      // Try API Sports first, fallback to Odds API
      try {
        const footballData = await apiSportsService.getCompetitionsByCountry();
        if (footballData && footballData.length > 0) {
          res.json(footballData);
          return;
        }
      } catch (apiSportsError) {
        console.log("API Sports failed, falling back to Odds API");
      }
      
      // Fallback to Odds API
      const footballData = await oddsApiService.getFootballGamesByCountryPriority();
      res.json(footballData);
    } catch (error) {
      console.error("Error fetching football data:", error);
      res.status(500).json({ error: "Failed to fetch football data" });
    }
  });

  // Top Leagues endpoint - Now using API Sports for football
  app.get('/api/top-leagues/:sport', async (req, res) => {
    try {
      const { sport } = req.params;
      const topLeagueMatches: any[] = [];
      let eventId = 1;

      if (sport === 'football') {
        // Try API Sports first, fallback to Odds API
        try {
          const footballData = await apiSportsService.getTopEuropeanLeagues();
          
          if (footballData && footballData.length > 0) {
            footballData.forEach(league => {
              if (league.fixtures && league.fixtures.length > 0) {
                league.fixtures.forEach(match => {
                  topLeagueMatches.push({
                    id: eventId++,
                    sport: 'Football',
                    status: new Date(match.fixture.date) > new Date() ? 'upcoming' : 'live',
                    homeTeam: match.teams.home.name,
                    awayTeam: match.teams.away.name,
                    homeScore: match.goals.home,
                    awayScore: match.goals.away,
                    league: match.league.name,
                    country: match.league.country,
                    startTime: new Date(match.fixture.date),
                    currentTime: null,
                    odds: {
                      home: 2.0,
                      draw: 3.0,
                      away: 2.5
                    }
                  });
                });
              }
            });
          }
        } catch (apiSportsError) {
          console.log("API Sports failed for top leagues, falling back to Odds API");
          
          // Fallback to Odds API
          const footballData = await oddsApiService.getFootballGamesByCountryPriority();
          
          // Filter only top leagues
          const topLeagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League', 'Europa League'];
          
          if (footballData && footballData.length > 0) {
            footballData.forEach(country => {
              if (country.games && country.games.length > 0) {
                country.games.forEach(match => {
                  if (topLeagues.some(league => match.league_name?.includes(league) || match.sport_title?.includes(league))) {
                    topLeagueMatches.push({
                      id: eventId++,
                      sport: 'Football',
                      status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                      homeTeam: match.home_team,
                      awayTeam: match.away_team,
                      homeScore: null,
                      awayScore: null,
                      league: match.league_name || match.sport_title,
                      country: country.country,
                      startTime: new Date(match.commence_time),
                      currentTime: null,
                      odds: {
                        home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.0,
                        draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.0,
                        away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.5
                      }
                    });
                  }
                });
              }
            });
          }
        }
      }

      if (sport === 'basketball') {
        const basketballData = await oddsApiService.getBasketballGamesByPriority();
        
        if (basketballData && basketballData.length > 0) {
          basketballData.forEach(league => {
            if (league.games && league.games.length > 0) {
              league.games.forEach(match => {
                topLeagueMatches.push({
                  id: eventId++,
                  sport: 'Basketball',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: league.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.9,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 1.9
                  }
                });
              });
            }
          });
        }
      }

      if (sport === 'cricket') {
        const cricketData = await oddsApiService.getCricketGamesByPriority();
        
        if (cricketData && cricketData.length > 0) {
          cricketData.forEach(tournament => {
            if (tournament.games && tournament.games.length > 0) {
              tournament.games.forEach(match => {
                topLeagueMatches.push({
                  id: eventId++,
                  sport: 'Cricket',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: tournament.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.8,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.0
                  }
                });
              });
            }
          });
        }
      }

      if (sport === 'tennis') {
        const tennisData = await oddsApiService.getTennisGamesByPriority();
        
        if (tennisData && tennisData.length > 0) {
          tennisData.forEach(tournament => {
            if (tournament.games && tournament.games.length > 0) {
              tournament.games.forEach(match => {
                topLeagueMatches.push({
                  id: eventId++,
                  sport: 'Tennis',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: tournament.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.8,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.0
                  }
                });
              });
            }
          });
        }
      }

      if (sport === 'ice-hockey') {
        const hockeyData = await oddsApiService.getIceHockeyGamesByPriority();
        
        if (hockeyData && hockeyData.length > 0) {
          hockeyData.forEach(league => {
            if (league.games && league.games.length > 0) {
              league.games.forEach(match => {
                topLeagueMatches.push({
                  id: eventId++,
                  sport: 'Ice Hockey',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: league.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.1,
                    draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.2,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.3
                  }
                });
              });
            }
          });
        }
      }

      // Sort by start time
      topLeagueMatches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      res.json(topLeagueMatches);
    } catch (error) {
      console.error('Error fetching top leagues:', error);
      res.status(500).json({ message: 'Failed to fetch top leagues data' });
    }
  });

  // Featured matches endpoint
  app.get("/api/featured-matches", async (req, res) => {
    try {
      const featuredMatches: any[] = [];
      let eventId = 1;

      // Get featured football matches
      const footballData = await oddsApiService.getFootballGamesByCountryPriority();
      if (footballData && footballData.length > 0) {
        const premierLeagueMatches = footballData.find(country => 
          country.games?.some((match: any) => match.league_name?.includes('Premier League'))
        );
        
        if (premierLeagueMatches?.games) {
          const topMatch = premierLeagueMatches.games[0];
          if (topMatch) {
            featuredMatches.push({
              id: `featured-${eventId++}`,
              homeTeam: topMatch.home_team,
              awayTeam: topMatch.away_team,
              league: 'Premier League',
              sport: 'Football',
              time: new Date(topMatch.commence_time).toLocaleDateString('en-GB', { 
                weekday: 'short', 
                hour: '2-digit',
                minute: '2-digit'
              }),
              odds: {
                home: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.home_team)?.price || 2.0).toFixed(2),
                draw: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.0).toFixed(2),
                away: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.away_team)?.price || 2.5).toFixed(2)
              }
            });
          }
        }
      }

      // Get featured basketball matches
      const basketballData = await oddsApiService.getBasketballGamesByPriority();
      if (basketballData && basketballData.length > 0) {
        const wnbaMatches = basketballData.find(league => league.league === 'WNBA');
        if (wnbaMatches?.games && wnbaMatches.games.length > 0) {
          const topMatch = wnbaMatches.games[0];
          featuredMatches.push({
            id: `featured-${eventId++}`,
            homeTeam: topMatch.home_team,
            awayTeam: topMatch.away_team,
            league: 'WNBA',
            sport: 'Basketball',
            time: new Date(topMatch.commence_time).toLocaleDateString('en-GB', { 
              weekday: 'short', 
              hour: '2-digit',
              minute: '2-digit'
            }),
            odds: {
              home: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.home_team)?.price || 1.9).toFixed(2),
              away: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.away_team)?.price || 1.9).toFixed(2)
            }
          });
        }
      }

      // Get featured hockey matches
      const hockeyData = await oddsApiService.getIceHockeyGamesByPriority();
      if (hockeyData && hockeyData.length > 0) {
        const nhlMatches = hockeyData.find(league => league.league === 'NHL');
        if (nhlMatches?.games && nhlMatches.games.length > 0) {
          const topMatch = nhlMatches.games[0];
          featuredMatches.push({
            id: `featured-${eventId++}`,
            homeTeam: topMatch.home_team,
            awayTeam: topMatch.away_team,
            league: 'NHL',
            sport: 'Hockey',
            time: new Date(topMatch.commence_time).toLocaleDateString('en-GB', { 
              weekday: 'short', 
              hour: '2-digit',
              minute: '2-digit'
            }),
            odds: {
              home: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.home_team)?.price || 2.1).toFixed(2),
              away: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.away_team)?.price || 1.8).toFixed(2)
            }
          });
        }
      }

      // Get featured tennis matches
      const tennisData = await oddsApiService.getTennisGamesByPriority();
      if (tennisData && tennisData.length > 0) {
        const atpMatches = tennisData.find(tournament => tournament.league?.includes('ATP'));
        if (atpMatches?.games && atpMatches.games.length > 0) {
          const topMatch = atpMatches.games[0];
          featuredMatches.push({
            id: `featured-${eventId++}`,
            homeTeam: topMatch.home_team,
            awayTeam: topMatch.away_team,
            league: 'ATP',
            sport: 'Tennis',
            time: new Date(topMatch.commence_time).toLocaleDateString('en-GB', { 
              weekday: 'short', 
              hour: '2-digit',
              minute: '2-digit'
            }),
            odds: {
              home: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.home_team)?.price || 1.7).toFixed(2),
              away: (topMatch.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === topMatch.away_team)?.price || 2.1).toFixed(2)
            }
          });
        }
      }

      res.json(featuredMatches);
    } catch (error) {
      console.error('Error fetching featured matches:', error);
      res.status(500).json({ message: 'Failed to fetch featured matches' });
    }
  });

  // Competitions endpoint now returns static success for frontend handling
  app.get("/api/competitions/countries/:sport", async (req, res) => {
    // Frontend now handles all competition data directly
    res.json({ success: true });
  });

  // Competitions endpoint - Live API Integration  
  app.get('/api/competitions/:sport', async (req, res) => {
    try {
      const { sport } = req.params;
      const competitionMatches: any[] = [];
      let eventId = 1;

      if (sport === 'football') {
        // Try API Sports first, fallback to Odds API
        try {
          const footballData = await apiSportsService.getCompetitionsByCountry();
          
          if (footballData && footballData.length > 0) {
            footballData.forEach(country => {
              if (country.leagues && country.leagues.length > 0) {
                country.leagues.forEach(league => {
                  if (league.fixtures && league.fixtures.length > 0) {
                    league.fixtures.forEach(match => {
                      competitionMatches.push({
                        id: eventId++,
                        sport: 'Football',
                        status: new Date(match.fixture.date) > new Date() ? 'upcoming' : 'live',
                        homeTeam: match.teams.home.name,
                        awayTeam: match.teams.away.name,
                        homeScore: match.goals.home,
                        awayScore: match.goals.away,
                        league: match.league.name,
                        country: match.league.country,
                        startTime: new Date(match.fixture.date),
                        currentTime: null,
                        odds: {
                          home: 2.0,
                          draw: 3.0,
                          away: 2.5
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        } catch (apiSportsError) {
          console.log("API Sports failed for competitions, falling back to Odds API");
          
          // Fallback to Odds API
          const footballData = await oddsApiService.getFootballGamesByCountryPriority();
          
          if (footballData && footballData.length > 0) {
            footballData.forEach(country => {
              if (country.games && country.games.length > 0) {
                country.games.forEach(match => {
                  competitionMatches.push({
                    id: eventId++,
                    sport: 'Football',
                    status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                    homeTeam: match.home_team,
                    awayTeam: match.away_team,
                    homeScore: null,
                    awayScore: null,
                    league: match.league_name || match.sport_title,
                    country: country.country,
                    startTime: new Date(match.commence_time),
                    currentTime: null,
                    odds: {
                      home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.0,
                      draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.0,
                      away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.5
                    }
                  });
                });
              }
            });
          }
        }
      }

      if (sport === 'basketball') {
        const basketballData = await oddsApiService.getBasketballGamesByPriority();
        
        if (basketballData && basketballData.length > 0) {
          basketballData.forEach(league => {
            if (league.games && league.games.length > 0) {
              league.games.forEach(match => {
                competitionMatches.push({
                  id: eventId++,
                  sport: 'Basketball',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: league.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.9,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 1.9
                  }
                });
              });
            }
          });
        }
      }

      if (sport === 'cricket') {
        const cricketData = await oddsApiService.getCricketGamesByPriority();
        
        if (cricketData && cricketData.length > 0) {
          cricketData.forEach(tournament => {
            if (tournament.games && tournament.games.length > 0) {
              tournament.games.forEach(match => {
                competitionMatches.push({
                  id: eventId++,
                  sport: 'Cricket',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: tournament.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.8,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.0
                  }
                });
              });
            }
          });
        }
      }

      if (sport === 'tennis') {
        const tennisData = await oddsApiService.getTennisGamesByPriority();
        
        if (tennisData && tennisData.length > 0) {
          tennisData.forEach(tournament => {
            if (tournament.games && tournament.games.length > 0) {
              tournament.games.forEach(match => {
                competitionMatches.push({
                  id: eventId++,
                  sport: 'Tennis',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: tournament.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 1.8,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.0
                  }
                });
              });
            }
          });
        }
      }

      if (sport === 'ice-hockey') {
        const hockeyData = await oddsApiService.getIceHockeyGamesByPriority();
        
        if (hockeyData && hockeyData.length > 0) {
          hockeyData.forEach(league => {
            if (league.games && league.games.length > 0) {
              league.games.forEach(match => {
                competitionMatches.push({
                  id: eventId++,
                  sport: 'Ice Hockey',
                  status: new Date(match.commence_time) > new Date() ? 'upcoming' : 'live',
                  homeTeam: match.home_team,
                  awayTeam: match.away_team,
                  homeScore: null,
                  awayScore: null,
                  league: league.league,
                  startTime: new Date(match.commence_time),
                  currentTime: null,
                  odds: {
                    home: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.home_team)?.price || 2.1,
                    draw: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 3.2,
                    away: match.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === match.away_team)?.price || 2.3
                  }
                });
              });
            }
          });
        }
      }

      // Sort by country and league, then by start time
      competitionMatches.sort((a, b) => {
        if (a.country !== b.country) {
          return (a.country || '').localeCompare(b.country || '');
        }
        if (a.league !== b.league) {
          return a.league.localeCompare(b.league);
        }
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });

      res.json(competitionMatches);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      res.status(500).json({ message: 'Failed to fetch competitions data' });
    }
  });

  // Pure football (soccer) matches only - Nations League and FIFA competitions
  app.get("/api/football/matches", async (req, res) => {
    try {
      const footballCompetitions = [
        'soccer_uefa_nations_league', 
        'soccer_fifa_world_cup', 
        'soccer_conmebol_copa_america',
        'soccer_uefa_european_championship',
        'soccer_africa_cup_of_nations',
        'soccer_fifa_club_world_cup'
      ];
      const footballMatches: any[] = [];

      for (const competition of footballCompetitions) {
        try {
          const matches = await oddsApiService.getOdds(competition);
          const transformedMatches = matches.slice(0, 5).map((match: any) => ({
            id: match.id,
            homeTeam: match.home_team,
            awayTeam: match.away_team,
            league: match.sport_title,
            commence_time: match.commence_time,
            bookmakers: match.bookmakers
          }));
          footballMatches.push(...transformedMatches);
        } catch (error) {
          console.log(`Error fetching ${competition}:`, error);
        }
      }

      res.json(footballMatches.slice(0, 10));
    } catch (error) {
      console.error("Error fetching football matches:", error);
      res.status(500).json({ error: "Failed to fetch football matches" });
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

  // Sports overview - upcoming events
  app.get("/api/sports-events", async (req, res) => {
    try {
      const upcomingGames = await oddsApiService.getUpcomingGames();
      
      // Transform to consistent format for sports overview
      const transformedEvents = (upcomingGames || []).slice(0, 10).map((game: any) => ({
        id: game.id,
        sport: game.sport_key?.includes('soccer') ? 'football' : 
               game.sport_key?.includes('basketball') ? 'basketball' :
               game.sport_key?.includes('tennis') ? 'tennis' :
               game.sport_key?.includes('hockey') ? 'hockey' : 'other',
        league: game.sport_title || 'Unknown League',
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        eventName: `${game.home_team} vs ${game.away_team}`,
        time: new Date(game.commence_time).toLocaleString(),
        homeOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.home_team)?.price?.toString() || 'N/A',
        awayOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.away_team)?.price?.toString() || 'N/A',
        drawOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toString()
      }));
      
      res.json(transformedEvents);
    } catch (error) {
      console.error("Error fetching sports events:", error);
      res.status(500).json({ error: "Failed to fetch sports events" });
    }
  });

  // Sports overview - popular events
  app.get("/api/popular-events", async (req, res) => {
    try {
      const upcomingGames = await oddsApiService.getUpcomingGames();
      
      // Transform to consistent format for sports overview (popular events with better odds)
      const popularEvents = Array.isArray(upcomingGames) ? upcomingGames.slice(5, 15).map((game: any) => ({
        id: game.id,
        sport: game.sport_key?.includes('soccer') ? 'football' : 
               game.sport_key?.includes('basketball') ? 'basketball' :
               game.sport_key?.includes('tennis') ? 'tennis' :
               game.sport_key?.includes('hockey') ? 'hockey' : 'other',
        league: game.sport_title || 'Unknown League',
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        eventName: `${game.home_team} vs ${game.away_team}`,
        time: new Date(game.commence_time).toLocaleString(),
        homeOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.home_team)?.price?.toString() || 'N/A',
        awayOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.away_team)?.price?.toString() || 'N/A',
        drawOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toString()
      })) : [];
      
      res.json(popularEvents);
    } catch (error) {
      console.error("Error fetching popular events:", error);
      res.status(500).json({ error: "Failed to fetch popular events" });
    }
  });

  // Sports overview - live events
  app.get("/api/live-events", async (req, res) => {
    try {
      // For now, return a subset of upcoming games as "live" since we don't have separate live API
      const upcomingGames = await oddsApiService.getUpcomingGames();
      
      // Transform to consistent format for sports overview (simulating live events)
      const liveEvents = (upcomingGames || []).slice(0, 5).map((game: any) => ({
        id: game.id,
        sport: game.sport_key?.includes('soccer') ? 'football' : 
               game.sport_key?.includes('basketball') ? 'basketball' :
               game.sport_key?.includes('tennis') ? 'tennis' :
               game.sport_key?.includes('hockey') ? 'hockey' : 'other',
        league: game.sport_title || 'Unknown League',
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        eventName: `${game.home_team} vs ${game.away_team}`,
        time: 'LIVE',
        homeOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.home_team)?.price?.toString() || 'N/A',
        awayOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === game.away_team)?.price?.toString() || 'N/A',
        drawOdds: game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find((o: any) => o.name === 'Draw')?.price?.toString()
      }));
      
      res.json(liveEvents);
    } catch (error) {
      console.error("Error fetching live events:", error);
      res.status(500).json({ error: "Failed to fetch live events" });
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

  // Mock football data endpoints for development
  app.get("/api/mock/football/events", async (req, res) => {
    try {
      const footballEvents = await storage.getEventsByCategory("football");
      res.json(footballEvents);
    } catch (error) {
      console.error("Error fetching mock football events:", error);
      res.status(500).json({ error: "Failed to fetch football events" });
    }
  });

  app.get("/api/mock/football/live", async (req, res) => {
    try {
      const liveEvents = await storage.getLiveEvents();
      const liveFootball = liveEvents.filter(event => event.sport === "football");
      res.json(liveFootball);
    } catch (error) {
      console.error("Error fetching live football:", error);
      res.status(500).json({ error: "Failed to fetch live football" });
    }
  });

  app.get("/api/mock/football/upcoming", async (req, res) => {
    try {
      const allEvents = await storage.getSportsEvents();
      const upcomingFootball = allEvents.filter(event => 
        event.sport === "football" && event.status === "upcoming"
      );
      res.json(upcomingFootball);
    } catch (error) {
      console.error("Error fetching upcoming football:", error);
      res.status(500).json({ error: "Failed to fetch upcoming football" });
    }
  });

  app.get("/api/mock/football/markets/:eventId", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const markets = await storage.getBettingMarkets(eventId);
      res.json(markets);
    } catch (error) {
      console.error("Error fetching betting markets:", error);
      res.status(500).json({ error: "Failed to fetch betting markets" });
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

      // Check if phone number already exists
      const existingPhoneUser = await storage.getUserByPhoneNumber(userData.phoneNumber || '');
      if (existingPhoneUser) {
        return res.status(409).json({ message: "This phone number is already registered. Please use a different phone number or try logging in." });
      }

      // Check if password already exists
      const existingPasswordUser = await storage.getUserByPassword(userData.password);
      if (existingPasswordUser) {
        return res.status(409).json({ message: "This password is already in use. Please choose a different password for security reasons." });
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



  // Reset password endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { phoneNumber, newPassword } = req.body;

      if (!phoneNumber || !newPassword) {
        return res.status(400).json({ message: "Phone number and new password are required" });
      }

      const user = await storage.getUserByPhoneNumber(phoneNumber);
      if (!user) {
        return res.status(404).json({ message: "No account found with this phone number" });
      }

      // Check if new password is already in use by another user
      const existingPasswordUser = await storage.getUserByPassword(newPassword);
      if (existingPasswordUser && existingPasswordUser.id !== user.id) {
        return res.status(409).json({ message: "This password is already in use. Please choose a different password." });
      }

      await storage.updateUserPassword(user.id, newPassword);

      res.json({ 
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error("Reset password error:", error);
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

  // Balance management endpoints
  app.get("/api/user/balance", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const balance = await storage.getUserBalance(userId);
      res.json({ balance });
    } catch (error) {
      console.error("Get balance error:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  app.post("/api/user/balance/update", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { amount, type, description } = req.body;
      
      if (!amount || !type) {
        return res.status(400).json({ message: "Amount and type are required" });
      }

      // Validate amount is a valid number
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Validate transaction type
      const validTypes = ['deposit', 'withdrawal', 'bet_placed', 'bet_won', 'bet_refund'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type" });
      }

      const updatedUser = await storage.updateUserBalance(userId, amount, type, description);
      res.json({ 
        message: "Balance updated successfully",
        newBalance: updatedUser.balance 
      });
    } catch (error) {
      console.error("Update balance error:", error);
      if (error instanceof Error && error.message === "Insufficient balance") {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      res.status(500).json({ message: "Failed to update balance" });
    }
  });

  app.get("/api/user/transactions", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getBalanceTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Bet management endpoints
  app.get("/api/user/bets", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const status = req.query.status as string;
      const bets = await storage.getUserBets(userId, status);
      res.json(bets);
    } catch (error) {
      console.error("Get user bets error:", error);
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  app.post("/api/user/bets/place", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const betData = req.body;
      
      // Validate required fields
      if (!betData.betType || !betData.selections || !betData.totalStake || !betData.potentialReturn) {
        return res.status(400).json({ message: "Missing required bet data" });
      }

      // Validate stake is positive
      const stake = parseFloat(betData.totalStake);
      if (isNaN(stake) || stake <= 0) {
        return res.status(400).json({ message: "Invalid stake amount" });
      }

      const result = await storage.placeBet(userId, betData);
      
      res.json({
        message: "Bet placed successfully",
        bet: result.bet,
        newBalance: result.newBalance
      });
    } catch (error) {
      console.error("Place bet error:", error);
      if (error instanceof Error && error.message === "Insufficient balance") {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      res.status(500).json({ message: "Failed to place bet" });
    }
  });

  // Get user transactions for statement
  app.get('/api/user/transactions', async (req, res) => {
    try {
      const { userId, filter = 'all', range = '30d' } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID required' });
      }

      const transactions = await storage.getBalanceTransactions(Number(userId), 100);
      
      // Filter by type if specified
      let filteredTransactions = transactions;
      if (filter !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === filter);
      }

      // Filter by date range
      if (range !== 'all') {
        const now = new Date();
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
        const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
        filteredTransactions = filteredTransactions.filter(t => {
          if (!t.createdAt) return false;
          const transactionDate = new Date(t.createdAt);
          return transactionDate >= cutoffDate;
        });
      }

      // Format transactions for frontend
      const formattedTransactions = filteredTransactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description || `${t.type.charAt(0).toUpperCase() + t.type.slice(1)} transaction`,
        date: t.createdAt,
        status: 'completed', // All stored transactions are completed
        balance: t.balanceAfter
      }));

      res.json({ transactions: formattedTransactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Failed to fetch transactions' });
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

  // User bets endpoints
  app.get("/api/user-bets/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const bets = await storage.getUserBets(parseInt(userId));
      res.json(bets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bets" });
    }
  });

  app.post("/api/user-bets", async (req, res) => {
    try {
      const validatedBet = insertUserBetSchema.parse(req.body);
      const bet = await storage.createUserBet(validatedBet);
      res.status(201).json(bet);
    } catch (error) {
      res.status(400).json({ message: "Invalid bet data" });
    }
  });

  app.put("/api/user-bets/:betId/status", async (req, res) => {
    const { betId } = req.params;
    const { status } = req.body;
    try {
      await storage.updateBetStatus(parseInt(betId), status);
      res.json({ message: "Bet status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update bet status" });
    }
  });

  // Create sample bets for demonstration
  app.post("/api/create-sample-bets/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const sampleBets = [
        {
          userId,
          betType: 'single' as const,
          selections: JSON.stringify([{
            eventName: 'Manchester United vs Liverpool',
            selection: 'Manchester United Win',
            odds: '2.10'
          }]),
          totalStake: '50.00',
          potentialReturn: '105.00',
          status: 'pending' as const,
          currency: 'SSP',
          placedAt: new Date()
        },
        {
          userId,
          betType: 'accumulator' as const,
          selections: JSON.stringify([
            {
              eventName: 'Arsenal vs Chelsea',
              selection: 'Arsenal Win',
              odds: '1.80'
            },
            {
              eventName: 'Barcelona vs Real Madrid',
              selection: 'Over 2.5 Goals',
              odds: '1.65'
            }
          ]),
          totalStake: '25.00',
          potentialReturn: '74.25',
          status: 'won' as const,
          currency: 'SSP',
          placedAt: new Date(Date.now() - 86400000),
          settledAt: new Date(Date.now() - 3600000)
        },
        {
          userId,
          betType: 'single' as const,
          selections: JSON.stringify([{
            eventName: 'Brazil vs Argentina',
            selection: 'Brazil Win',
            odds: '2.40'
          }]),
          totalStake: '30.00',
          potentialReturn: '72.00',
          status: 'lost' as const,
          currency: 'SSP',
          placedAt: new Date(Date.now() - 172800000),
          settledAt: new Date(Date.now() - 86400000)
        },
        {
          userId,
          betType: 'single' as const,
          selections: JSON.stringify([{
            eventName: 'Lakers vs Warriors',
            selection: 'Lakers +5.5',
            odds: '1.90'
          }]),
          totalStake: '40.00',
          potentialReturn: '76.00',
          status: 'pending' as const,
          currency: 'SSP',
          placedAt: new Date(Date.now() - 7200000)
        }
      ];

      const createdBets = [];
      for (const bet of sampleBets) {
        const createdBet = await storage.createUserBet(bet);
        createdBets.push(createdBet);
      }

      res.json({ message: "Sample bets created successfully", bets: createdBets });
    } catch (error) {
      console.error("Error creating sample bets:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Spribe Aviator endpoints  
  app.post("/api/spribe/token", async (req, res) => {
    try {
      // For demo purposes, create a mock user session
      const userId = 1;
      const mockUser = await storage.getUser(userId);
      
      if (!mockUser) {
        // Create demo user if not exists
        await storage.createUser({
          firstName: "Demo",
          lastName: "User",
          password: "demo_pass",
          phoneNumber: "+256701234567",
          country: "Uganda"
        });
      }
      
      const tokenData = await spribeService.generateGameToken(userId);
      res.json(tokenData);
    } catch (error) {
      console.error("Error generating Spribe token:", error);
      res.status(500).json({ message: "Failed to generate game token" });
    }
  });

  // Spribe callback endpoints for game integration
  app.post("/api/spribe/balance", async (req, res) => {
    try {
      const { token, session_id } = req.body;
      
      if (token) {
        const tokenData = spribeService.verifyToken(token);
        const balance = await spribeService.getBalance(tokenData.session_id);
        res.json(balance);
      } else if (session_id) {
        const balance = await spribeService.getBalance(session_id);
        res.json(balance);
      } else {
        res.status(400).json({ error: "Missing token or session_id" });
      }
    } catch (error) {
      console.error("Error getting balance:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/spribe/bet", async (req, res) => {
    try {
      const { token, session_id, amount, bet_id } = req.body;
      
      let sessionId = session_id;
      if (token) {
        const tokenData = spribeService.verifyToken(token);
        sessionId = tokenData.session_id;
      }
      
      const result = await spribeService.placeBet(sessionId, amount, bet_id);
      res.json(result);
    } catch (error) {
      console.error("Error placing bet:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/spribe/win", async (req, res) => {
    try {
      const { token, session_id, amount, bet_id } = req.body;
      
      let sessionId = session_id;
      if (token) {
        const tokenData = spribeService.verifyToken(token);
        sessionId = tokenData.session_id;
      }
      
      const result = await spribeService.payoutWin(sessionId, amount, bet_id);
      res.json(result);
    } catch (error) {
      console.error("Error processing win:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Legacy Aviator game endpoints (for fallback)
  app.get("/api/aviator/state", (req, res) => {
    const gameState = aviatorGame.getCurrentGameState();
    const recentResults = aviatorGame.getRecentResults();
    
    res.json({
      gameState,
      recentResults
    });
  });

  app.post("/api/aviator/bet", (req, res) => {
    const { amount } = req.body;
    const session = req.session as any;
    
    if (!session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid bet amount" });
    }

    const success = aviatorGame.placeBet(session.user.id, amount);
    
    if (success) {
      res.json({ success: true, message: "Bet placed successfully" });
    } else {
      res.status(400).json({ message: "Unable to place bet" });
    }
  });

  app.post("/api/aviator/cashout", (req, res) => {
    const { betIndex = 0 } = req.body;
    const session = req.session as any;
    
    if (!session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const result = aviatorGame.cashOut(session.user.id, betIndex);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ message: "Unable to cash out" });
    }
  });

  app.get("/api/aviator/my-bets", (req, res) => {
    const session = req.session as any;
    
    if (!session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userBets = aviatorGame.getUserBets(session.user.id);
    res.json(userBets);
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time Aviator updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/aviator' });

  const connectedClients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    connectedClients.add(ws);
    
    // Send current game state immediately
    const gameState = aviatorGame.getCurrentGameState();
    const recentResults = aviatorGame.getRecentResults();
    
    ws.send(JSON.stringify({
      type: 'gameState',
      data: { gameState, recentResults }
    }));

    ws.on('close', () => {
      connectedClients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });

  // Broadcast game events to all connected clients
  function broadcast(message: any) {
    const data = JSON.stringify(message);
    connectedClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }

  // Listen to aviator game events
  aviatorGame.on('roundWaiting', (data) => {
    broadcast({ type: 'roundWaiting', data });
  });

  aviatorGame.on('roundStarted', (data) => {
    broadcast({ type: 'roundStarted', data });
  });

  aviatorGame.on('multiplierUpdate', (data) => {
    broadcast({ type: 'multiplierUpdate', data });
  });

  aviatorGame.on('roundCrashed', (data) => {
    broadcast({ type: 'roundCrashed', data });
  });

  aviatorGame.on('betPlaced', (data) => {
    broadcast({ type: 'betPlaced', data });
  });

  aviatorGame.on('betCashedOut', (data) => {
    broadcast({ type: 'betCashedOut', data });
  });

  // Cricket sports endpoint
  app.get("/api/sports/cricket", async (req, res) => {
    try {
      const cricketData = await oddsApiService.getCricketGamesByPriority();
      res.json(cricketData);
    } catch (error) {
      console.error("Error fetching cricket data:", error);
      res.status(500).json({ error: "Failed to fetch cricket data" });
    }
  });

  // Tennis sports endpoint
  app.get("/api/sports/tennis", async (req, res) => {
    try {
      const tennisData = await oddsApiService.getTennisGamesByPriority();
      res.json(tennisData);
    } catch (error) {
      console.error("Error fetching tennis data:", error);
      res.status(500).json({ error: "Failed to fetch tennis data" });
    }
  });

  return httpServer;
}
