import { Button } from "@/components/ui/button";

interface AccountPageProps {
  isLoggedIn?: boolean;
  onClose?: () => void;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  onStatementClick?: () => void;
  userData?: any;
}

export function AccountPage({ isLoggedIn = false, onClose, onSignupClick, onLoginClick, onLogout, onDepositClick, onWithdrawClick, onStatementClick, userData }: AccountPageProps) {
  const loggedInMenuItems = [
    { id: 'deposit', label: 'Deposit', icon: 'fas fa-credit-card' },
    { id: 'withdraw', label: 'Withdraw', icon: 'fas fa-money-bill-wave' },
    { id: 'statement', label: 'Statement', icon: 'fas fa-file-alt' },
    { id: 'manage-account', label: 'Manage My Account', icon: 'fas fa-user-cog' }
  ];

  const loggedOutMenuItems = [
    { id: 'deposit', label: 'Deposit', icon: 'fas fa-credit-card' },
    { id: 'withdraw', label: 'Withdraw', icon: 'fas fa-money-bill-wave' }
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : loggedOutMenuItems;

  return (
    <div className="min-h-screen bg-slate-custom text-white pb-20">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Account</h1>
          {isLoggedIn && userData?.phoneNumber && (
            <p className="text-sm text-gray-400 mt-1">{userData.phoneNumber}</p>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <i className="fas fa-times text-2xl"></i>
          </Button>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          {!isLoggedIn ? (
            <div className="flex gap-3">
              <Button 
                className="bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 hover:scale-105 font-bold py-4 text-sm"
                onClick={onSignupClick}
              >
                SIGN UP
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold py-4 text-sm"
                onClick={onLoginClick}
              >
                LOG IN
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                className="bg-transparent border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold py-4"
                onClick={onDepositClick}
              >
                DEPOSIT
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold py-4"
                onClick={onWithdrawClick}
              >
                WITHDRAW
              </Button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-between p-4 text-left text-gray-300 hover:bg-slate-light-custom transition-all duration-200 rounded-xl border border-slate-600 hover:border-slate-500"
              onClick={() => {
                if (item.id === 'deposit' && onDepositClick) {
                  onDepositClick();
                } else if (item.id === 'withdraw' && onWithdrawClick) {
                  onWithdrawClick();
                } else if (item.id === 'statement' && onStatementClick) {
                  onStatementClick();
                } else if (item.id === 'manage-account') {
                  console.log('Manage account clicked');
                }
              }}
            >
              <div className="flex items-center">
                <i className={`${item.icon} w-5 mr-3 text-gray-400`}></i>
                <span className="text-base font-medium">{item.label}</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
            </Button>
          ))}

          {/* Logout Button for logged-in users */}
          {isLoggedIn && onLogout && (
            <Button
              variant="ghost"
              className="w-full justify-between p-4 text-left text-red-400 hover:bg-red-900/20 transition-all duration-200 rounded-xl border border-red-600/50 hover:border-red-500 mt-6"
              onClick={onLogout}
            >
              <div className="flex items-center">
                <i className="fas fa-sign-out-alt w-5 mr-3 text-red-400"></i>
                <span className="text-base font-medium">Logout</span>
              </div>
              <i className="fas fa-chevron-right text-red-400 text-sm"></i>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}