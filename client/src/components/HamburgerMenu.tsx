import { Button } from "@/components/ui/button";

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
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' },
    { id: 'scratch-cards', label: 'Weekly Lottery', icon: 'fas fa-ticket' }
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
      <div className={`fixed top-0 left-0 h-full w-full bg-slate-custom z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <i className="fas fa-dice text-white text-xl"></i>
              </div>
              <span className="text-2xl tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic" style={{ fontFamily: 'Nunito', fontWeight: '800', fontStyle: 'italic' }}>
                NileBet
              </span>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2 text-gray-400 hover:text-white">
              <i className="fas fa-times text-2xl"></i>
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4 md:space-y-6 hamburger-scroll">
            {/* Main Sections */}
            <div className="bg-slate-800 rounded-xl p-3 md:p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-300 mb-3 md:mb-4">
                Main Menu
              </h3>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {mainSections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`flex flex-col items-center justify-center p-2 md:p-3 aspect-square rounded-lg transition-all duration-300 touch-manipulation ${
                      activeTab === section.id
                        ? 'bg-primary text-white scale-95'
                        : 'text-gray-300 hover:bg-slate-700 bg-slate-900 active:scale-95'
                    }`}
                    onClick={() => handleItemClick(section.id)}
                  >
                    <i className={`${section.icon} text-base md:text-lg mb-1`}></i>
                    <span className="text-xs font-medium text-center leading-tight">{section.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sports Categories */}
            <div className="bg-slate-800 rounded-xl p-3 md:p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-300 mb-3 md:mb-4">
                Popular Sports
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {sportsCategories.map((sport) => (
                  <Button
                    key={sport.id}
                    variant="ghost"
                    className={`flex flex-col items-center justify-center p-2 md:p-3 aspect-square rounded-lg transition-all duration-300 touch-manipulation ${
                      activeTab === sport.id
                        ? 'bg-primary text-white scale-95'
                        : 'text-gray-300 hover:bg-slate-700 bg-slate-900 active:scale-95'
                    }`}
                    onClick={() => handleItemClick(sport.id)}
                  >
                    <i className={`${sport.icon} text-sm md:text-base mb-1`}></i>
                    <span className="text-xs font-medium text-center leading-tight">{sport.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="bg-slate-800 rounded-xl p-3 md:p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-300 mb-3 md:mb-4">
                Countries
              </h3>
              <div className="space-y-1 md:space-y-2">
                {countryCategories.map((country) => (
                  <Button
                    key={country.id}
                    variant="ghost"
                    className="w-full justify-between p-2 md:p-3 text-left text-gray-300 hover:bg-slate-700 active:bg-slate-600 transition-all duration-300 rounded-lg touch-manipulation"
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