import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FourBetLogo } from './FourBetLogo';
import { LiveIndicator } from './LiveIndicator';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
  userCountry?: string;
  isLoggedIn?: boolean;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
  onDepositClick?: () => void;
  isSearchOpen?: boolean;
  onSearchToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TopNavigation({ 
  activeTab, 
  onTabChange, 
  userBalance, 
  userCountry, 
  isLoggedIn = false, 
  isMenuOpen = false, 
  onMenuToggle, 
  onSignupClick, 
  onLoginClick, 
  onDepositClick, 
  isSearchOpen = false, 
  onSearchToggle, 
  searchQuery = '', 
  onSearchChange 
}: TopNavigationProps) {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  // Main navigation items for top tabs (excludes betslip and account)
  const allNavItems = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol', hasIndicator: false },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball-ball', hasIndicator: false },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis', hasIndicator: false },
    { id: 'ice-hockey', label: 'Ice Hockey', icon: 'fas fa-hockey-puck', hasIndicator: false },
    { id: 'american-football', label: 'American Football', icon: 'fas fa-football-ball', hasIndicator: false },
    { id: 'esports', label: 'Esports', icon: 'fas fa-gamepad', hasIndicator: false },
    { id: 'more', label: 'More', icon: 'fas fa-plus', hasIndicator: false },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice', hasIndicator: false },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-paper-plane', hasIndicator: false },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-vr-cardboard', hasIndicator: true }
  ];

  // Dropdown menu items (same as all nav items since betslip and account are already excluded)
  const dropdownNavItems = allNavItems;

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen]);

  // Handle search auto-close detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        onSearchToggle && onSearchToggle();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onSearchToggle && onSearchToggle();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSearchOpen, onSearchToggle]);

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-custom/95 backdrop-blur-sm shadow-lg">
        {/* Top Row */}
        <div className="bg-slate-custom/90 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Menu Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMenuToggle}
                className="text-gray-300 hover:text-white transition-colors duration-200 lg:hidden"
              >
                <i className="fas fa-bars text-lg"></i>
              </button>
              <FourBetLogo />
            </div>

            {/* Center: Country Flag (visible on larger screens) */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-xs mx-8">
              {userCountry && (
                <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-gray-700/50">
                  <span className="text-2xl">
                    {userCountry === 'Uganda' ? '🇺🇬' : userCountry === 'South Sudan' ? '🇸🇸' : '🌍'}
                  </span>
                  <span className="text-sm font-medium text-gray-300">{userCountry}</span>
                </div>
              )}
            </div>

            {/* Right: User Balance or Auth Buttons */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 md:px-4 py-2 md:py-2.5 border border-gray-700/50">
                    <i className="fas fa-coins text-yellow-500 text-sm flex-shrink-0"></i>
                    <span className="text-sm md:text-base font-bold text-white whitespace-nowrap">
                      {userBalance} {userCountry === 'Uganda' ? 'UGX' : 'SSP'}
                    </span>
                  </div>
                  <Button
                    onClick={onDepositClick}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 rounded-lg whitespace-nowrap"
                  >
                    Deposit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={onLoginClick}
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-slate-light-custom text-xs md:text-sm px-3 py-2 rounded-lg font-medium"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={onSignupClick}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs md:text-sm px-3 py-2 rounded-lg"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div ref={searchBarRef} className="bg-slate-custom/95 px-4 py-3 border-b border-gray-700/30">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sports, teams, leagues..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="w-full bg-slate-700 border border-gray-600 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                <button
                  onClick={() => onSearchChange && onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
              {searchQuery && (
                <div className="mt-3 bg-slate-700 rounded-lg border border-slate-600 max-h-60 overflow-y-auto">
                  <div className="p-3 text-center text-gray-400 text-sm">
                    <i className="fas fa-search mr-2"></i>
                    Search results will appear here...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom Row - Navigation Tabs */}
        <div className="bg-slate-custom/90 backdrop-blur-sm px-4 pb-3 relative border-b border-gray-700/30">
          <div className="flex items-center">
            {/* Scrollable Navigation Pills */}
            <div className="flex items-center overflow-x-auto scrollbar-hide flex-1 pr-12">
              {allNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1.5 px-4 lg:px-8 py-1.5 rounded-full font-bold transition-all duration-200 whitespace-nowrap shrink-0 mr-2 lg:mr-4 ${
                    activeTab === item.id 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-300 hover:bg-slate-light-custom hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsServicesDropdownOpen(false);
                    onTabChange(item.id);
                  }}
                >
                  <i className={`${item.icon} text-sm flex-shrink-0`}></i>
                  <span className="text-sm font-bold uppercase">{item.label}</span>
                  {item.hasIndicator && (
                    <LiveIndicator size="sm" className="ml-1" />
                  )}
                </Button>
              ))}
            </div>
            
            {/* Fixed Dropdown Button */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-slate-custom via-slate-custom to-transparent pl-4">
              <div className="bg-slate-800 border border-gray-700 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center w-8 h-8 rounded-md font-medium transition-all duration-200 shrink-0 text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsServicesDropdownOpen(!isServicesDropdownOpen);
                  }}
                >
                  <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Services Dropdown */}
        {isServicesDropdownOpen && (
          <div ref={servicesDropdownRef} className="absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-800 border border-gray-700 rounded-xl p-4 z-50 shadow-lg animate-slide-down">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dropdownNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`flex flex-col items-center justify-center p-4 h-20 rounded-xl transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'hover:bg-slate-700 text-gray-300 hover:text-white'
                  }`}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsServicesDropdownOpen(false);
                  }}
                >
                  <i className={`${item.icon} text-lg mb-2`}></i>
                  <span className="text-xs font-medium uppercase">{item.label}</span>
                  {item.hasIndicator && <LiveIndicator size="sm" className="mt-1" />}
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}