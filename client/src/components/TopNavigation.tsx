import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
}

export function TopNavigation({ activeTab, onTabChange, userBalance }: TopNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'sports', label: 'Sports' },
    { id: 'live', label: 'Live Now', hasIndicator: true },
    { id: 'casino', label: 'Casino' },
    { id: 'virtual', label: 'Virtual' },
    { id: 'aviator', label: 'Aviator' }
  ];

  return (
    <nav className="bg-slate-custom border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-dice text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              NileBet
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                  activeTab === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:bg-slate-light-custom'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                {item.label}
                {item.hasIndicator && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-live rounded-full animate-pulse"></span>
                )}
              </Button>
            ))}
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-slate-light-custom rounded-lg px-3 py-2">
              <i className="fas fa-wallet text-success mr-2"></i>
              <span className="font-semibold">{userBalance}</span>
            </div>
            <Button className="bg-primary hover:bg-primary-blue-dark hidden md:block">
              Deposit
            </Button>
            <Button variant="ghost" className="p-2 md:hidden">
              <i className="fas fa-bars text-xl"></i>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
