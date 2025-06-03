import { Button } from "@/components/ui/button";

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
}

export function AccountSidebar({ isOpen, onClose, isLoggedIn = false }: AccountSidebarProps) {
  console.log('AccountSidebar rendering, isOpen:', isOpen);
  const accountMenuItems = [
    { id: 'why-join', label: 'Why Join?', icon: 'fas fa-question-circle', hasArrow: true },
    { id: 'deposit', label: 'Deposit', icon: 'fas fa-credit-card', hasArrow: true },
    { id: 'help-center', label: 'Help Center', icon: 'fas fa-life-ring', hasDropdown: true },
    { id: 'download-app', label: 'Download the App', icon: 'fas fa-mobile-alt', hasArrow: true },
    { id: 'more-betpawa', label: 'More on betPawa', icon: 'fas fa-info-circle', hasDropdown: true }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[59] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-slate-custom transform transition-transform duration-300 ease-in-out z-[60] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Account</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <i className="fas fa-times text-2xl"></i>
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-4 text-sm">
                    JOIN NOW
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-400 text-gray-300 hover:bg-slate-700 font-bold py-4 text-sm">
                    LOG IN
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-4">
                    DEPOSIT
                  </Button>
                  <Button variant="outline" className="border-gray-400 text-gray-300 hover:bg-slate-700 font-bold py-4">
                    MY BETS
                  </Button>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              {accountMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-between p-4 text-left text-gray-300 hover:bg-slate-light-custom transition-all duration-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <i className={`${item.icon} w-5 mr-3 text-gray-400`}></i>
                    <span className="text-base font-medium">{item.label}</span>
                  </div>
                  {item.hasArrow && (
                    <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                  )}
                  {item.hasDropdown && (
                    <i className="fas fa-chevron-down text-gray-400 text-sm"></i>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}