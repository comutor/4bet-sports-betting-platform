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

  const loggedOutMenuItems: any[] = []; // No menu items for unauthenticated users

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
        {!isLoggedIn ? (
          // Unauthenticated User Welcome Layout
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            {/* Centered Logo */}
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">
                <span className="text-blue-600 font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-lg filter brightness-110 contrast-125" style={{ 
                  fontFamily: 'Orbitron, sans-serif', 
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)',
                  letterSpacing: '2px'
                }}>
                  4
                </span>
                <span className="text-white font-bold" style={{ 
                  fontFamily: 'Orbitron, sans-serif', 
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '1px'
                }}>
                  bet
                </span>
              </div>
              <p className="text-gray-400 text-lg">Welcome to 4bet</p>
              <p className="text-gray-500 text-sm mt-2">Sign up or log in to start betting</p>
            </div>

            {/* Login/Signup Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <Button 
                className="bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 hover:scale-105 font-bold py-4 text-base w-full"
                onClick={onSignupClick}
              >
                SIGN UP
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold py-4 text-base w-full"
                onClick={onLoginClick}
              >
                LOG IN
              </Button>
            </div>
          </div>
        ) : (
          // Authenticated User Layout
          <div className="space-y-6">
            {/* Deposit/Withdraw Buttons */}
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
            </div>

            {/* Logout Button */}
            {onLogout && (
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
        )}
      </div>
    </div>
  );
}