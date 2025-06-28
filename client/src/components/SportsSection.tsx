import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApiQuotaNotice } from "@/components/ApiQuotaNotice";
import championsLeagueLogo from "@assets/IMG_4087.png";
import ligue1Logo from "@assets/IMG_4086.png";
import premierLeagueLogo from "@assets/Z.jpeg";
import serieALogo from "@assets/9k=.jpeg";
import bundesligaLogo from "@assets/IMG_4089.png";
import laLigaLogo from "@assets/IMG_4090.png";
import nbaLogo from "@assets/IMG_4098.png";
import vtbLogo from "@assets/IMG_4097.png";
import proALogo from "@assets/IMG_4096.jpeg";
import ligaEndesa from "@assets/IMG_4095.png";
import euroleagueLogo from "@assets/IMG_4094.png";
import turkishBslLogo from "@assets/IMG_4092.png";

interface SportsMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  odds: {
    home: string;
    draw?: string;
    away: string;
  };
  marketsCount: number;
}

interface SportsSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
  selectedSport?: string;
}

export function SportsSection({ onBetClick, selectedSport = 'soccer' }: SportsSectionProps) {
  const [currentSport, setCurrentSport] = useState(selectedSport);

  // Listen for sport selection events from hamburger menu
  useEffect(() => {
    const handleSportSelection = (event: CustomEvent) => {
      const sportId = event.detail.sport;
      setCurrentSport(sportId);
    };

    window.addEventListener('sportSelected', handleSportSelection as EventListener);
    
    return () => {
      window.removeEventListener('sportSelected', handleSportSelection as EventListener);
    };
  }, []);

  const footballCategories = [
    { id: 'premier-league', name: 'Premier League', icon: null, logo: premierLeagueLogo },
    { id: 'la-liga', name: 'La Liga', icon: null, logo: laLigaLogo },
    { id: 'bundesliga', name: 'Bundesliga', icon: null, logo: bundesligaLogo },
    { id: 'serie-a', name: 'Serie A', icon: null, logo: serieALogo },
    { id: 'ligue-1', name: 'French Ligue 1', icon: null, logo: ligue1Logo },
    { id: 'champions-league', name: 'Champions League', icon: null, logo: championsLeagueLogo }
  ];

  const basketballCategories = [
    { id: 'nba', name: 'NBA', icon: null, logo: nbaLogo },
    { id: 'euroleague', name: 'EuroLeague', icon: null, logo: euroleagueLogo },
    { id: 'liga-acb', name: 'Liga ACB', icon: null, logo: ligaEndesa },
    { id: 'turkish-bsl', name: 'Turkish Basketball Super League', icon: null, logo: turkishBslLogo },
    { id: 'vtb-league', name: 'Russian VTB United League', icon: null, logo: vtbLogo },
    { id: 'pro-a', name: 'Pro A', icon: null, logo: proALogo }
  ];

  const tennisCategories = [
    { id: 'atp', name: 'ATP Tour', icon: null, logo: null },
    { id: 'wta', name: 'WTA Tour', icon: null, logo: null },
    { id: 'grand-slam', name: 'Grand Slam', icon: null, logo: null },
    { id: 'masters-1000', name: 'Masters 1000', icon: null, logo: null }
  ];

  const hockeyCategories = [
    { id: 'nhl', name: 'NHL', icon: null, logo: null },
    { id: 'khl', name: 'KHL', icon: null, logo: null },
    { id: 'shl', name: 'Swedish Hockey League', icon: null, logo: null }
  ];

  const baseballCategories = [
    { id: 'mlb', name: 'MLB', icon: null, logo: null },
    { id: 'npb', name: 'Nippon Professional Baseball', icon: null, logo: null }
  ];

  const volleyballCategories = [
    { id: 'fivb', name: 'FIVB World Tour', icon: null, logo: null },
    { id: 'cev', name: 'CEV Champions League', icon: null, logo: null }
  ];

  const getSportsCategories = () => {
    switch (currentSport) {
      case 'basketball':
        return basketballCategories;
      case 'tennis':
        return tennisCategories;
      case 'hockey':
        return hockeyCategories;
      case 'baseball':
        return baseballCategories;
      case 'volleyball':
        return volleyballCategories;
      case 'football':
      case 'soccer':
      default:
        return footballCategories;
    }
  };

  const sportsCategories = getSportsCategories();
  const [activeCategory, setActiveCategory] = useState(sportsCategories[0]?.id || 'premier-league');

  const footballMatches: SportsMatch[] = [
    {
      id: 1,
      homeTeam: "Chelsea",
      awayTeam: "Arsenal",
      league: "Premier League",
      time: "Today 15:00",
      odds: { home: "2.75", draw: "3.20", away: "2.85" },
      marketsCount: 45
    },
    {
      id: 2,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      league: "La Liga",
      time: "Today 18:00",
      odds: { home: "2.10", draw: "3.50", away: "3.10" },
      marketsCount: 52
    }
  ];

  const basketballMatches: SportsMatch[] = [
    {
      id: 1,
      homeTeam: "Los Angeles Lakers",
      awayTeam: "Boston Celtics",
      league: "NBA",
      time: "Today 20:00",
      odds: { home: "1.85", away: "1.95" },
      marketsCount: 38
    },
    {
      id: 2,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      league: "EuroLeague",
      time: "Tomorrow 19:30",
      odds: { home: "1.75", away: "2.05" },
      marketsCount: 28
    },
    {
      id: 3,
      homeTeam: "Anadolu Efes",
      awayTeam: "Fenerbahce",
      league: "Turkish Basketball Super League",
      time: "Tomorrow 18:00",
      odds: { home: "1.65", away: "2.20" },
      marketsCount: 22
    }
  ];

  const getSportIcon = (sport: string) => {
    const category = sportsCategories.find(cat => cat.id === sport);
    return category?.icon || 'fas fa-trophy';
  };

  const getCurrentMatches = () => {
    switch (selectedSport) {
      case 'basketball':
        return basketballMatches;
      case 'soccer':
      default:
        return footballMatches;
    }
  };

  const currentMatches = getCurrentMatches();

  const getSportDisplayName = () => {
    switch (currentSport) {
      case 'basketball': return 'Basketball';
      case 'tennis': return 'Tennis';
      case 'hockey': return 'Ice Hockey';
      case 'baseball': return 'Baseball';
      case 'volleyball': return 'Volleyball';
      case 'football':
      case 'soccer':
      default: return 'Football';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">{getSportDisplayName()} - Upcoming Games</h2>
        <div className="text-sm text-gray-400 bg-slate-700 px-3 py-1 rounded-full">
          {sportsCategories.length} leagues available
        </div>
      </div>
      
      {/* Sports Categories */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {sportsCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "secondary"}
            className={`p-3 min-h-20 flex flex-col items-center justify-center text-center transition-colors ${
              activeCategory === category.id 
                ? 'bg-primary text-white' 
                : 'bg-slate-custom hover:bg-slate-light-custom'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.logo ? (
              <img 
                src={category.logo} 
                alt={category.name}
                className="w-8 h-8 mb-1 object-contain"
              />
            ) : (
              <i className={`${category.icon} text-lg mb-1`}></i>
            )}
            <div className={`font-medium text-center leading-tight whitespace-normal ${
              category.name.length > 12 ? 'text-xs' : 'text-sm'
            }`}>{category.name}</div>
          </Button>
        ))}
      </div>

      {/* Current Sport Matches */}
      <div className="space-y-4">
        {currentMatches.map((match) => (
            <div key={match.id} className="bg-slate-custom rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{match.league}</div>
                  <div className="text-sm text-gray-400">{match.time}</div>
                </div>
                <Button variant="ghost" className="text-primary hover:text-primary-blue-dark">
                  <i className="fas fa-plus mr-1"></i> {match.marketsCount} Markets
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <i className={getSportIcon('football')}></i>
                      </div>
                      <span className="font-medium">{match.homeTeam}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <i className={getSportIcon('football')}></i>
                      </div>
                      <span className="font-medium">{match.awayTeam}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="secondary"
                    className="bg-slate-light-custom hover:bg-primary text-center py-3 transition-colors"
                    onClick={() => onBetClick(`${match.homeTeam} vs ${match.awayTeam}`, match.homeTeam, match.odds.home)}
                  >
                    <div className="text-xs text-gray-400 mb-1">1</div>
                    <div className="font-bold text-lg">{match.odds.home}</div>
                  </Button>
                  {match.odds.draw && (
                    <Button
                      variant="secondary"
                      className="bg-slate-light-custom hover:bg-primary text-center py-3 transition-colors"
                      onClick={() => onBetClick(`${match.homeTeam} vs ${match.awayTeam}`, 'Draw', match.odds.draw!)}
                    >
                      <div className="text-xs text-gray-400 mb-1">X</div>
                      <div className="font-bold text-lg">{match.odds.draw}</div>
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    className="bg-slate-light-custom hover:bg-primary text-center py-3 transition-colors"
                    onClick={() => onBetClick(`${match.homeTeam} vs ${match.awayTeam}`, match.awayTeam, match.odds.away)}
                  >
                    <div className="text-xs text-gray-400 mb-1">2</div>
                    <div className="font-bold text-lg">{match.odds.away}</div>
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Show API quota notice when no matches available */}
      {currentMatches.length === 0 && (
        <ApiQuotaNotice 
          onContinueToVirtual={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onContinueToAviator={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      )}
    </div>
  );
}
