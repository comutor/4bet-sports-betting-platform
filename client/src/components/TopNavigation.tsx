import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HamburgerMenu } from "./HamburgerMenu";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
  isLoggedIn?: boolean;
}

export function TopNavigation({ activeTab, onTabChange, userBalance, isLoggedIn = false }: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allNavItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'sports', label: 'Soccer', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' },
    { id: 'live', label: 'Live Now', icon: 'fas fa-broadcast-tower', hasIndicator: true },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice' },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' }
  ];

  return (
    <nav className="bg-slate-custom border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row - Hamburger, Logo, Search, Balance */}
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left side - Hamburger and Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button 
              variant="ghost" 
              className="p-1 md:p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(true)}
            >
              <i className="fas fa-bars text-lg md:text-xl"></i>
            </Button>
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-dice text-white text-lg md:text-xl"></i>
            </div>
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              NileBet
            </span>
          </div>
          
          {/* Right side - Search and User Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <Button variant="ghost" className="p-1 md:p-2 text-gray-400 hover:text-white">
              <i className="fas fa-search text-lg md:text-xl"></i>
            </Button>
            
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center bg-slate-light-custom rounded-lg px-2 md:px-3 py-1 md:py-2">
                  <i className="fas fa-wallet text-success mr-1 md:mr-2 text-sm md:text-base"></i>
                  <span className="font-semibold text-sm md:text-base">{userBalance}</span>
                </div>
                <Button className="bg-primary hover:bg-primary-blue-dark font-bold text-sm md:text-base px-2 md:px-4 py-1 md:py-2">
                  Deposit
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-slate-light-custom font-medium text-sm md:text-base px-2 md:px-3 py-1 md:py-2"
                >
                  Login
                </Button>
                <Button className="bg-primary hover:bg-primary-blue-dark font-bold text-sm md:text-base px-2 md:px-3 py-1 md:py-2">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Bottom Row - Navigation Tabs */}
        <div className="pb-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {allNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-300 hover:bg-slate-light-custom hover:text-white'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <i className={`${item.icon} text-sm`}></i>
                <span className="text-sm font-medium">{item.label}</span>
                {item.hasIndicator && (
                  <span className="w-1.5 h-1.5 bg-live rounded-full animate-pulse"></span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />
    </nav>
  );
}
