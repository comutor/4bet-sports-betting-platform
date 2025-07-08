import { FourBetLogo } from './FourBetLogo';
import { Button } from '@/components/ui/button';
import { LiveIndicator } from './LiveIndicator';
import { useState, useEffect } from 'react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
  userCountry: string;
  isLoggedIn: boolean;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
  onDepositClick?: () => void;
}

export function TopNavigation({ 
  activeTab, 
  onTabChange, 
  userBalance, 
  userCountry, 
  isLoggedIn, 
  isMenuOpen = false, 
  onMenuToggle, 
  onSignupClick, 
  onLoginClick, 
  onDepositClick 
}: TopNavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show nav when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide nav when scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Apply class to body based on navigation visibility
  useEffect(() => {
    if (isVisible) {
      document.body.classList.remove('nav-hidden');
    } else {
      document.body.classList.add('nav-hidden');
    }
  }, [isVisible]);

  // Most popular sports for top navigation - ordered by usage priority
  const popularSports = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'cricket', label: 'Cricket', icon: 'fas fa-baseball-ball' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' },
    { id: 'hockey', label: 'Hockey', icon: 'fas fa-hockey-puck' },
    { id: 'nfl', label: 'NFL', icon: 'fas fa-football-ball' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball' },
    { id: 'rugby', label: 'Rugby', icon: 'fas fa-football-ball' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball' },
    { id: 'afl', label: 'AFL', icon: 'fas fa-football-ball' },
    { id: 'formula-1', label: 'Formula-1', icon: 'fas fa-flag-checkered' },
    { id: 'handball', label: 'Handball', icon: 'fas fa-hand-paper' },
    { id: 'mma', label: 'MMA', icon: 'fas fa-fist-raised' }
  ];

  return (
    <div className="relative">
      <nav className={`fixed top-0 left-0 right-0 z-40 bg-slate-custom shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Top Row */}
        <div className="bg-slate-custom px-4 py-3">
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

            {/* Country Flag (visible on larger screens) */}
            <div className="hidden md:flex items-center flex-1 ml-8">
              {userCountry && (
                <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-gray-700/50">
                  <span className="text-2xl">
                    {userCountry === 'Uganda' ? '🇺🇬' : userCountry === 'South Sudan' ? '🇸🇸' : '🌍'}
                  </span>
                  <span className="text-sm font-medium text-gray-300">{userCountry}</span>
                </div>
              )}
            </div>

            {/* Right: Search and User Balance or Auth Buttons */}
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
                    className="text-gray-300 hover:text-white hover:bg-slate-light-custom text-xs md:text-sm px-3 py-2 rounded-lg font-bold uppercase"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={onSignupClick}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs md:text-sm px-3 py-2 rounded-lg uppercase"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Popular Sports Navigation Row with Filter Bar */}
        <div className="bg-slate-custom px-4 pb-3 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            {/* Sports Navigation */}
            <div className="flex items-center overflow-x-auto scrollbar-hide flex-1">
              {popularSports.map((sport) => (
                <Button
                  key={sport.id}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1.5 px-4 lg:px-6 py-3 font-bold transition-all duration-200 whitespace-nowrap shrink-0 mr-2 lg:mr-3 border-b-2 ${
                    activeTab === sport.id 
                      ? 'text-blue-400 border-blue-400' 
                      : 'text-gray-300 hover:text-white border-transparent'
                  }`}
                  onClick={() => onTabChange(sport.id)}
                >
                  <i className={`${sport.icon} text-sm flex-shrink-0`}></i>
                  <span className="text-xs font-bold uppercase">{sport.label}</span>
                </Button>
              ))}
            </div>
            

          </div>
        </div>
      </nav>
    </div>
  );
}