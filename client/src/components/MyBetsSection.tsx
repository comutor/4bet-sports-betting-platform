import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, XCircle, Loader2, Filter } from 'lucide-react';

interface BetSelection {
  eventName: string;
  selection: string;
  odds: string;
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
}

export function MyBetsSection({ userId }: MyBetsSectionProps) {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  useEffect(() => {
    if (userId) {
      fetchUserBets();
    }
  }, [userId]);

  const fetchUserBets = async () => {
    try {
      const response = await fetch(`/api/user-bets/${userId}`);
      if (response.ok) {
        const userBets = await response.json();
        const formattedBets = userBets.map((bet: any) => ({
          ...bet,
          selections: JSON.parse(bet.selections)
        }));
        setBets(formattedBets);
      }
    } catch (error) {
      console.error('Error fetching user bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBets = bets.filter(bet => 
    activeFilter === 'all' ? true : bet.status === activeFilter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <Trophy className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'void':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-green-600 bg-green-50';
      case 'lost': return 'text-red-600 bg-red-50';
      case 'void': return 'text-gray-600 bg-gray-50';
      default: return 'text-yellow-600 bg-yellow-50';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading your bets...</span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bets</h1>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Bets</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Bets Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{bets.length}</div>
          <div className="text-sm text-blue-600">Total Bets</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {bets.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {bets.filter(b => b.status === 'won').length}
          </div>
          <div className="text-sm text-green-600">Won</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">
            {bets.filter(b => b.status === 'lost').length}
          </div>
          <div className="text-sm text-red-600">Lost</div>
        </div>
      </div>

      {/* Bets List */}
      {filteredBets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Trophy className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bets found</h3>
          <p className="text-gray-500">
            {activeFilter === 'all' 
              ? "You haven't placed any bets yet. Start betting to see your history here!"
              : `No ${activeFilter} bets found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <div key={bet.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* Bet Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(bet.status)}
                  <div>
                    <span className="font-medium text-gray-900">
                      {bet.betType === 'accumulator' ? 'Accumulator' : 'Single'} Bet
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(bet.placedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Selections */}
              <div className="space-y-2 mb-4">
                {bet.selections.map((selection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{selection.eventName}</div>
                      <div className="text-sm text-gray-600">{selection.selection}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{selection.odds}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bet Details */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-500">Stake</div>
                  <div className="font-medium text-gray-900">{bet.totalStake} {bet.currency}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Potential Return</div>
                  <div className="font-medium text-gray-900">{bet.potentialReturn} {bet.currency}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Potential Profit</div>
                  <div className="font-medium text-green-600">
                    {(parseFloat(bet.potentialReturn) - parseFloat(bet.totalStake)).toFixed(2)} {bet.currency}
                  </div>
                </div>
              </div>

              {/* Settlement Info */}
              {bet.settledAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Settled on {formatDate(bet.settledAt)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}