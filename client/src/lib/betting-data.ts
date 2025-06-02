export interface FeaturedEvent {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  sport: string;
  league: string;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  odds: {
    home: string;
    draw?: string;
    away: string;
  };
}

export interface CasinoGameData {
  id: number;
  name: string;
  category: string;
  jackpotAmount?: string;
  rtp?: string;
  isLive?: boolean;
  gradient: string;
  icon: string;
}

export interface VirtualSport {
  id: number;
  name: string;
  status: string;
  nextTime?: string;
  matches: {
    teams: string;
    odds: string[];
  }[];
}

export const sampleFeaturedEvents: FeaturedEvent[] = [
  {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    homeScore: 2,
    awayScore: 1,
    sport: "football",
    league: "Premier League",
    status: "live",
    time: "85:30",
    odds: {
      home: "2.10",
      draw: "3.40",
      away: "3.80"
    }
  },
  {
    id: 2,
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    sport: "basketball",
    league: "NBA",
    status: "upcoming",
    time: "45 min",
    odds: {
      home: "1.85",
      away: "1.95"
    }
  },
  {
    id: 3,
    homeTeam: "Chiefs",
    awayTeam: "Bills",
    homeScore: 14,
    awayScore: 10,
    sport: "american_football",
    league: "NFL",
    status: "live",
    time: "2H 15:20",
    odds: {
      home: "1.65",
      away: "2.25"
    }
  }
];

export const sampleCasinoGames: CasinoGameData[] = [
  {
    id: 1,
    name: "Diamond Rush",
    category: "slots",
    jackpotAmount: "$2.4M",
    gradient: "from-yellow-400 to-red-500",
    icon: "fas fa-gem"
  },
  {
    id: 2,
    name: "Blackjack Classic",
    category: "table_games",
    rtp: "RTP 99.5%",
    gradient: "from-slate-600 to-gray-900",
    icon: "fas fa-spade"
  },
  {
    id: 3,
    name: "European Roulette",
    category: "live_dealer",
    isLive: true,
    gradient: "from-red-500 to-gray-900",
    icon: "fas fa-circle-notch"
  },
  {
    id: 4,
    name: "Mega Fortune",
    category: "jackpots",
    jackpotAmount: "$8.1M",
    gradient: "from-green-500 to-emerald-600",
    icon: "fas fa-crown"
  }
];

export const sampleVirtualSports: VirtualSport[] = [
  {
    id: 1,
    name: "Virtual Football",
    status: "Next: 2:30",
    matches: [
      {
        teams: "FC Digital vs AI United",
        odds: ["2.10", "3.20", "3.80"]
      },
      {
        teams: "Virtual City vs Cyber FC",
        odds: ["1.85", "3.40", "4.20"]
      }
    ]
  },
  {
    id: 2,
    name: "Virtual Horses",
    status: "LIVE",
    matches: [
      { teams: "1. Lightning Bolt", odds: ["3.20"] },
      { teams: "2. Thunder Strike", odds: ["4.50"] },
      { teams: "3. Wind Runner", odds: ["5.80"] },
      { teams: "4. Fire Storm", odds: ["7.20"] }
    ]
  },
  {
    id: 3,
    name: "Virtual Basketball",
    status: "Next: 1:45",
    matches: [
      {
        teams: "Digital Lakers vs AI Warriors",
        odds: ["1.90", "1.90"]
      },
      {
        teams: "Over/Under 210.5",
        odds: ["1.85", "1.95"]
      }
    ]
  }
];

export const recentAviatorResults = [
  "3.24x", "1.08x", "5.67x", "2.45x", "1.23x", 
  "8.92x", "1.89x", "1.01x", "4.56x", "2.78x"
];
