import { Event as OddsApiEvent, Sport } from "./oddsApi";
import { FeaturedEvent } from "../../client/src/lib/betting-data";

export class DataTransformer {
  
  // Transform Odds API Event to our FeaturedEvent format
  static transformToFeaturedEvent(apiEvent: OddsApiEvent): FeaturedEvent {
    // Get best odds from first bookmaker
    const firstBookmaker = apiEvent.bookmakers[0];
    const h2hMarket = firstBookmaker?.markets.find(m => m.key === 'h2h');
    
    let homeOdds = '1.00';
    let awayOdds = '1.00';
    let drawOdds: string | undefined = undefined;
    
    if (h2hMarket) {
      const homeOutcome = h2hMarket.outcomes.find(o => o.name === apiEvent.home_team);
      const awayOutcome = h2hMarket.outcomes.find(o => o.name === apiEvent.away_team);
      const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');
      
      homeOdds = homeOutcome?.price.toFixed(2) || '1.00';
      awayOdds = awayOutcome?.price.toFixed(2) || '1.00';
      if (drawOutcome) {
        drawOdds = drawOutcome.price.toFixed(2);
      }
    }

    // Extract sport type and league from sport_key
    const sport = this.getSportType(apiEvent.sport_key);
    const league = this.getLeagueName(apiEvent.sport_key, apiEvent.sport_title);
    
    // Determine status and time
    const commenceTime = new Date(apiEvent.commence_time);
    const now = new Date();
    const timeDiff = commenceTime.getTime() - now.getTime();
    
    let status: 'live' | 'upcoming' | 'finished' = 'upcoming';
    let timeDisplay = '';
    
    if (timeDiff > 0) {
      // Upcoming game
      const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hoursUntil > 0) {
        timeDisplay = `${hoursUntil}h ${minutesUntil}min`;
      } else {
        timeDisplay = `${minutesUntil} min`;
      }
      status = 'upcoming';
    } else {
      // Could be live or finished
      status = 'live'; // Default to live for simplicity
      timeDisplay = 'LIVE';
    }

    return {
      id: parseInt(apiEvent.id.slice(-8), 16), // Convert hex to int for ID
      homeTeam: apiEvent.home_team,
      awayTeam: apiEvent.away_team,
      sport,
      league,
      status,
      time: timeDisplay,
      odds: {
        home: homeOdds,
        away: awayOdds,
        ...(drawOdds && { draw: drawOdds })
      }
    };
  }

  // Transform multiple events
  static transformToFeaturedEvents(apiEvents: OddsApiEvent[]): FeaturedEvent[] {
    return apiEvents.map(event => this.transformToFeaturedEvent(event));
  }

  // Get sport type from sport_key
  private static getSportType(sportKey: string): string {
    if (sportKey.includes('basketball')) return 'basketball';
    if (sportKey.includes('soccer') || sportKey.includes('football') && !sportKey.includes('american')) return 'football';
    if (sportKey.includes('americanfootball')) return 'american_football';
    if (sportKey.includes('baseball')) return 'baseball';
    if (sportKey.includes('icehockey')) return 'hockey';
    if (sportKey.includes('tennis')) return 'tennis';
    return 'other';
  }

  // Get league display name
  private static getLeagueName(sportKey: string, sportTitle: string): string {
    // Map specific sport keys to our display names
    const leagueMap: { [key: string]: string } = {
      'basketball_nba': 'NBA',
      'basketball_wnba': 'WNBA',
      'soccer_epl': 'Premier League',
      'soccer_spain_la_liga': 'La Liga',
      'soccer_germany_bundesliga': 'Bundesliga',
      'soccer_italy_serie_a': 'Serie A',
      'soccer_france_ligue_one': 'Ligue 1',
      'soccer_uefa_champs_league': 'Champions League',
      'americanfootball_nfl': 'NFL',
      'americanfootball_ncaaf': 'NCAAF',
      'baseball_mlb': 'MLB',
      'icehockey_nhl': 'NHL'
    };

    return leagueMap[sportKey] || sportTitle;
  }

  // Get best odds from multiple bookmakers
  static getBestOdds(apiEvent: OddsApiEvent): { home: string; away: string; draw?: string } {
    let bestHomeOdds = 0;
    let bestAwayOdds = 0;
    let bestDrawOdds = 0;

    apiEvent.bookmakers.forEach(bookmaker => {
      const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
      if (h2hMarket) {
        h2hMarket.outcomes.forEach(outcome => {
          if (outcome.name === apiEvent.home_team && outcome.price > bestHomeOdds) {
            bestHomeOdds = outcome.price;
          }
          if (outcome.name === apiEvent.away_team && outcome.price > bestAwayOdds) {
            bestAwayOdds = outcome.price;
          }
          if (outcome.name === 'Draw' && outcome.price > bestDrawOdds) {
            bestDrawOdds = outcome.price;
          }
        });
      }
    });

    const result: { home: string; away: string; draw?: string } = {
      home: bestHomeOdds > 0 ? bestHomeOdds.toFixed(2) : '1.00',
      away: bestAwayOdds > 0 ? bestAwayOdds.toFixed(2) : '1.00'
    };

    if (bestDrawOdds > 0) {
      result.draw = bestDrawOdds.toFixed(2);
    }

    return result;
  }

  // Group events by sport
  static groupEventsBySport(events: FeaturedEvent[]): { [sport: string]: FeaturedEvent[] } {
    return events.reduce((groups, event) => {
      const sport = event.sport;
      if (!groups[sport]) {
        groups[sport] = [];
      }
      groups[sport].push(event);
      return groups;
    }, {} as { [sport: string]: FeaturedEvent[] });
  }

  // Filter live events
  static getLiveEvents(events: FeaturedEvent[]): FeaturedEvent[] {
    return events.filter(event => event.status === 'live');
  }

  // Filter upcoming events
  static getUpcomingEvents(events: FeaturedEvent[]): FeaturedEvent[] {
    return events.filter(event => event.status === 'upcoming');
  }
}