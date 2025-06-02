import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBetslipOpen: () => void;
  onMenuOpen: () => void;
  betslipCount: number;
}

export function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  onBetslipOpen, 
  onMenuOpen,
  betslipCount 
}: BottomNavigationProps) {
  const navItems = [
    { id: 'menu', label: 'Menu', icon: 'fas fa-bars' },
    { id: 'home', label: 'Sports', icon: 'fas fa-futbol' },
    { id: 'betslip', label: 'Betslip', icon: 'fas fa-receipt', count: betslipCount },
    { id: 'my-bets', label: 'My Bets', icon: 'fas fa-history' },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-custom border-t border-gray-700 z-50">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`flex flex-col items-center py-3 px-2 transition-colors relative ${
              activeTab === item.id || (item.id === 'home' && activeTab === 'sports')
                ? 'text-primary' 
                : 'text-gray-400 hover:bg-slate-light-custom'
            }`}
            onClick={() => handleTabClick(item.id)}
          >
            <i className={`${item.icon} text-xl mb-1`}></i>
            <span className="text-xs">{item.label}</span>
            {item.count && item.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-live text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {item.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    </nav>
  );
}
