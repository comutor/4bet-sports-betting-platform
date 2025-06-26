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
              <h3 className="text-base font-bold text-white mb-2 md:mb-3">
                Main Menu
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {mainSections.map((section) => (
                  <div key={section.id} className="flex flex-col items-center">
                    <Button
                      variant={activeTab === section.id ? "default" : "secondary"}
                      className={`w-16 h-16 p-0 flex items-center justify-center transition-all duration-300 rounded-xl border-2 shadow-sm hover:scale-105 ${
                        activeTab === section.id 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-transparent border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600'
                      }`}
                      onClick={() => handleItemClick(section.id)}
                    >
                      <i className={`${section.icon} text-2xl`}></i>
                    </Button>
                    <div className="font-medium text-center leading-tight text-xs mt-2 text-white">{section.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sports Categories */}
            <div>
              <h3 className="text-base font-bold text-white mb-2 md:mb-3">
                Popular Sports
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {sportsCategories.map((sport) => (
                  <div key={sport.id} className="flex flex-col items-center">
                    <Button
                      variant={activeTab === sport.id ? "default" : "secondary"}
                      className={`w-16 h-16 p-0 flex items-center justify-center transition-all duration-300 rounded-xl border-2 shadow-sm hover:scale-105 ${
                        activeTab === sport.id 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-transparent border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600'
                      }`}
                      onClick={() => handleItemClick(sport.id)}
                    >
                      <i className={`${sport.icon} text-2xl`}></i>
                    </Button>
                    <div className="font-medium text-center leading-tight text-xs mt-2 text-white">{sport.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <h3 className="text-base font-bold text-white mb-2 md:mb-3">
                Countries
              </h3>
              <div className="space-y-1">
                {countryCategories.map((country) => (
                  <Button
                    key={country.id}
                    variant="ghost"
                    className="w-full justify-between p-2 text-left text-gray-300 hover:bg-slate-light-custom active:bg-slate-600 transition-all duration-200 rounded-xl border border-slate-600 hover:border-slate-500 shadow-sm touch-manipulation"
                    onClick={() => handleItemClick(country.id)}
                  >
                    <div className="flex items-center">
                      <i className={`${country.icon} w-4 md:w-5 mr-3 text-gray-400`}></i>
                      <span className="text-sm font-medium">{country.label}</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 text-xs transition-transform duration-200"></i>
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}