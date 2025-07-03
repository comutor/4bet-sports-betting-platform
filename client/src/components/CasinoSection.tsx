import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CasinoGameData, sampleCasinoGames } from "@/lib/betting-data";

export function CasinoSection() {
  const [activeCategory, setActiveCategory] = useState('slots');

  const casinoCategories = [
    { id: 'slots', name: 'Slots', icon: 'fas fa-spade' },
    { id: 'table_games', name: 'Table Games', icon: 'fas fa-clubs' },
    { id: 'live_dealer', name: 'Live Dealer', icon: 'fas fa-user-tie' },
    { id: 'jackpots', name: 'Jackpots', icon: 'fas fa-dice' }
  ];

  const filteredGames = sampleCasinoGames.filter(game => 
    activeCategory === 'slots' || game.category === activeCategory
  );

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Casino Games</h2>
      
      {/* Casino Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {casinoCategories.map((category) => (
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
            <i className={`${category.icon} text-2xl mb-2`}></i>
            <div className="text-sm font-medium">{category.name}</div>
          </Button>
        ))}
      </div>

      {/* Featured Games */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-slate-custom rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
            <div className={`h-32 bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
              <i className={`${game.icon} text-4xl text-white`}></i>
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1">{game.name}</h3>
              <p className="text-sm text-gray-400 mb-3 capitalize">
                {game.category.replace('_', ' ')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-success font-bold">
                  {game.jackpotAmount || game.rtp || (game.isLive ? 'LIVE' : 'Play Now')}
                </span>
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary-blue-dark transition-colors"
                >
                  {game.isLive ? 'Join' : 'Play'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
