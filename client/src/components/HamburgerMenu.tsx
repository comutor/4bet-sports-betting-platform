import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FourBetLogo } from "./FourBetLogo";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function HamburgerMenu({ isOpen, onClose, onTabChange, activeTab }: HamburgerMenuProps) {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const mainSections = [
    { id: 'sports', label: 'Sports', icon: 'fas fa-futbol' },
    { id: 'live', label: 'In-Play', icon: 'fas fa-broadcast-tower' },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice' },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' },
    { id: 'scratch-cards', label: 'Scratch Cards', icon: 'fas fa-credit-card' }
  ];

  const sportsCategories = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' },
    { id: 'hockey', label: 'Ice Hockey', icon: 'fas fa-hockey-puck' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball' }
  ];

  const topCountries = [
    { 
      id: 'england', 
      label: 'England', 
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      leagues: ['Premier League', 'Championship', 'League One', 'League Two', 'FA Cup', 'EFL Cup']
    },
    { 
      id: 'spain', 
      label: 'Spain', 
      flag: '🇪🇸',
      leagues: ['La Liga', 'Segunda División', 'Copa del Rey', 'Supercopa de España']
    },
    { 
      id: 'italy', 
      label: 'Italy', 
      flag: '🇮🇹',
      leagues: ['Serie A', 'Serie B', 'Coppa Italia', 'Supercoppa Italiana']
    },
    { 
      id: 'germany', 
      label: 'Germany', 
      flag: '🇩🇪',
      leagues: ['Bundesliga', '2. Bundesliga', 'DFB-Pokal', 'DFL-Supercup']
    },
    { 
      id: 'france', 
      label: 'France', 
      flag: '🇫🇷',
      leagues: ['Ligue 1', 'Ligue 2', 'Coupe de France', 'Trophée des Champions']
    },
    { 
      id: 'netherlands', 
      label: 'Netherlands', 
      flag: '🇳🇱',
      leagues: ['Eredivisie', 'Eerste Divisie', 'KNVB Cup', 'Johan Cruyff Shield']
    },
    { 
      id: 'belgium', 
      label: 'Belgium', 
      flag: '🇧🇪',
      leagues: ['Pro League', 'First Division B', 'Belgian Cup', 'Belgian Super Cup']
    },
    { 
      id: 'switzerland', 
      label: 'Switzerland', 
      flag: '🇨🇭',
      leagues: ['Super League', 'Challenge League', 'Swiss Cup']
    }
  ];

  const countryCategories = [
    { id: 'international', label: 'International', icon: 'fas fa-globe' },
    { id: 'other-countries', label: 'Other Countries', icon: 'fas fa-map' }
  ];



  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-full lg:w-1/2 bg-slate-custom z-50 ${
        isOpen ? 'slide-in-left' : 'slide-out-left'
      }`} style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <button 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer logo-container"
              onClick={() => handleItemClick('home')}
            >
              <FourBetLogo size="lg" />
            </button>
            <Button variant="ghost" onClick={onClose} className="p-2 text-gray-400 hover:text-white">
              <i className="fas fa-times text-2xl"></i>
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 hamburger-content p-3 md:p-4 space-y-3 md:space-y-4">
            {/* Main Sections */}
            <div>
              <h3 className="section-title">
                Main Menu
              </h3>
              <div className="menu-grid">
                {mainSections.map((section) => (
                  <div
                    key={section.id}
                    className={`menu-item ${activeTab === section.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(section.id)}
                  >
                    <i className={section.icon}></i>
                    <span>{section.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Separator Line */}
            <div className="border-t border-gray-600 mx-2"></div>
            
            {/* Sports Categories */}
            <div>
              <h3 className="section-title">
                Popular Sports
              </h3>
              <div className="menu-grid">
                {sportsCategories.map((sport) => (
                  <div
                    key={sport.id}
                    className={`menu-item ${activeTab === sport.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(sport.id)}
                  >
                    <i className={sport.icon}></i>
                    <span>{sport.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-600 mx-2"></div>

            {/* Top Countries */}
            <div>
              <h3 className="section-title">
                Top Countries
              </h3>
              <div className="px-3 space-y-2">
                {topCountries.map((country) => (
                  <div key={country.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between p-3 text-left transition-all duration-200 rounded-xl border border-slate-600 hover:border-slate-500 shadow-sm ${
                        activeTab === country.id 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => {
                        if (expandedCountry === country.id) {
                          setExpandedCountry(null);
                        } else {
                          setExpandedCountry(country.id);
                          handleItemClick(country.id);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{country.flag}</span>
                        <span className="text-sm font-medium">{country.label}</span>
                      </div>
                      <i className={`fas fa-chevron-${expandedCountry === country.id ? 'up' : 'down'} text-gray-400 text-xs transition-transform duration-200`}></i>
                    </Button>
                    
                    {expandedCountry === country.id && (
                      <div className="mt-2 ml-6 p-3 bg-slate-800 rounded-lg border border-slate-600 animate-slide-down">
                        <div className="text-xs text-gray-400 mb-3">Available leagues and competitions</div>
                        <div className="grid grid-cols-1 gap-2">
                          {country.leagues.map((league, index) => (
                            <button
                              key={index}
                              className="text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
                              onClick={() => handleItemClick(`${country.id}-${league.toLowerCase().replace(/\s+/g, '-')}`)}
                            >
                              {league}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-600 mx-2"></div>

            {/* Other Country Categories */}
            <div>
              <h3 className="section-title">
                Other Regions
              </h3>
              <div className="px-3 space-y-2">
                {countryCategories.map((country) => (
                  <div key={country.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between p-3 text-left transition-all duration-200 rounded-xl border border-slate-600 hover:border-slate-500 shadow-sm ${
                        activeTab === country.id 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => {
                        if (expandedCountry === country.id) {
                          setExpandedCountry(null);
                        } else {
                          setExpandedCountry(country.id);
                          handleItemClick(country.id);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <i className={`${country.icon} w-5 mr-3 text-gray-400`}></i>
                        <span className="text-sm font-medium">{country.label}</span>
                      </div>
                      <i className={`fas fa-chevron-${expandedCountry === country.id ? 'up' : 'down'} text-gray-400 text-xs transition-transform duration-200`}></i>
                    </Button>
                    
                    {expandedCountry === country.id && (
                      <div className="mt-2 ml-6 p-3 bg-slate-800 rounded-lg border border-slate-600">
                        <div className="text-xs text-gray-400 mb-2">Available leagues and competitions</div>
                        <div className="text-xs text-gray-300">Coming soon...</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}