import { Trophy, MapPin } from 'lucide-react';

interface TopLeaguesSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  sport?: string;
}

// Top leagues data for each sport
const topLeaguesData = {
  football: [
    {
      id: 'premier-league',
      name: 'Premier League',
      country: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      tier: 'Top Tier',
      description: 'English Premier League'
    },
    {
      id: 'la-liga',
      name: 'La Liga',
      country: 'Spain',
      flag: '🇪🇸',
      tier: 'Top Tier',
      description: 'Spanish La Liga'
    },
    {
      id: 'bundesliga',
      name: 'Bundesliga',
      country: 'Germany',
      flag: '🇩🇪',
      tier: 'Top Tier',
      description: 'German Bundesliga'
    },
    {
      id: 'serie-a',
      name: 'Serie A',
      country: 'Italy',
      flag: '🇮🇹',
      tier: 'Top Tier',
      description: 'Italian Serie A'
    },
    {
      id: 'ligue-1',
      name: 'Ligue 1',
      country: 'France',
      flag: '🇫🇷',
      tier: 'Top Tier',
      description: 'French Ligue 1'
    },
    {
      id: 'eredivisie',
      name: 'Eredivisie',
      country: 'Netherlands',
      flag: '🇳🇱',
      tier: 'Top Tier',
      description: 'Dutch Eredivisie'
    },
    {
      id: 'primeira-liga',
      name: 'Primeira Liga',
      country: 'Portugal',
      flag: '🇵🇹',
      tier: 'Top Tier',
      description: 'Portuguese Primeira Liga'
    },
    {
      id: 'pro-league',
      name: 'Pro League',
      country: 'Belgium',
      flag: '🇧🇪',
      tier: 'Top Tier',
      description: 'Belgian Pro League'
    },
    {
      id: 'brasileiro-serie-a',
      name: 'Brasileirão Série A',
      country: 'Brazil',
      flag: '🇧🇷',
      tier: 'Top Tier',
      description: 'Brazilian Série A'
    },
    {
      id: 'primera-division',
      name: 'Primera División',
      country: 'Argentina',
      flag: '🇦🇷',
      tier: 'Top Tier',
      description: 'Argentine Primera División'
    },
    {
      id: 'liga-mx',
      name: 'Liga MX',
      country: 'Mexico',
      flag: '🇲🇽',
      tier: 'Top Tier',
      description: 'Mexican Liga MX'
    },
    {
      id: 'mls',
      name: 'Major League Soccer',
      country: 'United States',
      flag: '🇺🇸',
      tier: 'Top Tier',
      description: 'Major League Soccer'
    },
    {
      id: 'premier-league-russia',
      name: 'Russian Premier League',
      country: 'Russia',
      flag: '🇷🇺',
      tier: 'Top Tier',
      description: 'Russian Premier League'
    },
    {
      id: 'super-lig',
      name: 'Süper Lig',
      country: 'Turkey',
      flag: '🇹🇷',
      tier: 'Top Tier',
      description: 'Turkish Süper Lig'
    },
    {
      id: 'premiership',
      name: 'Scottish Premiership',
      country: 'Scotland',
      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      tier: 'Top Tier',
      description: 'Scottish Premiership'
    }
  ],
  basketball: [
    {
      id: 'nba',
      name: 'NBA',
      country: 'United States',
      flag: '🇺🇸',
      tier: 'Top Tier',
      description: 'National Basketball Association'
    },
    {
      id: 'euroleague',
      name: 'EuroLeague',
      country: 'Europe',
      flag: '🇪🇺',
      tier: 'Top Tier',
      description: 'Turkish Airlines EuroLeague'
    },
    {
      id: 'acb',
      name: 'Liga ACB',
      country: 'Spain',
      flag: '🇪🇸',
      tier: 'Top Tier',
      description: 'Spanish Liga ACB'
    },
    {
      id: 'bsl',
      name: 'Basketball Super League',
      country: 'Turkey',
      flag: '🇹🇷',
      tier: 'Top Tier',
      description: 'Turkish Basketball Super League'
    }
  ],
  tennis: [
    {
      id: 'wimbledon',
      name: 'Wimbledon',
      country: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      tier: 'Grand Slam',
      description: 'The Championships, Wimbledon'
    },
    {
      id: 'us-open',
      name: 'US Open',
      country: 'United States',
      flag: '🇺🇸',
      tier: 'Grand Slam',
      description: 'US Open Tennis Championships'
    },
    {
      id: 'french-open',
      name: 'French Open',
      country: 'France',
      flag: '🇫🇷',
      tier: 'Grand Slam',
      description: 'Roland Garros'
    },
    {
      id: 'australian-open',
      name: 'Australian Open',
      country: 'Australia',
      flag: '🇦🇺',
      tier: 'Grand Slam',
      description: 'Australian Open'
    }
  ],
  'ice-hockey': [
    {
      id: 'nhl',
      name: 'NHL',
      country: 'North America',
      flag: '🇺🇸',
      tier: 'Top Tier',
      description: 'National Hockey League'
    },
    {
      id: 'khl',
      name: 'KHL',
      country: 'Russia',
      flag: '🇷🇺',
      tier: 'Top Tier',
      description: 'Kontinental Hockey League'
    },
    {
      id: 'shl',
      name: 'Swedish Hockey League',
      country: 'Sweden',
      flag: '🇸🇪',
      tier: 'Top Tier',
      description: 'Swedish Hockey League'
    }
  ],
  baseball: [
    {
      id: 'mlb',
      name: 'MLB',
      country: 'United States',
      flag: '🇺🇸',
      tier: 'Top Tier',
      description: 'Major League Baseball'
    },
    {
      id: 'npb',
      name: 'NPB',
      country: 'Japan',
      flag: '🇯🇵',
      tier: 'Top Tier',
      description: 'Nippon Professional Baseball'
    },
    {
      id: 'kbo',
      name: 'KBO League',
      country: 'South Korea',
      flag: '🇰🇷',
      tier: 'Top Tier',
      description: 'Korea Baseball Organization'
    }
  ]
};

const getSportTopLeagues = (sport: string) => {
  return topLeaguesData[sport as keyof typeof topLeaguesData] || topLeaguesData.football;
};

export function TopLeaguesSection({ onBetClick, sport = 'football' }: TopLeaguesSectionProps) {
  const topLeagues = getSportTopLeagues(sport);

  const getSportName = (sport: string) => {
    const names: { [key: string]: string } = {
      football: 'Football',
      basketball: 'Basketball',
      tennis: 'Tennis',
      'ice-hockey': 'Ice Hockey',
      baseball: 'Baseball'
    };
    return names[sport] || 'Football';
  };

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700/30">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Top {getSportName(sport)} Leagues
        </h1>
        <p className="text-gray-400 mt-1">
          Premier competitions from around the world
        </p>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-1 gap-3">
          {topLeagues.map((league) => (
            <div 
              key={league.id}
              className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-700/50 cursor-pointer transition-all duration-200 border border-gray-700/20 hover:border-blue-500/30"
              onClick={() => onBetClick(league.name, 'League', '1.85')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{league.flag}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg">{league.name}</h3>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          {league.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-400">{league.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm hidden md:block">View Markets</span>
                  <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}