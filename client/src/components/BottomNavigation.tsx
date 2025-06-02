import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBetslipOpen: () => void;
  onMenuOpen: () => void;
  betslipCount: number;
  isLoggedIn?: boolean;
}

export function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  onBetslipOpen, 
  onMenuOpen,
  betslipCount,
  isLoggedIn = false
}: BottomNavigationProps) {
  const navItems = [
    { id: 'menu', label: 'Menu', icon: 'fas fa-bars' },
    { id: 'home', label: 'Sports', icon: 'fas fa-futbol' },
    { id: 'betslip', label: 'Betslip', icon: 'fas fa-receipt', count: betslipCount },
    { 
      id: isLoggedIn ? 'my-bets' : 'sign-up', 
      label: isLoggedIn ? 'My Bets' : 'Sign Up', 
      icon: isLoggedIn ? 'fas fa-history' : 'fas fa-user-plus' 
    },
    { id: 'account', label: 'Account', icon: 'fas fa-user' }
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'betslip') {
      onBetslipOpen();
    } else if (tabId === 'menu') {
      onMenuOpen();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-custom z-50">
      {/* Curved top border for betslip area */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-custom">
        <div className="grid grid-cols-5 max-w-md mx-auto h-full">
          <div></div>
          <div></div>
          <div className="flex justify-center">
            <div className="w-16 h-6 bg-slate-custom rounded-t-full border-t-2 border-l-2 border-r-2 border-gray-700"></div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      {/* Main navigation bar */}
      <div className="border-t border-gray-700 pt-2">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          {navItems.map((item, index) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center py-2 px-2 h-16 transition-colors relative ${
                activeTab === item.id || (item.id === 'home' && activeTab === 'sports')
                  ? 'text-primary' 
                  : 'text-gray-400 hover:bg-slate-light-custom'
              } ${index === 2 ? 'mt-[-8px]' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              {index === 2 ? (
                // Special circular design for betslip button
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-1 relative shadow-lg">
                    <i className={`${item.icon} text-white text-lg`}></i>
                    {item.count && item.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-live text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs leading-tight">{item.label}</span>
                </div>
              ) : (
                // Regular design for other buttons
                <>
                  <i className={`${item.icon} text-lg mb-1`}></i>
                  <span className="text-xs leading-tight">{item.label}</span>
                  {item.count && item.count > 0 && (
                    <span className="absolute top-1 right-1 bg-live text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
