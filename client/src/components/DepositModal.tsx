import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCountry?: string;
  currentBalance: string;
  onDepositSuccess: (amount: number) => void;
}

export function DepositModal({ isOpen, onClose, userCountry, currentBalance, onDepositSuccess }: DepositModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('mobile-money');
  const [amount, setAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      description: userCountry === 'Uganda' ? 'MTN Mobile Money, Airtel Money' : 'Zain Cash, MTN Money'
    },
    {
      id: 'bank-card',
      name: 'Bank Card',
      icon: '💳',
      description: 'Visa, Mastercard'
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Direct bank transfer'
    }
  ];

  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount.replace(',', ''));
  };

  const handleDeposit = async () => {
    if (!amount || !selectedMethod) return;

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const depositAmount = parseFloat(amount.replace(',', ''));
      onDepositSuccess(depositAmount);
      onClose();
    } catch (error) {
      console.error('Deposit failed:', error);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Deposit modal */}
      <div className="bg-slate-custom text-white w-full max-w-md mx-4 rounded-lg relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 rounded-t-lg border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <i className="fas fa-times text-lg"></i>
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Current Balance</div>
            <div className="text-2xl font-bold text-green-400">{getCurrency()} {currentBalance}</div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-white font-medium mb-3 block">Payment Method</Label>
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
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500"
                  onClick={() => handleAmountSelect(quickAmount)}
                >
                  {getCurrency()} {quickAmount}
                </Button>
              ))}
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
              Minimum: {getCurrency()} {userCountry === 'Uganda' ? '5,000' : '50'}
            </div>
          </div>

          {/* Phone Number for Mobile Money */}
          {selectedMethod === 'mobile-money' && (
            <div>
              <Label htmlFor="phone" className="text-white font-medium mb-2 block">
                Phone Number
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {userCountry === 'Uganda' ? '+256' : '+211'}
                </span>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="7XXXXXXXX"
                  className="pl-16 bg-slate-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Deposit Button */}
          <Button
            onClick={handleDeposit}
            disabled={!amount || !selectedMethod || isProcessing || (selectedMethod === 'mobile-money' && !phoneNumber)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Deposit ${getCurrency()} ${formatAmount(amount) || '0'}`
            )}
          </Button>

          {/* Security Notice */}
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="fas fa-shield-alt text-green-400 mt-0.5"></i>
              <div className="text-xs text-gray-300">
                <div className="font-medium mb-1">Secure Transaction</div>
                <div>Your payment information is encrypted and secure. Deposits are processed instantly.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}