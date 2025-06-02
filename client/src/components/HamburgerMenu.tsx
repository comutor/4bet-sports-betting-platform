import { Button } from "@/components/ui/button";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function HamburgerMenu({ isOpen, onClose, onTabChange, activeTab }: HamburgerMenuProps) {
  const mainSections = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'sports', label: 'Sports', icon: 'fas fa-futbol' },
    { id: 'live', label: 'Live Now', icon: 'fas fa-broadcast-tower' },
    { id: 'casino', label: 'Casino', icon: 'fas fa-dice' },
    { id: 'virtual', label: 'Virtual', icon: 'fas fa-robot' },
    { id: 'aviator', label: 'Aviator', icon: 'fas fa-plane' },
    { id: 'popular', label: 'Popular', icon: 'fas fa-fire' }
  ];

  const sportsCategories = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' }
  ];

  const sportsSubCategories = [
    { id: 'leagues', label: 'Leagues', icon: 'fas fa-trophy' },
    { id: 'top-countries', label: 'Top Countries', icon: 'fas fa-flag' },
    { id: 'other-countries', label: 'Other Countries', icon: 'fas fa-globe' }
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
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                NileBet
              </span>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2 text-gray-400 hover:text-white">
              <i className="fas fa-times text-2xl"></i>
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Main Sections */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-4 border-l-4 border-primary pl-3">
                Main Menu
              </h3>
              <div className="space-y-2">
                {mainSections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start p-4 text-left transition-all duration-200 ${
                      activeTab === section.id
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-slate-light-custom'
                    }`}
                    onClick={() => handleItemClick(section.id)}
                  >
                    <i className={`${section.icon} w-6 mr-4`}></i>
                    <span className="text-base font-medium">{section.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sports Categories */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-4 border-l-4 border-secondary pl-3">
                Sports
              </h3>
              <div className="space-y-2">
                {sportsCategories.map((sport) => (
                  <Button
                    key={sport.id}
                    variant="ghost"
                    className={`w-full justify-start p-4 text-left transition-all duration-200 ${
                      activeTab === sport.id
                        ? 'bg-secondary text-white'
                        : 'text-gray-300 hover:bg-slate-light-custom'
                    }`}
                    onClick={() => handleItemClick(sport.id)}
                  >
                    <i className={`${sport.icon} w-6 mr-4 text-secondary`}></i>
                    <span className="text-base font-medium">{sport.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sports Sub Categories */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-4 border-l-4 border-warning pl-3">
                Browse
              </h3>
              <div className="space-y-2">
                {sportsSubCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className="w-full justify-between p-4 text-left text-gray-300 hover:bg-slate-light-custom transition-all duration-200"
                    onClick={() => handleItemClick(category.id)}
                  >
                    <div className="flex items-center">
                      <i className={`${category.icon} w-6 mr-4 text-warning`}></i>
                      <span className="text-base font-medium">{category.label}</span>
                    </div>
                    <i className="fas fa-chevron-down text-gray-400 text-sm"></i>
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