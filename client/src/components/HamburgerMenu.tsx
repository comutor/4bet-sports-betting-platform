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
    { id: 'promotions', label: 'Promotions', icon: 'fas fa-gift' }
  ];

  const sportsCategories = [
    { id: 'football', label: 'Football', icon: 'fas fa-futbol' },
    { id: 'basketball', label: 'Basketball', icon: 'fas fa-basketball' },
    { id: 'tennis', label: 'Tennis', icon: 'fas fa-table-tennis' },
    { id: 'hockey', label: 'Ice Hockey', icon: 'fas fa-hockey-puck' },
    { id: 'baseball', label: 'Baseball', icon: 'fas fa-baseball' },
    { id: 'volleyball', label: 'Volleyball', icon: 'fas fa-volleyball' }
  ];

  const quickLinks = [
    { id: 'help', label: 'Help & Support', icon: 'fas fa-question-circle' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
    { id: 'about', label: 'About Us', icon: 'fas fa-info-circle' }
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Main Sections */}
            <div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {mainSections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`flex flex-col items-center justify-center p-6 h-20 rounded-xl transition-all duration-200 ${
                      activeTab === section.id
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-slate-light-custom bg-slate-800'
                    }`}
                    onClick={() => handleItemClick(section.id)}
                  >
                    <i className={`${section.icon} text-2xl mb-2`}></i>
                    <span className="text-sm font-medium text-center">{section.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sports Categories */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-4">
                Popular Sports
              </h3>
              <div className="space-y-2">
                {sportsCategories.map((sport) => (
                  <Button
                    key={sport.id}
                    variant="ghost"
                    className={`w-full justify-start p-4 text-left transition-all duration-200 rounded-lg ${
                      activeTab === sport.id
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-slate-light-custom'
                    }`}
                    onClick={() => handleItemClick(sport.id)}
                  >
                    <i className={`${sport.icon} w-6 mr-4`}></i>
                    <span className="text-base font-medium">{sport.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="ghost"
                    className="w-full justify-start p-4 text-left text-gray-300 hover:bg-slate-light-custom transition-all duration-200 rounded-lg"
                    onClick={() => handleItemClick(link.id)}
                  >
                    <i className={`${link.icon} w-6 mr-4 text-gray-400`}></i>
                    <span className="text-base font-medium">{link.label}</span>
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