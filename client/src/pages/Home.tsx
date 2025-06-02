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

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
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

            {/* Quick Access */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="secondary"
                  className="bg-slate-custom hover:bg-slate-light-custom p-6 h-auto flex-col"
                  onClick={() => setActiveTab('sports')}
                >
                  <i className="fas fa-futbol text-3xl text-success mb-3"></i>
                  <div className="font-medium">Football</div>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-slate-custom hover:bg-slate-light-custom p-6 h-auto flex-col"
                  onClick={() => setActiveTab('sports')}
                >
                  <i className="fas fa-basketball text-3xl text-warning mb-3"></i>
                  <div className="font-medium">Basketball</div>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-slate-custom hover:bg-slate-light-custom p-6 h-auto flex-col"
                  onClick={() => setActiveTab('casino')}
                >
                  <i className="fas fa-dice text-3xl text-primary mb-3"></i>
                  <div className="font-medium">Casino</div>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-slate-custom hover:bg-slate-light-custom p-6 h-auto flex-col"
                  onClick={() => setActiveTab('aviator')}
                >
                  <i className="fas fa-plane text-3xl text-live mb-3"></i>
                  <div className="font-medium">Aviator</div>
                </Button>
              </div>
            </div>
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
