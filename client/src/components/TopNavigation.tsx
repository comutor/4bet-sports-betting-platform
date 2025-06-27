import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HamburgerMenu } from "./HamburgerMenu";
import { FourBetLogo } from "./FourBetLogo";
import { LiveIndicator } from "./LiveIndicator";

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
  sportsFilter?: 'upcoming' | 'popular' | 'live';
  onSportsFilterChange?: (filter: 'upcoming' | 'popular' | 'live') => void;
  isSearchOpen?: boolean;
  onSearchToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TopNavigation({ activeTab, onTabChange, userBalance, userCountry, isLoggedIn = false, isMenuOpen = false, onMenuToggle, onSignupClick, onLoginClick, onDepositClick, sportsFilter = 'upcoming', onSportsFilterChange, isSearchOpen = false, onSearchToggle, searchQuery = '', onSearchChange }: TopNavigationProps) {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isMarketsDropdownOpen, setIsMarketsDropdownOpen] = useState(false);
  const [isLeaguesDropdownOpen, setIsLeaguesDropdownOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [selectedMarket, setSelectedMarket] = useState('1X2');
  const [selectedLeague, setSelectedLeague] = useState('All Leagues');
  
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

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

  const getCurrencyDisplay = (balance: string, country?: string) => {
    if (country === 'Uganda') {
      return `UGX ${balance}`;
    } else if (country === 'South Sudan') {
      return `SSP ${balance}`;
    }
    return `SSP ${balance}`; // Default to South Sudanese Pounds
  };

  const allNavItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', hasIndicator: false },
    { id: 'sports', label: 'Sports', icon: 'fas fa-futbol', hasIndicator: false },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane', hasIndicator: false },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot', hasIndicator: false },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis', hasIndicator: false },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice', hasIndicator: false }
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
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis', color: 'bg-blue-600' },
    { id: 'hockey', label: 'Ice Hockey', icon: 'fas fa-hockey-puck', color: 'bg-blue-500' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball', color: 'bg-red-500' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball', color: 'bg-indigo-600' }
  ];

  return (
    <nav className="bg-slate-custom sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Top Header - Hamburger, Logo, Search, Balance */}
        <div className="bg-slate-900/95 backdrop-blur-sm border-b border-gray-600/50 shadow-lg">
          <div className="px-4 flex items-center justify-between h-16 md:h-18">
            {/* Left side - Hamburger and Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button 
              variant="ghost" 
              className="p-1 md:p-2 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMenuToggle && onMenuToggle();
              }}
            >
              <i className="fas fa-bars text-lg md:text-xl"></i>
            </Button>
            <button 
              className="flex items-center justify-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer logo-container py-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTabChange('home');
              }}
            >
              <FourBetLogo size="md" />
            </button>
          </div>
          
          {/* Right side - Search and User Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <Button 
              variant="ghost" 
              className="p-1 md:p-2 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSearchToggle && onSearchToggle();
              }}
            >
              <i className="fas fa-search text-lg md:text-xl"></i>
            </Button>
            
            {isLoggedIn ? (
              <>
                <div 
                  className="flex items-center bg-white/10 border border-white/30 rounded-lg px-2 md:px-3 py-1 md:py-2 cursor-pointer hover:bg-blue-600/20 hover:border-blue-600/50 transition-all duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDepositClick && onDepositClick();
                  }}
                >
                  <i className="fas fa-wallet text-white mr-1 md:mr-2 text-sm md:text-base"></i>
                  <span className="font-bold text-sm md:text-base text-white">{getCurrencyDisplay(userBalance, userCountry)}</span>
                </div>
                <Button 
                  className="bg-transparent border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold text-sm md:text-base px-2 md:px-4 py-1 md:py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDepositClick && onDepositClick();
                  }}
                >
                  Deposit
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-medium text-sm md:text-base px-2 md:px-3 py-1 md:py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLoginClick && onLoginClick();
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 hover:scale-105 font-bold text-sm md:text-base px-2 md:px-3 py-1 md:py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSignupClick && onSignupClick();
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Search Bar - Appears between title bar and navigation */}
        {isSearchOpen && (
          <div className="bg-slate-800/95 backdrop-blur-sm border-b border-gray-600/50 px-4 py-3 animate-slide-down">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for matches, teams, or leagues..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange && onSearchChange('')}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                )}
                <button
                  onClick={() => onSearchToggle && onSearchToggle()}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <i className="fas fa-search text-sm"></i>
                </button>
              </div>
            </div>
            {searchQuery && (
              <div className="mt-3 max-w-md mx-auto">
                <div className="bg-slate-700 rounded-lg border border-slate-600 max-h-60 overflow-y-auto">
                  <div className="p-3 text-center text-gray-400 text-sm">
                    <i className="fas fa-search mr-2"></i>
                    Search results will appear here...
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Bottom Row - Navigation Tabs */}
        <div className="bg-slate-custom/90 backdrop-blur-sm px-4 pb-3 relative border-b border-gray-700/30">
          <div className="flex items-center">
            {/* Scrollable Navigation Pills */}
            <div className="flex items-center overflow-x-auto scrollbar-hide flex-1 pr-12">
              {activeTab === 'sports' ? (
                // Sports navigation - same style as home navigation
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1.5 px-4 lg:px-8 py-1.5 rounded-full font-bold transition-all duration-200 whitespace-nowrap shrink-0 mr-2 lg:mr-4 ${
                      sportsFilter === 'upcoming'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-300 hover:bg-slate-light-custom hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSportsFilterChange?.('upcoming');
                    }}
                  >
                    <i className="fas fa-calendar text-sm flex-shrink-0"></i>
                    <span className="text-sm font-bold uppercase">UPCOMING</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1.5 px-4 lg:px-8 py-1.5 rounded-full font-bold transition-all duration-200 whitespace-nowrap shrink-0 mr-2 lg:mr-4 ${
                      sportsFilter === 'popular'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-300 hover:bg-slate-light-custom hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSportsFilterChange?.('popular');
                    }}
                  >
                    <i className="fas fa-fire text-sm flex-shrink-0"></i>
                    <span className="text-sm font-bold uppercase">POPULAR</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1.5 px-4 lg:px-8 py-1.5 rounded-full font-bold transition-all duration-200 whitespace-nowrap shrink-0 mr-2 lg:mr-4 ${
                      sportsFilter === 'live'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-300 hover:bg-slate-light-custom hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSportsFilterChange?.('live');
                    }}
                  >
                    <i className="fas fa-broadcast-tower text-sm flex-shrink-0"></i>
                    <span className="text-sm font-bold uppercase">LIVE NOW</span>
                    <LiveIndicator size="sm" className="ml-1" />
                  </Button>
                </>
              ) : (
                // Regular navigation - scrollable buttons with proper spacing
                <>
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
                        setIsServicesDropdownOpen(false); // Close services dropdown
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
                </>
              )}
            </div>
            
            {/* Fixed Dropdown Button - Only show when not in sports mode */}
            {activeTab !== 'sports' && (
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
            )}
          </div>
          
          {/* Sports Filter Dropdowns */}
          {activeTab === 'sports' && (
            <div className="flex items-center gap-2 lg:gap-6 mt-3 px-2 overflow-x-auto scrollbar-hide">
              <div 
                className="bg-slate-800 border border-gray-600 rounded-md px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 min-w-[120px] lg:min-w-[160px]"
                onClick={() => {
                  setIsServicesDropdownOpen(false); // Close services dropdown
                  setIsSportDropdownOpen(!isSportDropdownOpen);
                }}
              >
                <i className="fas fa-futbol text-sm text-gray-300"></i>
                <span className="text-sm lg:text-base text-gray-300 font-medium">{selectedSport}</span>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isSportDropdownOpen ? 'rotate-180' : ''}`}></i>
              </div>
              <div 
                className="bg-slate-800 border border-gray-600 rounded-md px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 min-w-[120px] lg:min-w-[160px]"
                onClick={() => {
                  setIsServicesDropdownOpen(false); // Close services dropdown
                  setIsLeaguesDropdownOpen(!isLeaguesDropdownOpen);
                }}
              >
                <i className="fas fa-trophy text-sm text-gray-300"></i>
                <span className="text-sm lg:text-base text-gray-300 font-medium">{selectedLeague}</span>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isLeaguesDropdownOpen ? 'rotate-180' : ''}`}></i>
              </div>
              <div 
                className="bg-slate-800 border border-gray-600 rounded-md px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 min-w-[120px] lg:min-w-[160px]"
                onClick={() => {
                  setIsServicesDropdownOpen(false); // Close services dropdown
                  setIsMarketsDropdownOpen(!isMarketsDropdownOpen);
                }}
              >
                <i className="fas fa-chart-line text-sm text-gray-300"></i>
                <span className="text-sm lg:text-base text-gray-300 font-medium">{selectedMarket}</span>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isMarketsDropdownOpen ? 'rotate-180' : ''}`}></i>
              </div>
              <div 
                className="bg-slate-800 border border-gray-600 rounded-md px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 min-w-[120px] lg:min-w-[160px] relative"
                onClick={() => {
                  setIsServicesDropdownOpen(false); // Close services dropdown
                  setIsDateDropdownOpen(!isDateDropdownOpen);
                }}
              >
                <i className="fas fa-calendar text-sm text-gray-300"></i>
                <span className="text-sm lg:text-base text-gray-300 font-medium">{selectedDateFilter}</span>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`}></i>
                

              </div>
            </div>
          )}
          
          {/* Sport Dropdown */}
          {isSportDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-800 border border-gray-700 rounded-xl p-4 z-50 shadow-lg animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-300">Select Sport</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsSportDropdownOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Football', icon: 'fas fa-futbol', matches: 271 },
                  { name: 'Basketball', icon: 'fas fa-basketball-ball', matches: 1 },
                  { name: 'Tennis', icon: 'fas fa-table-tennis', matches: 0 }
                ].map((sport) => (
                  <Button
                    key={sport.name}
                    variant="ghost"
                    className={`flex items-center justify-between p-3 h-12 rounded-lg transition-all duration-200 ${
                      selectedSport === sport.name 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-slate-700 text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedSport(sport.name);
                      setIsSportDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <i className={`${sport.icon} text-sm mr-3`}></i>
                      <span className="text-sm font-medium">{sport.name}</span>
                    </div>
                    <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">
                      {sport.matches}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Leagues Dropdown */}
          {isLeaguesDropdownOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
              <div className="bg-slate-800 border border-gray-700 rounded-xl p-4 shadow-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-300">Select League</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setIsLeaguesDropdownOpen(false)}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'All Leagues', icon: 'fas fa-globe', country: 'Global' },
                    { name: 'Premier League', icon: 'fas fa-flag', country: 'England' },
                    { name: 'La Liga', icon: 'fas fa-flag', country: 'Spain' },
                    { name: 'Serie A', icon: 'fas fa-flag', country: 'Italy' },
                    { name: 'Bundesliga', icon: 'fas fa-flag', country: 'Germany' },
                    { name: 'Ligue 1', icon: 'fas fa-flag', country: 'France' },
                    { name: 'Champions League', icon: 'fas fa-trophy', country: 'UEFA' },
                    { name: 'Europa League', icon: 'fas fa-medal', country: 'UEFA' },
                    { name: 'Premier League', icon: 'fas fa-flag', country: 'Uganda' },
                    { name: 'South Sudan League', icon: 'fas fa-flag', country: 'South Sudan' }
                  ].map((league) => (
                    <Button
                      key={league.name + league.country}
                      variant="ghost"
                      className={`flex items-center justify-between p-3 h-12 rounded-lg transition-all duration-200 ${
                        selectedLeague === league.name 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-slate-700 text-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedLeague(league.name);
                        setIsLeaguesDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <i className={`${league.icon} text-sm mr-3`}></i>
                        <div className="text-left">
                          <span className="text-sm font-medium block">{league.name}</span>
                          <span className="text-xs text-gray-400">{league.country}</span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Markets Dropdown */}
          {isMarketsDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-800 border border-gray-700 rounded-xl p-4 z-50 shadow-lg animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-300">Select Market</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsMarketsDropdownOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: '1X2', description: 'Match Result' },
                  { name: 'Over/Under', description: 'Total Goals' },
                  { name: 'Both Teams Score', description: 'BTTS' },
                  { name: 'Double Chance', description: '1X, 12, X2' },
                  { name: 'Handicap', description: 'Asian Handicap' },
                  { name: 'Correct Score', description: 'Exact Score' }
                ].map((market) => (
                  <Button
                    key={market.name}
                    variant="ghost"
                    className={`flex items-center justify-between p-3 h-12 rounded-lg transition-all duration-200 ${
                      selectedMarket === market.name 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-slate-700 text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedMarket(market.name);
                      setIsMarketsDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <i className="fas fa-chart-line text-sm mr-3"></i>
                      <div className="text-left">
                        <span className="text-sm font-medium block">{market.name}</span>
                        <span className="text-xs text-gray-400">{market.description}</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Date Dropdown */}
          {isDateDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-800 border border-gray-700 rounded-xl p-4 z-50 shadow-lg animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-300">Select Date Range</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsDateDropdownOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {['Today', 'Tomorrow', 'This Week', 'This Month', 'Next Month'].map((option) => (
                  <Button
                    key={option}
                    variant="ghost"
                    className={`flex items-center justify-start p-3 h-12 rounded-lg transition-all duration-200 ${
                      selectedDateFilter === option 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-slate-700 text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedDateFilter(option);
                      setIsDateDropdownOpen(false);
                    }}
                  >
                    <i className="fas fa-calendar text-sm mr-3"></i>
                    <span className="text-sm font-medium">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {allServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="ghost"
                    className="flex flex-col items-center justify-center p-2 h-14 rounded-lg transition-all duration-200 bg-slate-700 border border-gray-600 hover:scale-105"
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
