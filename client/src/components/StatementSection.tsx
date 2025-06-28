import { useState, useEffect } from 'react';
import { ChevronLeft, Download, Calendar, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  balance?: string;
}

interface StatementSectionProps {
  onBack?: () => void;
  userCountry?: string;
  userId?: number;
}

export function StatementSection({ onBack, userCountry, userId }: StatementSectionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'bet' | 'win'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const getCurrency = () => {
    return userCountry === 'Uganda' ? 'UGX' : 'SSP';
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId, filter, dateRange]);

  const fetchTransactions = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user/transactions?userId=${userId}&filter=${filter}&range=${dateRange}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↗️';
      case 'withdrawal':
        return '↙️';
      case 'bet':
        return '🎯';
      case 'win':
        return '🏆';
      case 'bonus':
        return '🎁';
      default:
        return '💰';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'win':
      case 'bonus':
        return 'text-green-400';
      case 'withdrawal':
      case 'bet':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const prefix = ['deposit', 'win', 'bonus'].includes(type) ? '+' : '-';
    return `${prefix}${amount}`;
  };

  const exportStatement = () => {
    // Create CSV content
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Status', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type,
        `"${t.description}"`,
        formatAmount(t.amount, t.type),
        t.status,
        t.balance || ''
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4bet-statement-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-custom text-white">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-white">Statement</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportStatement}
          className="text-white border-gray-600 hover:bg-slate-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-slate-light-custom border-b border-gray-700">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {['all', 'deposit', 'withdrawal', 'bet', 'win'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type as any)}
              className={`capitalize ${filter === type ? 'bg-blue-600 text-white' : 'text-gray-400 border-gray-600 hover:bg-slate-600'}`}
            >
              {type === 'all' ? 'All Transactions' : type}
            </Button>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: '90d', label: 'Last 90 Days' },
            { key: 'all', label: 'All Time' }
          ].map((range) => (
            <Button
              key={range.key}
              variant={dateRange === range.key ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range.key as any)}
              className={`${dateRange === range.key ? 'bg-blue-600 text-white' : 'text-gray-400 border-gray-600 hover:bg-slate-600'}`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Transactions Found</h3>
            <p className="text-gray-400">No transactions match your current filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-slate-light-custom rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white capitalize">
                        {transaction.type}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                      {formatAmount(transaction.amount, transaction.type)} {getCurrency()}
                    </div>
                    <div className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.toUpperCase()}
                    </div>
                    {transaction.balance && (
                      <div className="text-xs text-gray-400">
                        Balance: {transaction.balance} {getCurrency()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}