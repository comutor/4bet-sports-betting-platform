import { Button } from "@/components/ui/button";

interface AccountPageProps {
  isLoggedIn?: boolean;
  onClose?: () => void;
  onSignupClick?: () => void;
  onLogout?: () => void;
}

export function AccountPage({ isLoggedIn = false, onClose, onSignupClick, onLogout }: AccountPageProps) {
  const menuItems = [
    { id: 'why-join', label: 'Why Join?', icon: 'fas fa-question-circle' },
    { id: 'deposit', label: 'Deposit', icon: 'fas fa-credit-card' },
    { id: 'help-center', label: 'Help Center', icon: 'fas fa-life-ring' },
    { id: 'download-app', label: 'Download the App', icon: 'fas fa-mobile-alt' },
    { id: 'more-nilebet', label: 'More on NileBet', icon: 'fas fa-info-circle' }
  ];

  return (
    <div className="min-h-screen bg-slate-custom text-white pb-20">
      {/* Header */}
      <div className="bg-slate-800 p-6 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Account</h1>
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
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm"
                onClick={onSignupClick}
              >
                SIGN UP
              </Button>
              <Button variant="outline" className="border-2 border-gray-400 text-gray-300 hover:bg-slate-700 font-bold py-4 text-sm">
                LOG IN
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-4">
                DEPOSIT
              </Button>
              <Button variant="outline" className="border-gray-400 text-gray-300 hover:bg-slate-700 font-bold py-4">
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