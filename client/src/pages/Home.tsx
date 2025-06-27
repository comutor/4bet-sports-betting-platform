import { useState, useEffect, useCallback } from "react";
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
import { QuickAccessBoxes } from "@/components/QuickAccessBoxes";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { MyBetsSection } from "@/components/MyBetsSection";
import { SettingsSection } from "@/components/SettingsSection";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawalModal } from "@/components/WithdrawalModal";
import { useBetslip } from "@/hooks/useBetslip";
import { sampleFeaturedEvents } from "@/lib/betting-data";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState('0.00');
  const [userCountry, setUserCountry] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [placedBets, setPlacedBets] = useState<any[]>([]);
  const [sportsFilter, setSportsFilter] = useState<'upcoming' | 'popular' | 'live'>('upcoming');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    items: betslipItems,
    isOpen: betslipOpen,
    setIsOpen: setBetslipOpen,
    addToBetslip,
    removeFromBetslip,
    updateStake,
    clearBetslip,
    isInBetslip,
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
          setUserData(result.user);
        }
      } catch (error) {
        // No existing session
      }
    };
    
    checkAuth();
  }, []);

  const handleBetClick = useCallback((eventName: string, selection: string, odds: string) => {
    // Temporarily disabled for betslip development
    // if (!isLoggedIn) {
    //   setShowLoginPrompt(true);
    //   return;
    // }
    addToBetslip({ eventName, selection, odds });
  }, [addToBetslip]);

  const handleTabChange = useCallback((tab: string) => {
    // Small delay to ensure proper state processing
    setTimeout(() => {
      setActiveTab(tab);
    }, 0);
  }, []);

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
    if (userData) {
      setUserData(userData);
      if (userData.balance) {
        setUserBalance(userData.balance);
      }
      if (userData.country) {
        setUserCountry(userData.country);
      }
    }
  };

  const handleLoginSuccess = (userData?: any) => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setActiveTab('account');
    if (userData) {
      setUserData(userData);
      if (userData.balance) {
        setUserBalance(userData.balance);
      }
      if (userData.country) {
        setUserCountry(userData.country);
      }
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
        setUserData(null);
        setActiveTab('home');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still log out locally even if server request fails
      setIsLoggedIn(false);
      setUserData(null);
      setUserBalance('0.00');
      setUserCountry('');
      setActiveTab('home');
    }
  };

  const handleOpenDepositModal = () => {
    setShowDepositModal(true);
  };

  const handleDepositSuccess = (amount: number) => {
    const currentBalance = parseFloat(userBalance.replace(/,/g, ''));
    const newBalance = currentBalance + amount;
    console.log('Deposit success:', { currentBalance, amount, newBalance });
    setUserBalance(newBalance.toLocaleString());
    setShowDepositModal(false);
  };

  const handleOpenWithdrawalModal = () => {
    setShowWithdrawalModal(true);
  };

  const handleWithdrawalSuccess = (amount: number) => {
    const currentBalance = parseFloat(userBalance.replace(/,/g, ''));
    const newBalance = Math.max(0, currentBalance - amount);
    console.log('Withdrawal success:', { currentBalance, amount, newBalance });
    setUserBalance(newBalance.toLocaleString());
    setShowWithdrawalModal(false);
  };

  const handlePlaceBet = (betData: any) => {
    // Add bet to placed bets list
    setPlacedBets(prev => [...prev, betData]);
    
    // Deduct stake from user balance
    const currentBalance = parseFloat(userBalance.replace(/,/g, ''));
    const newBalance = currentBalance - betData.stake;
    setUserBalance(newBalance.toLocaleString());
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Auto-Rotating Welcome Banner */}
            <WelcomeBanner />

            <QuickAccessBoxes 
              onUpcomingClick={() => {
                setActiveTab('sports');
                setSportsFilter('upcoming');
              }}
              onLiveClick={() => {
                setActiveTab('sports');
                setSportsFilter('live');
              }}
            />

            <FeaturedEvents onBetClick={handleBetClick} onTabChange={handleTabChange} />
          </>
        );
      case 'sports':
        return <SportsOverview onBetClick={handleBetClick} activeFilter={sportsFilter} onTabChange={handleTabChange} />;
      case 'football':
        return <FootballSection onBetClick={handleBetClick} isInBetslip={isInBetslip} />;
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
      case 'my-bets':
        return <MyBetsSection userId={isLoggedIn ? userData?.id : undefined} userCountry={userCountry} placedBets={placedBets} />;
      case 'settings':
        return <SettingsSection userCountry={userCountry} isLoggedIn={isLoggedIn} onBackToAccount={() => setActiveTab('account')} />;
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
          onSettingsClick={() => setActiveTab('settings')}
          onDepositClick={handleOpenDepositModal}
          onWithdrawClick={handleOpenWithdrawalModal}
          userData={userData}
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
      <div className="mx-auto lg:max-w-2xl xl:max-w-4xl bg-background min-h-screen relative lg:px-4">
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
          onDepositClick={handleOpenDepositModal}
          sportsFilter={sportsFilter}
          onSportsFilterChange={setSportsFilter}
          isSearchOpen={isSearchOpen}
          onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
          onClearBetslip={clearBetslip}
          totalStake={totalStake}
          totalPotentialReturn={totalPotentialReturn}
          isLoggedIn={isLoggedIn}
          userBalance={parseFloat(userBalance.replace(/,/g, ''))}
          onLoginClick={handleOpenLoginModal}
          onDepositClick={handleOpenDepositModal}
          onPlaceBet={handlePlaceBet}
          userCountry={userCountry}
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
          onSignupClick={handleOpenSignupPage}
        />

        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          userCountry={userCountry}
          currentBalance={userBalance}
          onDepositSuccess={handleDepositSuccess}
          isLoggedIn={isLoggedIn}
          onLoginRequired={handleOpenLoginModal}
        />

        <WithdrawalModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          userCountry={userCountry}
          currentBalance={userBalance}
          onWithdrawalSuccess={handleWithdrawalSuccess}
        />
      </div>
    </div>
  );
}
