import { Button } from "@/components/ui/button";
import { sampleVirtualSports } from "@/lib/betting-data";

interface VirtualSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function VirtualSection({ onBetClick }: VirtualSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-robot text-primary mr-3"></i>
        Virtual Sports
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleVirtualSports.map((sport) => (
          <div key={sport.id} className="bg-slate-custom rounded-xl p-6 hover:border-primary border border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{sport.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                sport.status.includes('LIVE') 
                  ? 'bg-warning text-black' 
                  : sport.status.includes('Next')
                    ? 'bg-success text-white'
                    : 'bg-secondary text-white'
              }`}>
                {sport.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              {sport.matches.map((match, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{match.teams}</span>
                  <div className="flex space-x-2">
                    {match.odds.map((odd, oddIndex) => (
                      <Button
                        key={oddIndex}
                        variant="secondary"
                        size="sm"
                        className="bg-slate-light-custom hover:bg-primary px-2 py-1 transition-colors"
                        onClick={() => onBetClick(match.teams, `Option ${oddIndex + 1}`, odd)}
                      >
                        {odd}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-primary hover:bg-primary-blue-dark font-medium transition-colors">
              {sport.name.includes('Horses') ? 'Place Bet' : 'View All Markets'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
