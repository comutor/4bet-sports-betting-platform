import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HamburgerMenu } from "./HamburgerMenu";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
  isLoggedIn?: boolean;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
}

export function TopNavigation({ activeTab, onTabChange, userBalance, isLoggedIn = false, isMenuOpen = false, onMenuToggle, onSignupClick, onLoginClick }: TopNavigationProps) {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

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

  const allServices = [
    { id: 'sports', label: 'Sports', icon: 'fas fa-futbol', color: 'bg-green-600' },
    { id: 'live', label: 'In-Play', icon: 'fas fa-broadcast-tower', color: 'bg-red-600' },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice', color: 'bg-purple-600' },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot', color: 'bg-blue-600' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane', color: 'bg-orange-600' },
    { id: 'promotions', label: 'Promotions', icon: 'fas fa-gift', color: 'bg-pink-600' },
    { id: 'football', label: 'Football', icon: 'fas fa-futbol', color: 'bg-green-500' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball', color: 'bg-orange-500' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis', color: 'bg-yellow-600' },
    { id: 'hockey', label: 'Ice Hockey', icon: 'fas fa-hockey-puck', color: 'bg-blue-500' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball', color: 'bg-red-500' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball', color: 'bg-indigo-600' }
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
              onClick={onMenuToggle}
            >
              <i className="fas fa-bars text-lg md:text-xl"></i>
            </Button>
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-dice text-white text-lg md:text-xl"></i>
            </div>
            <span className="text-xl md:text-3xl tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic" style={{ fontFamily: 'Nunito', fontWeight: '800', fontStyle: 'italic' }}>
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
                <div className="flex items-center bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-lg px-2 md:px-3 py-1 md:py-2">
                  <i className="fas fa-wallet bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mr-1 md:mr-2 text-sm md:text-base"></i>
                  <span className="font-bold text-sm md:text-base bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{userBalance}</span>
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
                  onClick={onLoginClick}
                >
                  Login
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-blue-dark font-bold text-sm md:text-base px-2 md:px-3 py-1 md:py-2"
                  onClick={onSignupClick}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Bottom Row - Navigation Tabs */}
        <div className="pb-3 relative">
          <div className="flex items-center">
            {/* Scrollable Navigation Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 pr-12">
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
            
            {/* Fixed Dropdown Button */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-slate-custom via-slate-custom to-transparent pl-8">
              <div className="bg-slate-800 border border-gray-700 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center w-8 h-8 rounded-md font-medium transition-all duration-200 shrink-0 text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                >
                  <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}></i>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Services Dropdown */}
          {isServicesDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-800 border border-gray-700 rounded-xl p-4 z-50 shadow-lg animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-300">All Services</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsServicesDropdownOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {allServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="ghost"
                    className={`flex flex-col items-center justify-center p-2 h-14 rounded-lg transition-all duration-200 ${service.color} hover:opacity-80`}
                    onClick={() => {
                      onTabChange(service.id);
                      setIsServicesDropdownOpen(false);
                    }}
                  >
                    <i className={`${service.icon} text-sm mb-1 text-white`}></i>
                    <span className="text-xs font-medium text-center text-white leading-tight">{service.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen}
        onClose={() => onMenuToggle && onMenuToggle()}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />
    </nav>
  );
}
