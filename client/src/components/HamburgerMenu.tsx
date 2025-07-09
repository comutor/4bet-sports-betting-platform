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
  const [expandedSubCountry, setExpandedSubCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    { id: 'live', label: 'Live', icon: 'fas fa-broadcast-tower' },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice' },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' },
    { id: 'scratch-cards', label: 'Scratch Cards', icon: 'fas fa-credit-card' }
  ];

  const sportsCategories = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' },
    { id: 'cricket', label: 'Cricket', icon: 'fas fa-baseball-ball' },
    { id: 'hockey', label: 'Hockey', icon: 'fas fa-hockey-puck' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball' },
    { id: 'rugby', label: 'Rugby', icon: 'fas fa-football-ball' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball' }
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

  const internationalCompetitions = [
    'UEFA Champions League',
    'UEFA Europa League', 
    'UEFA Conference League',
    'CONMEBOL Libertadores',
    'CONMEBOL Sudamericana',
    'AFC Champions League',
    'CAF Champions League',
    'CONCACAF Champions Cup',
    'FIFA Club World Cup',
    'UEFA Nations League',
    'World Cup Qualifiers',
    'UEFA European Championship',
    'Copa América',
    'Africa Cup of Nations',
    'Asian Cup'
  ];

  const otherCountries = [
    { 
      id: 'brazil', 
      label: 'Brazil', 
      flag: '🇧🇷',
      leagues: ['Campeonato Brasileiro Série A', 'Campeonato Brasileiro Série B', 'Copa do Brasil']
    },
    { 
      id: 'argentina', 
      label: 'Argentina', 
      flag: '🇦🇷',
      leagues: ['Primera División', 'Primera Nacional', 'Copa Argentina']
    },
    { 
      id: 'usa', 
      label: 'United States', 
      flag: '🇺🇸',
      leagues: ['Major League Soccer', 'USL Championship', 'US Open Cup']
    },
    { 
      id: 'mexico', 
      label: 'Mexico', 
      flag: '🇲🇽',
      leagues: ['Liga MX', 'Liga de Expansión MX', 'Copa MX']
    },
    { 
      id: 'japan', 
      label: 'Japan', 
      flag: '🇯🇵',
      leagues: ['J1 League', 'J2 League', 'J3 League', 'Emperor\'s Cup']
    },
    { 
      id: 'australia', 
      label: 'Australia', 
      flag: '🇦🇺',
      leagues: ['A-League Men', 'A-League Women', 'FFA Cup']
    },
    { 
      id: 'russia', 
      label: 'Russia', 
      flag: '🇷🇺',
      leagues: ['Premier League', 'First League', 'Russian Cup']
    },
    { 
      id: 'china', 
      label: 'China', 
      flag: '🇨🇳',
      leagues: ['Super League', 'League One', 'FA Cup']
    },
    { 
      id: 'south-korea', 
      label: 'South Korea', 
      flag: '🇰🇷',
      leagues: ['K League 1', 'K League 2', 'FA Cup']
    },
    { 
      id: 'greece', 
      label: 'Greece', 
      flag: '🇬🇷',
      leagues: ['Super League', 'Super League 2', 'Greek Cup']
    },
    { 
      id: 'scotland', 
      label: 'Scotland', 
      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      leagues: ['Premiership', 'Championship', 'Scottish Cup']
    },
    { 
      id: 'norway', 
      label: 'Norway', 
      flag: '🇳🇴',
      leagues: ['Eliteserien', 'OBOS-ligaen', 'Norwegian Cup']
    },
    { 
      id: 'sweden', 
      label: 'Sweden', 
      flag: '🇸🇪',
      leagues: ['Allsvenskan', 'Superettan', 'Svenska Cupen']
    },
    { 
      id: 'denmark', 
      label: 'Denmark', 
      flag: '🇩🇰',
      leagues: ['Superliga', '1st Division', 'Danish Cup']
    },
    { 
      id: 'austria', 
      label: 'Austria', 
      flag: '🇦🇹',
      leagues: ['Bundesliga', '2. Liga', 'ÖFB Cup']
    },
    { 
      id: 'poland', 
      label: 'Poland', 
      flag: '🇵🇱',
      leagues: ['Ekstraklasa', 'I Liga', 'Polish Cup']
    },
    { 
      id: 'chile', 
      label: 'Chile', 
      flag: '🇨🇱',
      leagues: ['Primera División', 'Primera B', 'Copa Chile']
    }
  ];

  const supportItems = [
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'help-center', label: 'Help Center', icon: 'fas fa-question-circle' },
    { id: 'why-join', label: 'Why Join?', icon: 'fas fa-users' },
    { id: 'more-on-4bet', label: 'More on 4bet', icon: 'fas fa-info-circle' }
  ];



  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  const handleSportClick = (sportId: string) => {
    // Map hamburger menu sport IDs to top navigation sport IDs
    const sportMapping: { [key: string]: string } = {
      'afl': 'afl',
      'baseball': 'baseball',
      'basketball': 'basketball',
      'football': 'football',
      'formula-1': 'formula-1',
      'handball': 'handball',
      'hockey': 'hockey',
      'mma': 'mma',
      'nfl': 'nfl',
      'rugby': 'rugby',
      'volleyball': 'volleyball'
    };

    // Navigate directly to the specific sport tab
    const targetSport = sportMapping[sportId] || sportId;
    onTabChange(targetSport);
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
            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search matches, teams, leagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-3 p-4 bg-slate-800 border border-slate-600 rounded-xl">
                  <div className="text-xs text-gray-400 mb-2">Search Results</div>
                  <div className="text-sm text-gray-300">
                    No results found for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>

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
                    onClick={() => handleSportClick(sport.id)}
                  >
                    <i className={sport.icon}></i>
                    <span>{sport.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-600 mx-2"></div>

            {/* Support & Information */}
            <div>
              <h3 className="section-title">
                Support & Information
              </h3>
              <div className="menu-grid">
                {supportItems.map((item) => (
                  <div
                    key={item.id}
                    className="menu-item"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
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