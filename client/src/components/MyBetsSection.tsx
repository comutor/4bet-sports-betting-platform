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
  const [expandedBets, setExpandedBets] = useState<Set<number>>(new Set());
  
  const getCurrency = () => {
    return userCountry === 'Uganda' ? 'UGX' : 'SSP';
  };

  const toggleBetExpansion = (betId: number) => {
    setExpandedBets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(betId)) {
        newSet.delete(betId);
      } else {
        newSet.add(betId);
      }
      return newSet;
    });
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
      settledAt: bet.settledAt,
      currency: getCurrency()
    }));

    setBets(formattedBets);
    setLoading(false);
  }, [placedBets, userCountry]);

  const filteredBets = bets.filter(bet => {
    if (activeFilter === 'all') return true;
    return bet.status === activeFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <Trophy className="w-3 h-3" />;
      case 'lost':
        return <XCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'void':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'border-green-500 bg-green-500/10 text-green-400';
      case 'lost':
        return 'border-red-500 bg-red-500/10 text-red-400';
      case 'pending':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'void':
        return 'border-gray-500 bg-gray-500/10 text-gray-400';
      default:
        return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterCounts = {
    all: bets.length,
    pending: bets.filter(bet => bet.status === 'pending').length,
    won: bets.filter(bet => bet.status === 'won').length,
    lost: bets.filter(bet => bet.status === 'lost').length,
  };

  return (
    <div className="bg-slate-custom rounded-lg p-6">
      {/* Title */}
      <h2 className="text-xl font-bold flex items-center mb-4">
        <FileText className="w-5 h-5 mr-2" />
        My Bets
      </h2>
      
      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-slate-light-custom rounded-lg p-1">
          {(Object.keys(filterCounts) as Array<keyof typeof filterCounts>).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filterCounts[filter] > 0 && (
                <span className="ml-1 text-xs">({filterCounts[filter]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading bets...</span>
          </div>
        ) : filteredBets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No bets found</p>
            <p className="text-sm">
              {activeFilter === 'all' 
                ? "You haven't placed any bets yet. Start betting to see your bet history here!"
                : `You have no ${activeFilter} bets.`
              }
            </p>
          </div>
        ) : (
          filteredBets.map((bet) => {
            const isExpanded = expandedBets.has(bet.id);
            
            return (
              <div
                key={bet.id}
                className="bg-slate-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden"
              >
                {/* Collapsible Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => toggleBetExpansion(bet.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {bet.betType === 'single' ? 'Single Bet' : 'Accumulator'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bet.status)}`}>
                        {getStatusIcon(bet.status)}
                        <span className="ml-1 capitalize">{bet.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Stake</div>
                        <div className="font-bold">{bet.currency} {bet.totalStake}</div>
                      </div>
                      <div className="flex items-center">
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                      </div>
                    </div>
                  </div>

                  {/* Compact Summary for Collapsed State */}
                  {!isExpanded && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        {bet.selections.length === 1 
                          ? bet.selections[0].eventName
                          : `${bet.selections.length} selections`
                        }
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
                  )}
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-600">
                    <div className="pt-4">
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
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}