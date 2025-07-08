import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FeaturedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  time: string;
  odds: {
    home: string;
    draw?: string;
    away: string;
  };
}

interface FeaturedMatchesProps {
  onBetClick: (bet: any) => void;
}

export function FeaturedMatches({ onBetClick }: FeaturedMatchesProps) {
  const { data: featuredMatches, isLoading } = useQuery<FeaturedMatch[]>({
    queryKey: ['/api/featured-matches'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });

  if (isLoading) {
    return (
      <div className="w-full py-6">
        <h2 className="text-xl font-bold text-white mb-4">Featured Matches</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-400">Loading featured matches...</span>
        </div>
      </div>
    );
  }

  if (!featuredMatches || featuredMatches.length === 0) {
    return null;
  }

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football':
      case 'soccer':
        return '⚽';
      case 'basketball':
        return '🏀';
      case 'hockey':
        return '🏒';
      case 'tennis':
        return '🎾';
      case 'baseball':
        return '⚾';
      default:
        return '🏆';
    }
  };

  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-2xl mr-2">⭐</span>
        Featured Matches
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredMatches.slice(0, 4).map((match) => (
          <div
            key={match.id}
            className="bg-slate-800 rounded-lg border border-gray-700 p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getSportIcon(match.sport)}</span>
                <span className="text-sm text-gray-400">{match.league}</span>
              </div>
              <span className="text-xs text-gray-400">{match.time}</span>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-white font-medium text-sm">
                {match.homeTeam} vs {match.awayTeam}
              </div>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-3 py-1 h-8 border-gray-500 text-white hover:bg-blue-600 flex-1"
                onClick={() => onBetClick({
                  match: `${match.homeTeam} vs ${match.awayTeam}`,
                  selection: match.homeTeam,
                  odds: match.odds.home
                })}
              >
                {match.homeTeam} {match.odds.home}
              </Button>
              
              {match.odds.draw && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-3 py-1 h-8 border-gray-500 text-white hover:bg-blue-600"
                  onClick={() => onBetClick({
                    match: `${match.homeTeam} vs ${match.awayTeam}`,
                    selection: "Draw",
                    odds: match.odds.draw
                  })}
                >
                  Draw {match.odds.draw}
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-3 py-1 h-8 border-gray-500 text-white hover:bg-blue-600 flex-1"
                onClick={() => onBetClick({
                  match: `${match.homeTeam} vs ${match.awayTeam}`,
                  selection: match.awayTeam,
                  odds: match.odds.away
                })}
              >
                {match.awayTeam} {match.odds.away}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}