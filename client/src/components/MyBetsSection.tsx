import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, XCircle, Loader2, Filter, FileText } from 'lucide-react';

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
        let formattedBets = userBets.map((bet: any) => ({
          ...bet,
          selections: JSON.parse(bet.selections)
        }));
        
        // Add sample bets for demonstration if no bets exist
        if (formattedBets.length === 0) {
          formattedBets = [
            {
              id: 1,
              betType: 'single',
              selections: [{
                eventName: 'Manchester United vs Liverpool',
                selection: 'Manchester United Win',
                odds: '2.10'
              }],
              totalStake: '50.00',
              potentialReturn: '105.00',
              status: 'pending',
              currency: 'SSP',
              placedAt: new Date().toISOString()
            },
            {
              id: 2,
              betType: 'accumulator',
              selections: [
                {
                  eventName: 'Arsenal vs Chelsea',
                  selection: 'Arsenal Win',
                  odds: '1.80'
                },
                {
                  eventName: 'Barcelona vs Real Madrid',
                  selection: 'Over 2.5 Goals',
                  odds: '1.65'
                }
              ],
              totalStake: '25.00',
              potentialReturn: '74.25',
              status: 'won',
              currency: 'SSP',
              placedAt: new Date(Date.now() - 86400000).toISOString(),
              settledAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 3,
              betType: 'single',
              selections: [{
                eventName: 'Brazil vs Argentina',
                selection: 'Brazil Win',
                odds: '2.40'
              }],
              totalStake: '30.00',
              potentialReturn: '72.00',
              status: 'lost',
              currency: 'SSP',
              placedAt: new Date(Date.now() - 172800000).toISOString(),
              settledAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 4,
              betType: 'single',
              selections: [{
                eventName: 'Lakers vs Warriors',
                selection: 'Lakers +5.5',
                odds: '1.90'
              }],
              totalStake: '40.00',
              potentialReturn: '76.00',
              status: 'pending',
              currency: 'SSP',
              placedAt: new Date(Date.now() - 7200000).toISOString()
            }
          ];
        }
        
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
        <h1 className="text-2xl font-bold text-white">My Bets</h1>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-white" />
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Bets</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Bets Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 px-4 py-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-600 font-medium">Total Bets</div>
            <div className="text-lg font-bold text-blue-600">{bets.length}</div>
          </div>
          <FileText className="w-5 h-5 text-blue-600 opacity-60" />
        </div>
        <div className="bg-yellow-50 px-4 py-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-yellow-600 font-medium">Pending</div>
            <div className="text-lg font-bold text-yellow-600">
              {bets.filter(b => b.status === 'pending').length}
            </div>
          </div>
          <Clock className="w-5 h-5 text-yellow-600 opacity-60" />
        </div>
        <div className="bg-green-50 px-4 py-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-green-600 font-medium">Won</div>
            <div className="text-lg font-bold text-green-600">
              {bets.filter(b => b.status === 'won').length}
            </div>
          </div>
          <Trophy className="w-5 h-5 text-green-600 opacity-60" />
        </div>
        <div className="bg-red-50 px-4 py-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-red-600 font-medium">Lost</div>
            <div className="text-lg font-bold text-red-600">
              {bets.filter(b => b.status === 'lost').length}
            </div>
          </div>
          <XCircle className="w-5 h-5 text-red-600 opacity-60" />
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