import { Button } from "@/components/ui/button";
import { FourBetLogo } from "./FourBetLogo";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function HamburgerMenu({ isOpen, onClose, onTabChange, activeTab }: HamburgerMenuProps) {
  const mainSections = [
    { id: 'sports', label: 'Sports', icon: 'fas fa-futbol' },
    { id: 'live', label: 'In-Play', icon: 'fas fa-broadcast-tower' },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice' },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' }
  ];

  const sportsCategories = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' },
    { id: 'hockey', label: 'Ice Hockey', icon: 'fas fa-hockey-puck' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball' }
  ];

  const countryCategories = [
    { id: 'top-countries', label: 'Top Countries', icon: 'fas fa-flag' },
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
      <div className={`fixed top-0 left-0 h-full w-full lg:w-1/2 bg-slate-custom z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4 space-y-3 md:space-y-4 hamburger-scroll">
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

            {/* Countries */}
            <div>
              <h3 className="section-title">
                Countries
              </h3>
              <div className="menu-grid">
                {countryCategories.map((country) => (
                  <div
                    key={country.id}
                    className={`menu-item ${activeTab === country.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(country.id)}
                  >
                    <i className={country.icon}></i>
                    <span>{country.label}</span>
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