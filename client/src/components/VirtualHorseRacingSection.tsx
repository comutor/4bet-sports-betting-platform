import { useState, useEffect } from "react";
import { Crown, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Horse {
  id: string;
  name: string;
  jockey: string;
  odds: string;
  position?: number;
  color: string;
}

interface Race {
  id: string;
  name: string;
  track: string;
  distance: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  horses: Horse[];
  timeLeft?: string;
  currentLeader?: string;
}

interface VirtualHorseRacingSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function VirtualHorseRacingSection({ onBetClick }: VirtualHorseRacingSectionProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Generate virtual races
  useEffect(() => {
    const generateRaces = () => {
      const horseNames = [
        "Thunder Bolt", "Lightning Strike", "Storm Chaser", "Wind Walker",
        "Fire Storm", "Night Rider", "Star Gazer", "Golden Arrow",
        "Silver Bullet", "Black Diamond", "Royal Prince", "Desert Wind",
        "Ocean Wave", "Mountain Peak", "Valley Runner", "Sky Dancer"
      ];

      const jockeys = [
        "M. Johnson", "S. Williams", "R. Davis", "A. Brown", "K. Wilson",
        "L. Miller", "D. Garcia", "C. Rodriguez", "J. Martinez", "T. Anderson"
      ];

      const tracks = [
        "Royal Downs", "Sunset Valley", "Golden Gate Track", "Victory Park",
        "Champions Field", "Derby Meadows", "Elite Racing Circuit"
      ];

      const colors = [
        "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
        "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
      ];

      const newRaces: Race[] = [];
      const now = new Date();

      // Generate 4 races
      for (let i = 0; i < 4; i++) {
        const startTime = new Date(now.getTime() + (i * 2 * 60 * 1000)); // Every 2 minutes
        const status = i === 0 ? 'live' : 'upcoming';
        
        // Generate 6-8 horses per race
        const numHorses = 6 + Math.floor(Math.random() * 3);
        const raceHorses: Horse[] = [];
        
        for (let j = 0; j < numHorses; j++) {
          raceHorses.push({
            id: `horse-${i}-${j}`,
            name: horseNames[Math.floor(Math.random() * horseNames.length)],
            jockey: jockeys[Math.floor(Math.random() * jockeys.length)],
            odds: (2.0 + Math.random() * 8).toFixed(1),
            color: colors[j % colors.length],
            position: status === 'live' ? Math.floor(Math.random() * numHorses) + 1 : undefined
          });
        }

        // Sort by position if live
        if (status === 'live') {
          raceHorses.sort((a, b) => (a.position || 0) - (b.position || 0));
        }

        newRaces.push({
          id: `race-${i}`,
          name: `Race ${i + 1}`,
          track: tracks[Math.floor(Math.random() * tracks.length)],
          distance: ['1200m', '1400m', '1600m', '2000m'][Math.floor(Math.random() * 4)],
          startTime: startTime.toISOString(),
          status,
          horses: raceHorses,
          currentLeader: status === 'live' ? raceHorses[0]?.name : undefined
        });
      }

      setRaces(newRaces);
    };

    generateRaces();
    const interval = setInterval(generateRaces, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeUntilRace = (timeString: string) => {
    const raceTime = new Date(timeString);
    const diff = raceTime.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (diff <= 0) return "LIVE";
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-white">Virtual Horse Racing</h2>
        </div>
        <div className="text-xs text-slate-400">
          Races every 2 minutes
        </div>
      </div>

      <div className="grid gap-4">
        {races.map((race) => (
          <div key={race.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            {/* Race Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-white">{race.name}</h3>
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>{race.track}</span>
                  <span>{race.distance}</span>
                  <span>{race.horses.length} runners</span>
                </div>
              </div>
              <div className="text-right">
                {race.status === 'live' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-500 font-medium">LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {getTimeUntilRace(race.startTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Leader (Live Only) */}
            {race.status === 'live' && race.currentLeader && (
              <div className="mb-4 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-yellow-400">
                    Leading: {race.currentLeader}
                  </span>
                </div>
              </div>
            )}

            {/* Horses Grid */}
            <div className="grid gap-2">
              {race.horses.slice(0, 6).map((horse, index) => (
                <div key={horse.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${horse.color}`}></div>
                    <div>
                      <div className="text-sm font-medium text-white">{horse.name}</div>
                      <div className="text-xs text-slate-400">{horse.jockey}</div>
                    </div>
                    {race.status === 'live' && horse.position && (
                      <div className="text-xs font-bold text-yellow-400">
                        #{horse.position}
                      </div>
                    )}
                  </div>
                  
                  {race.status !== 'finished' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-slate-600 border-slate-500 hover:bg-blue-600 hover:border-blue-600 text-white px-3"
                      onClick={() => onBetClick(
                        `${race.name} - ${race.track}`,
                        `${horse.name} to Win`,
                        horse.odds
                      )}
                      disabled={race.status === 'live'}
                    >
                      <div className="text-center">
                        <div className="font-bold">{horse.odds}</div>
                      </div>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {race.status === 'live' && (
              <div className="mt-3 text-center">
                <span className="text-xs text-yellow-500">
                  Race in progress - betting closed
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <div className="text-xs text-slate-400">
          Next race starts in {getTimeUntilRace(races[1]?.startTime || new Date().toISOString())}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <div className="text-center">
          <h4 className="font-medium text-white mb-1">Virtual Horse Racing</h4>
          <p className="text-xs text-slate-300">
            Experience the thrill of horse racing with realistic odds and exciting finishes. 
            Races run every 2 minutes with 6-8 runners per race.
          </p>
        </div>
      </div>
    </div>
  );
}