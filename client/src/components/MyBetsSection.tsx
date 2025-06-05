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
}

export function MyBetsSection({ userId, userCountry }: MyBetsSectionProps) {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');
  
  const getCurrency = () => {
    return userCountry === 'Uganda' ? 'UGX' : 'SSP';
  };

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
          const currency = getCurrency();
          formattedBets = [
            {
              id: 1,
              betType: 'single',
              selections: [{
                eventName: 'Manchester United vs Liverpool',
                selection: 'Manchester United Win',
                odds: '2.10',
                status: 'pending'
              }],
              totalStake: '50.00',
              potentialReturn: '105.00',
              status: 'pending',
              currency: currency,
              placedAt: new Date().toISOString()
            },
            {
              id: 2,
              betType: 'accumulator',
              selections: [
                {
                  eventName: 'Arsenal vs Chelsea',
                  selection: 'Arsenal Win',
                  odds: '1.80',
                  status: 'won'
                },
                {
                  eventName: 'Barcelona vs Real Madrid',
                  selection: 'Over 2.5 Goals',
                  odds: '1.65',
                  status: 'won'
                }
              ],
              totalStake: '25.00',
              potentialReturn: '74.25',
              status: 'won',
              currency: currency,
              placedAt: new Date(Date.now() - 86400000).toISOString(),
              settledAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 3,
              betType: 'single',
              selections: [{
                eventName: 'Brazil vs Argentina',
                selection: 'Brazil Win',
                odds: '2.40',
                status: 'lost'
              }],
              totalStake: '30.00',
              potentialReturn: '72.00',
              status: 'lost',
              currency: currency,
              placedAt: new Date(Date.now() - 172800000).toISOString(),
              settledAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 4,
              betType: 'accumulator',
              selections: [
                {
                  eventName: 'Lakers vs Warriors',
                  selection: 'Lakers +5.5',
                  odds: '1.90',
                  status: 'lost'
                },
                {
                  eventName: 'Chelsea vs Manchester City',
                  selection: 'Under 2.5 Goals',
                  odds: '2.20',
                  status: 'pending'
                }
              ],
              totalStake: '40.00',
              potentialReturn: '167.20',
              status: 'lost',
              currency: currency,
              placedAt: new Date(Date.now() - 7200000).toISOString(),
              settledAt: new Date(Date.now() - 3600000).toISOString()
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
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getCardColor = (status: string) => {
    switch (status) {
      case 'won': return 'border-green-200 bg-green-50/30';
      case 'lost': return 'border-red-200 bg-red-50/30';
      case 'void': return 'border-gray-200 bg-gray-50/30';
      default: return 'border-amber-200 bg-amber-50/30';
    }
  };

  const getSelectionBgColor = (status?: string) => {
    switch (status) {
      case 'won': return 'bg-green-100 border-green-200';
      case 'lost': return 'bg-red-100 border-red-200';
      case 'void': return 'bg-gray-100 border-gray-200';
      case 'pending': return 'bg-amber-100 border-amber-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const calculateTotalOdds = (selections: BetSelection[]) => {
    return selections.reduce((total, selection) => total * parseFloat(selection.odds), 1).toFixed(2);
  };

  const getPayoutDisplay = (bet: UserBet) => {
    if (bet.status === 'lost') {
      return <span className="font-medium text-red-600">Lost</span>;
    } else if (bet.status === 'won') {
      return <span className="font-medium text-green-600 font-bold">{bet.potentialReturn} {bet.currency}</span>;
    } else {
      return <span className="font-medium text-gray-900">{bet.potentialReturn} {bet.currency}</span>;
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
            <div key={bet.id} className={`bg-white border-2 rounded-lg p-4 shadow-sm ${getCardColor(bet.status)}`}>
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
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${getSelectionBgColor(selection.status)}`}>
                    <div>
                      <div className="font-medium text-gray-900">{selection.eventName}</div>
                      <div className="text-sm text-gray-600">{selection.selection}</div>
                      {selection.status && (
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selection.status)}`}>
                          {selection.status.charAt(0).toUpperCase() + selection.status.slice(1)}
                        </div>
                      )}
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
                  <div className="text-sm text-gray-500">Total Odds</div>
                  <div className="font-medium text-gray-900">{calculateTotalOdds(bet.selections)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payout</div>
                  <div>{getPayoutDisplay(bet)}</div>
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