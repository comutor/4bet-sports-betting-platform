import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, XCircle, Loader2, Filter, FileText } from 'lucide-react';

interface BetSelection {
  eventName: string;
  selection: string;
  odds: string;
  status?: 'won' | 'lost' | 'pending' | 'void';
}

interface UserBet {
  id: number;
  betType: 'single' | 'accumulator';
  selections: BetSelection[];
  totalStake: string;
  potentialReturn: string;
  status: 'pending' | 'won' | 'lost' | 'void';
  placedAt: string;
  settledAt?: string;
  currency: string;
}

interface MyBetsSectionProps {
  userId?: number;
  userCountry?: string;
  placedBets?: any[];
}

export function MyBetsSection({ userId, userCountry, placedBets = [] }: MyBetsSectionProps) {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');
  
  const getCurrency = () => {
    return userCountry === 'Uganda' ? 'UGX' : 'SSP';
  };

  useEffect(() => {
    // Convert placedBets to the expected format
    const formattedBets = placedBets.map((bet: any) => ({
      id: bet.id,
      betType: bet.type,
      selections: bet.type === 'accumulator' && bet.selections ? bet.selections.map((sel: any) => ({
        eventName: sel.eventName,
        selection: sel.selection,
        odds: sel.odds.toString(),
        status: bet.status
      })) : [{
        eventName: bet.eventName,
        selection: bet.selection,
        odds: bet.odds.toString(),
        status: bet.status
      }],
      totalStake: bet.stake.toString(),
      potentialReturn: bet.potentialReturn.toString(),
      status: bet.status,
      placedAt: bet.placedAt,
      currency: getCurrency()
    }));
    
    setBets(formattedBets);
    setLoading(false);
  }, [placedBets, userCountry]);

  const filteredBets = bets.filter(bet => 
    activeFilter === 'all' ? true : bet.status === activeFilter
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'won':
        return <Trophy className="w-4 h-4 text-success" />;
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'void':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'won':
        return 'text-success bg-success/10 border-success/20';
      case 'lost':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'void':
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default:
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Bets</h1>
        <p className="text-gray-400">Track your betting history and winnings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex mb-6 bg-slate-800 rounded-lg p-1">
        {(['all', 'pending', 'won', 'lost'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize ${
              activeFilter === filter
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Bets List */}
      <div className="space-y-4">
        {filteredBets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              {activeFilter === 'all' ? 'No bets placed yet' : `No ${activeFilter} bets`}
            </h3>
            <p className="text-gray-500">
              {activeFilter === 'all' 
                ? 'Start betting to see your bet history here' 
                : `You have no ${activeFilter} bets at the moment`
              }
            </p>
          </div>
        ) : (
          filteredBets.map((bet) => (
            <div
              key={bet.id}
              className="bg-slate-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* Bet Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {bet.betType === 'single' ? 'Single Bet' : 'Accumulator'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bet.status)}`}>
                    {getStatusIcon(bet.status)}
                    <span className="ml-1 capitalize">{bet.status}</span>
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Stake</div>
                  <div className="font-bold">{bet.currency} {bet.totalStake}</div>
                </div>
              </div>

              {/* Selections */}
              <div className="space-y-2 mb-3">
                {bet.selections.map((selection, index) => (
                  <div key={index} className="bg-slate-700 rounded p-3">
                    <div className="font-medium text-sm">{selection.eventName}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-300 text-sm">{selection.selection}</span>
                      <span className="font-bold text-primary">{selection.odds}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bet Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(bet.placedAt)}</span>
                  </div>
                  {bet.settledAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Settled {formatDate(bet.settledAt)}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {bet.status === 'won' ? 'Won' : 'Potential Return'}
                  </div>
                  <div className={`font-bold ${
                    bet.status === 'won' ? 'text-success' : 
                    bet.status === 'lost' ? 'text-red-500' : 'text-gray-300'
                  }`}>
                    {bet.currency} {bet.potentialReturn}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}