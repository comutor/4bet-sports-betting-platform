import { useState } from "react";
import { TopNavigation } from "@/components/TopNavigation";
import { BottomNavigation } from "@/components/BottomNavigation";
import { BetslipSidebar } from "@/components/BetslipSidebar";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { SportsSection } from "@/components/SportsSection";
import { LiveSection } from "@/components/LiveSection";
import { CasinoSection } from "@/components/CasinoSection";
import { VirtualSection } from "@/components/VirtualSection";
import { AviatorSection } from "@/components/AviatorSection";
import { useBetslip } from "@/hooks/useBetslip";
import { sampleFeaturedEvents } from "@/lib/betting-data";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMoreSports, setShowMoreSports] = useState(false);
  const {
    items: betslipItems,
    isOpen: betslipOpen,
    setIsOpen: setBetslipOpen,
    addToBetslip,
    removeFromBetslip,
    updateStake,
    totalStake,
    totalPotentialReturn,
    count: betslipCount
  } = useBetslip();

  const handleBetClick = (eventName: string, selection: string, odds: string) => {
    addToBetslip({ eventName, selection, odds });
  };

  const quickAccessSports = [
    { id: 'football', name: 'Football', icon: 'fas fa-futbol', color: 'text-success' },
    { id: 'basketball', name: 'Basketball', icon: 'fas fa-basketball', color: 'text-warning' },
    { id: 'tennis', name: 'Tennis', icon: 'fas fa-table-tennis', color: 'text-primary' },
    { id: 'hockey', name: 'Hockey', icon: 'fas fa-hockey-puck', color: 'text-live' },
    { id: 'volleyball', name: 'Volleyball', icon: 'fas fa-volleyball', color: 'text-secondary' }
  ];

  const additionalOptions = [
    { id: 'casino', name: 'Casino', icon: 'fas fa-dice', color: 'text-primary' },
    { id: 'aviator', name: 'Aviator', icon: 'fas fa-plane', color: 'text-live' },
    { id: 'virtual', name: 'Virtual Sports', icon: 'fas fa-robot', color: 'text-secondary' }
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600/90 to-emerald-600/90 relative">
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to NileBet</h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-6">Your Premier Betting Destination</p>
                    <Button className="bg-warning hover:bg-yellow-500 text-black px-8 py-3 text-lg font-bold">
                      Start Betting Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <FeaturedEvents events={sampleFeaturedEvents} onBetClick={handleBetClick} />
          </>
        );
      case 'sports':
        return <SportsSection onBetClick={handleBetClick} />;
      case 'live':
        return <LiveSection onBetClick={handleBetClick} />;
      case 'casino':
        return <CasinoSection />;
      case 'virtual':
        return <VirtualSection onBetClick={handleBetClick} />;
      case 'aviator':
        return <AviatorSection />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-400">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userBalance="$1,250.00" 
      />
      
      {/* Quick Access Sports Bar */}
      <div className="bg-slate-custom border-b border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {quickAccessSports.map((sport) => (
              <Button
                key={sport.id}
                variant="ghost"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-slate-light-custom"
                onClick={() => setActiveTab('sports')}
              >
                <i className={`${sport.icon} ${sport.color}`}></i>
                <span className="text-sm font-medium">{sport.name}</span>
              </Button>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap hover:bg-slate-light-custom"
                >
                  <i className="fas fa-ellipsis-h text-gray-400"></i>
                  <span className="text-sm font-medium">More</span>
                  <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-custom border-gray-700">
                {additionalOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-slate-light-custom"
                    onClick={() => setActiveTab(option.id)}
                  >
                    <i className={`${option.icon} ${option.color}`}></i>
                    <span>{option.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <main className="pb-20 md:pb-4">
        {renderMainContent()}
      </main>

      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onBetslipOpen={() => setBetslipOpen(true)}
        betslipCount={betslipCount}
      />

      <BetslipSidebar 
        isOpen={betslipOpen}
        onClose={() => setBetslipOpen(false)}
        items={betslipItems}
        onRemoveItem={removeFromBetslip}
        onUpdateStake={updateStake}
        totalStake={totalStake}
        totalPotentialReturn={totalPotentialReturn}
      />
    </div>
  );
}
