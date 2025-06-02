import { useState } from "react";
import { Button } from "@/components/ui/button";
import championsLeagueLogo from "@assets/IMG_4087.png";
import ligue1Logo from "@assets/IMG_4086.png";
import premierLeagueLogo from "@assets/Z.jpeg";
import serieALogo from "@assets/9k=.jpeg";
import bundesligaLogo from "@assets/IMG_4089.png";

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
}

export function SportsSection({ onBetClick }: SportsSectionProps) {
  const [activeCategory, setActiveCategory] = useState('premier-league');

  const sportsCategories = [
    { id: 'premier-league', name: 'Premier League', icon: null, logo: premierLeagueLogo },
    { id: 'la-liga', name: 'La Liga', icon: 'fas fa-sun', logo: null },
    { id: 'bundesliga', name: 'Bundesliga', icon: null, logo: bundesligaLogo },
    { id: 'serie-a', name: 'Serie A', icon: null, logo: serieALogo },
    { id: 'ligue-1', name: 'French Ligue 1', icon: null, logo: ligue1Logo },
    { id: 'champions-league', name: 'Champions League', icon: null, logo: championsLeagueLogo }
  ];

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

  const getSportIcon = (sport: string) => {
    const category = sportsCategories.find(cat => cat.id === sport);
    return category?.icon || 'fas fa-trophy';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Leagues</h2>
      
      {/* Sports Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {sportsCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "secondary"}
            className={`p-4 text-center transition-colors ${
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
                className="w-8 h-8 mb-2 object-contain"
              />
            ) : (
              <i className={`${category.icon} text-2xl mb-2`}></i>
            )}
            <div className="text-sm font-medium">{category.name}</div>
          </Button>
        ))}
      </div>

      {/* Football Matches */}
      {activeCategory === 'football' && (
        <div className="space-y-4">
          {footballMatches.map((match) => (
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
      )}

      {/* Other sports placeholder */}
      {activeCategory !== 'football' && (
        <div className="text-center py-12">
          <i className={`${getSportIcon(activeCategory)} text-6xl text-gray-600 mb-4`}></i>
          <h3 className="text-xl font-bold mb-2">
            {sportsCategories.find(cat => cat.id === activeCategory)?.name} Coming Soon
          </h3>
          <p className="text-gray-400">Stay tuned for exciting betting opportunities!</p>
        </div>
      )}
    </div>
  );
}
