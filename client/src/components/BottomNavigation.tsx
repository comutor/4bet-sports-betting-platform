import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBetslipOpen: () => void;
  onMenuOpen: () => void;
  onSignupClick?: () => void;
  betslipCount: number;
  isLoggedIn?: boolean;
  isMenuOpen?: boolean;
}

export function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  onBetslipOpen, 
  onMenuOpen,
  onSignupClick,
  betslipCount,
  isLoggedIn = false,
  isMenuOpen = false
}: BottomNavigationProps) {
  const navItems = [
    { id: 'menu', label: 'Menu', icon: 'fas fa-bars' },
    { id: 'sports', label: 'Sports', icon: 'fas fa-futbol' },
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
    } else if (tabId === 'sign-up' && !isLoggedIn && onSignupClick) {
      onSignupClick();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-slate-custom z-50 transition-transform duration-300 ${
      isMenuOpen ? 'transform translate-y-full' : 'transform translate-y-0'
    }`}>
      {/* Navigation bar with curved cutout */}
      <div className="relative">
        {/* Main border with curved cutout for betslip */}
        <div className="border-t border-gray-700 relative">
          {/* Curved cutout in the center */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px">
            <div className="w-20 h-8 bg-slate-custom rounded-b-full border-l border-r border-gray-700"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 max-w-md mx-auto pt-2">
          {navItems.map((item, index) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center py-2 px-2 h-16 transition-colors relative ${
                activeTab === item.id || (item.id === 'home' && activeTab === 'sports')
                  ? 'text-primary' 
                  : 'text-gray-400 hover:bg-slate-light-custom'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleTabClick(item.id);
              }}
            >
              {index === 2 ? (
                // Special circular design for betslip button
                <div className="flex flex-col items-center -mt-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-2 relative shadow-lg border-2 border-slate-custom">
                    <i className={`${item.icon} text-white text-lg`}></i>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.count || 0}
                    </span>
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
