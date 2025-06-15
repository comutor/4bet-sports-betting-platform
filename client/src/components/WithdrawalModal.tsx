import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCountry?: string;
  currentBalance: string;
  onWithdrawalSuccess: (amount: number) => void;
}

export function WithdrawalModal({ isOpen, onClose, userCountry, currentBalance, onWithdrawalSuccess }: WithdrawalModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('mobile-money');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getCurrency = () => {
    return userCountry === 'Uganda' ? 'UGX' : 'SSP';
  };

  const quickAmounts = userCountry === 'Uganda' 
    ? ['10,000', '20,000', '50,000', '100,000', '200,000', '500,000']
    : ['100', '500', '1,000', '2,000', '5,000', '10,000'];

  const paymentMethods = [
    {
      id: 'mobile-money',
      name: 'Mobile Money',
      icon: '📱',
      description: userCountry === 'Uganda' ? 'MTN Mobile Money, Airtel Money' : 'MTN Money'
    }
  ];

  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount.replace(',', ''));
  };

  const getCurrentBalanceNumber = () => {
    return parseFloat(currentBalance.replace(/,/g, '')) || 0;
  };

  const getMaxWithdrawal = () => {
    const balance = getCurrentBalanceNumber();
    // Allow withdrawal up to current balance
    return balance;
  };

  const handleWithdrawal = async () => {
    if (!amount || !selectedMethod) return;

    const withdrawalAmount = parseFloat(amount.replace(',', ''));
    const availableBalance = getCurrentBalanceNumber();

    if (withdrawalAmount > availableBalance) {
      alert(`Insufficient balance. Maximum withdrawal: ${getCurrency()} ${availableBalance.toLocaleString()}`);
      return;
    }

    const minWithdrawal = userCountry === 'Uganda' ? 10000 : 100;
    if (withdrawalAmount < minWithdrawal) {
      alert(`Minimum withdrawal amount is ${getCurrency()} ${minWithdrawal.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onWithdrawalSuccess(withdrawalAmount);
      onClose();
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (value: string) => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numValue) ? '' : numValue.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Withdrawal modal */}
      <div className="bg-slate-custom text-white w-full max-w-md rounded-lg relative z-10 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 rounded-t-lg border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <i className="fas fa-times text-lg"></i>
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Current Balance */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Available Balance</div>
            <div className="text-2xl font-bold text-green-400">{getCurrency()} {currentBalance}</div>
            <div className="text-xs text-gray-400 mt-1">
              Maximum withdrawal: {getCurrency()} {getCurrentBalanceNumber().toLocaleString()}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-white font-medium mb-3 block">Withdrawal Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-white">{method.name}</div>
                      <div className="text-sm text-gray-400">{method.description}</div>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="fas fa-check text-white text-xs"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Amount Selection */}
          <div>
            <Label className="text-white font-medium mb-3 block">Quick Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => {
                const numAmount = parseFloat(quickAmount.replace(',', ''));
                const isDisabled = numAmount > getCurrentBalanceNumber();
                return (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    disabled={isDisabled}
                    className={`border-gray-600 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500 ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => !isDisabled && handleAmountSelect(quickAmount)}
                  >
                    {getCurrency()} {quickAmount}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="amount" className="text-white font-medium mb-2 block">
              Enter Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {getCurrency()}
              </span>
              <Input
                id="amount"
                type="text"
                value={formatAmount(amount)}
                onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))}
                placeholder="0"
                className="pl-16 bg-slate-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Minimum: {getCurrency()} {userCountry === 'Uganda' ? '10,000' : '100'}
            </div>
          </div>

          {/* Withdrawal Button */}
          <Button
            onClick={handleWithdrawal}
            disabled={!amount || !selectedMethod || isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Withdraw ${getCurrency()} ${formatAmount(amount) || '0'}`
            )}
          </Button>

          {/* Security Notice */}
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="fas fa-shield-alt text-orange-400 mt-0.5"></i>
              <div className="text-xs text-gray-300">
                <div className="font-medium mb-1">Withdrawal Process</div>
                <div>Withdrawals are processed within 24 hours. Funds will be sent to your registered mobile money account.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}