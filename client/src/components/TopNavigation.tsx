import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
}

export function TopNavigation({ activeTab, onTabChange, userBalance }: TopNavigationProps) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'sports', label: 'Soccer', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' }
  ];

  const moreNavItems = [
    { id: 'live', label: 'Live Now', icon: 'fas fa-broadcast-tower', hasIndicator: true },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice' },
    { id: 'virtual', label: 'Virtual Sports', icon: 'fas fa-robot' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' },
    { id: 'hockey', label: 'Hockey', icon: 'fas fa-hockey-puck' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball' },
    { id: 'esports', label: 'Esports', icon: 'fas fa-gamepad' }
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
          <div className="hidden md:flex space-x-6">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:bg-slate-light-custom'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Button>
            ))}
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    moreNavItems.some(item => item.id === activeTab)
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-slate-light-custom'
                  }`}
                >
                  <i className="fas fa-ellipsis-h"></i>
                  <span>More</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-custom border-gray-700 w-56">
                {moreNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-slate-light-custom transition-colors relative"
                    onClick={() => onTabChange(item.id)}
                  >
                    <i className={`${item.icon} text-gray-400`}></i>
                    <span className="text-gray-200">{item.label}</span>
                    {item.hasIndicator && (
                      <span className="absolute right-3 w-2 h-2 bg-live rounded-full animate-pulse"></span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
