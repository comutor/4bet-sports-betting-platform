import { Button } from "@/components/ui/button";

interface AccountPageProps {
  isLoggedIn?: boolean;
}

export function AccountPage({ isLoggedIn = false }: AccountPageProps) {
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
      <div className="bg-slate-800 p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Account</h1>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-4 text-sm">
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
                MY BETS
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
        </div>
      </div>
    </div>
  );
}