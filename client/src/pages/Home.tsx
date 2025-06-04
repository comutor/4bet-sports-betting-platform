import { useState, useEffect } from "react";
import { TopNavigation } from "@/components/TopNavigation";
import { BottomNavigation } from "@/components/BottomNavigation";
import { BetslipSidebar } from "@/components/BetslipSidebar";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { SportsSection } from "@/components/SportsSection";
import { LiveSection } from "@/components/LiveSection";
import { CasinoSection } from "@/components/CasinoSection";
import { VirtualSection } from "@/components/VirtualSection";
import { AviatorSection } from "@/components/AviatorSection";
import { ScratchCardsSection } from "@/components/ScratchCardsSection";
import { AccountPage } from "@/components/AccountPage";
import { LoginPrompt } from "@/components/LoginPrompt";
import { CountriesSection } from "@/components/CountriesSection";
import { SignupPage } from "@/components/SignupPage";
import { LoginModal } from "@/components/LoginModal";
import { FootballSection } from "@/components/FootballSection";
import { SportSection } from "@/components/SportSection";
import { SportsOverview } from "@/components/SportsOverview";
import { useBetslip } from "@/hooks/useBetslip";
import { sampleFeaturedEvents } from "@/lib/betting-data";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState('0.00');
  const [userCountry, setUserCountry] = useState<string>('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sportsFilter, setSportsFilter] = useState<'upcoming' | 'live'>('upcoming');
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

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const result = await response.json();
          setIsLoggedIn(true);
          setUserBalance(result.user.balance);
          setUserCountry(result.user.country);
        }
      } catch (error) {
        // No existing session
      }
    };
    
    checkAuth();
  }, []);

  const handleBetClick = (eventName: string, selection: string, odds: string) => {
    // Temporarily disabled for betslip development
    // if (!isLoggedIn) {
    //   setShowLoginPrompt(true);
    //   return;
    // }
    addToBetslip({ eventName, selection, odds });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginPrompt(false);
    setShowSignupPage(false);
    setActiveTab('account');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setShowLoginPrompt(false);
    setShowSignupPage(false);
    setActiveTab('account');
  };

  const handleOpenSignupPage = () => {
    setShowSignupPage(true);
    setShowLoginPrompt(false);
    setShowLoginModal(false);
    setIsMenuOpen(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupPage(false);
    setShowLoginPrompt(false);
    setIsMenuOpen(false);
  };

  const handleCloseSignupPage = () => {
    setShowSignupPage(false);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleSignupSuccess = (userData?: any) => {
    setIsLoggedIn(true);
    setShowSignupPage(false);
    setActiveTab('account');
    if (userData?.balance) {
      setUserBalance(userData.balance);
    }
    if (userData?.country) {
      setUserCountry(userData.country);
    }
  };

  const handleLoginSuccess = (userData?: any) => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setActiveTab('account');
    if (userData?.balance) {
      setUserBalance(userData.balance);
    }
    if (userData?.country) {
      setUserCountry(userData.country);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        setUserBalance('0.00');
        setUserCountry('');
        setActiveTab('home');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still log out locally even if server request fails
      setIsLoggedIn(false);
      setUserBalance('0.00');
      setUserCountry('');
      setActiveTab('home');
    }
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
          </>
        );
      case 'sports':
        return <SportsOverview onBetClick={handleBetClick} activeFilter={sportsFilter} />;
      case 'football':
        return <FootballSection onBetClick={handleBetClick} />;
      case 'basketball':
        return <SportSection sport="basketball" onBetClick={handleBetClick} />;
      case 'tennis':
        return <SportSection sport="tennis" onBetClick={handleBetClick} />;
      case 'hockey':
        return <SportSection sport="hockey" onBetClick={handleBetClick} />;
      case 'baseball':
        return <SportSection sport="baseball" onBetClick={handleBetClick} />;
      case 'volleyball':
        return <SportSection sport="volleyball" onBetClick={handleBetClick} />;
      case 'live':
        return <LiveSection onBetClick={handleBetClick} />;
      case 'casino':
        return <CasinoSection />;
      case 'virtual':
        return <VirtualSection onBetClick={handleBetClick} />;
      case 'aviator':
        return <AviatorSection />;
      case 'scratch-cards':
        return <ScratchCardsSection />;
      case 'account':
        return <AccountPage 
          isLoggedIn={isLoggedIn} 
          onClose={() => setActiveTab('home')} 
          onSignupClick={handleOpenSignupPage}
          onLoginClick={handleOpenLoginModal}
          onLogout={handleLogout}
        />;
      case 'signup':
        return <SignupPage onClose={() => setActiveTab('home')} onSuccess={() => { setIsLoggedIn(true); setActiveTab('account'); }} />;
      case 'top-countries':
      case 'international':
      case 'other-countries':
        return <CountriesSection selectedCategory={activeTab} onBetClick={handleBetClick} />;
      case 'esports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-400">This section is under development.</p>
          </div>
        );
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
        userBalance={userBalance}
        userCountry={userCountry}
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        onSignupClick={handleOpenSignupPage}
        onLoginClick={handleOpenLoginModal}
        sportsFilter={sportsFilter}
        onSportsFilterChange={setSportsFilter}
      />
      

      
      <main className="pb-20 md:pb-4">
        {renderMainContent()}
      </main>

      <BottomNavigation 
        activeTab={isMenuOpen ? 'menu' : activeTab} 
        onTabChange={setActiveTab}
        onBetslipOpen={() => setBetslipOpen(true)}
        onMenuOpen={() => setIsMenuOpen(true)}
        onSignupClick={handleOpenSignupPage}
        betslipCount={betslipCount}
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
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

      <HamburgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />

      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {showSignupPage && (
        <SignupPage 
          onClose={handleCloseSignupPage}
          onSuccess={handleSignupSuccess}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
