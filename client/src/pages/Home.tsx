import { useState, useEffect, useCallback } from "react";
import { TopNavigation } from "@/components/TopNavigation";
import { FilterBar } from "@/components/FilterBar";

import { BottomNavigation } from "@/components/BottomNavigation";
import { BetslipSidebar } from "@/components/BetslipSidebar";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { LiveSection } from "@/components/LiveSection";
import { CasinoSection } from "@/components/CasinoSection";
import { VirtualSection } from "@/components/VirtualSection";
import { AviatorSection } from "@/components/AviatorSection";
import { ScratchCardsSection } from "@/components/ScratchCardsSection";
import { AccountPage } from "@/components/AccountPage";
import { LoginPrompt } from "@/components/LoginPrompt";
import { CountriesSection } from "@/components/CountriesSection";
import { CompetitionsSection } from "@/components/CompetitionsSection";
import { TopLeaguesSection } from "@/components/TopLeaguesSection";
import { SignupPage } from "@/components/SignupPage";
import { LoginModal } from "@/components/LoginModal";
import { FootballSection } from "@/components/FootballSection";
import { SportSection } from "@/components/SportSection";
import { MyBetsSection } from "@/components/MyBetsSection";
import { StatementSection } from "@/components/StatementSection";
import { AllSportsSection } from "@/components/AllSportsSection";
import { AllSection } from "@/components/AllSection";
import { LeagueMatchesSection } from "@/components/LeagueMatchesSection";

import { DepositModal } from "@/components/DepositModal";
import { WithdrawalModal } from "@/components/WithdrawalModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { VirtualFootballSection } from "@/components/VirtualFootballSection";
import { useBetslip } from "@/hooks/useBetslip";
import { sampleFeaturedEvents } from "@/lib/betting-data";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState('football');
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

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<{ id: string; name: string } | null>(null);
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
      } finally {
        // Hide loading screen after authentication check
        setTimeout(() => setIsAppLoading(false), 1500);
      }
    };
    
    checkAuth();
  }, []);

  // Reset selected league when filter changes
  useEffect(() => {
    if (selectedLeague) {
      setSelectedLeague(null);
    }
  }, [activeFilter]);

  // Reset selected league when sport tab changes
  useEffect(() => {
    if (selectedLeague) {
      setSelectedLeague(null);
    }
  }, [activeTab]);

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
        setActiveTab('football');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still log out locally even if server request fails
      setIsLoggedIn(false);
      setUserData(null);
      setUserBalance('0.00');
      setUserCountry('');
      setActiveTab('football');
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

  const handleLeagueClick = (leagueId: string, leagueName: string) => {
    setSelectedLeague({ id: leagueId, name: leagueName });
  };

  const handleBackFromLeague = () => {
    setSelectedLeague(null);
  };

  const renderMainContent = () => {
    // Check if viewing specific league matches
    if (selectedLeague) {
      return (
        <LeagueMatchesSection 
          leagueId={selectedLeague.id}
          leagueName={selectedLeague.name}
          onBetClick={handleBetClick}
          onBack={handleBackFromLeague}
        />
      );
    }

    // Check if all filter is active for any sport tab
    if (['afl', 'baseball', 'basketball', 'football', 'formula-1', 'handball', 'hockey', 'mma', 'nfl', 'rugby', 'volleyball'].includes(activeTab) && 
        activeFilter === 'all') {
      return <AllSection selectedDate={selectedDate} sport={activeTab} onBetClick={handleBetClick} />;
    }

    // Check if competitions filter is active for any sport tab
    if (['afl', 'baseball', 'basketball', 'football', 'formula-1', 'handball', 'hockey', 'mma', 'nfl', 'rugby', 'volleyball'].includes(activeTab) && 
        activeFilter === 'competitions') {
      return <CompetitionsSection onBetClick={handleBetClick} onLeagueClick={handleLeagueClick} sport={activeTab} />;
    }

    // Check if top-leagues filter is active for any sport tab
    if (['afl', 'baseball', 'basketball', 'football', 'formula-1', 'handball', 'hockey', 'mma', 'nfl', 'rugby', 'volleyball'].includes(activeTab) && 
        activeFilter === 'top-leagues') {
      return <TopLeaguesSection onBetClick={handleBetClick} onLeagueClick={handleLeagueClick} sport={activeTab} />;
    }

    // Check if live filter is active for any sport tab
    if (['afl', 'baseball', 'basketball', 'football', 'formula-1', 'handball', 'hockey', 'mma', 'nfl', 'rugby', 'volleyball'].includes(activeTab) && 
        activeFilter === 'live') {
      return <LiveSection sport={activeTab} onBetClick={handleBetClick} />;
    }

    switch (activeTab) {
      case 'sports':
        return <AllSportsSection onBetClick={handleBetClick} />;
      case 'football':
        return <FootballSection onBetClick={handleBetClick} isInBetslip={isInBetslip} />;
      case 'basketball':
        return <SportSection sport="basketball" onBetClick={handleBetClick} />;
      case 'hockey':
        return <SportSection sport="hockey" onBetClick={handleBetClick} />;
      case 'baseball':
        return <SportSection sport="baseball" onBetClick={handleBetClick} />;
      case 'volleyball':
        return <SportSection sport="volleyball" onBetClick={handleBetClick} />;
      
      // New sports - Coming Soon implementations
      case 'afl':
        return (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold mb-4">AFL Coming Soon</h2>
            <p className="text-gray-400">Australian Football League betting is under development.</p>
          </div>
        );
      case 'formula-1':
        return (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold mb-4">Formula-1 Coming Soon</h2>
            <p className="text-gray-400">Formula 1 betting is under development.</p>
          </div>
        );
      case 'handball':
        return (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold mb-4">Handball Coming Soon</h2>
            <p className="text-gray-400">Handball betting is under development.</p>
          </div>
        );
      case 'mma':
        return (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold mb-4">MMA Coming Soon</h2>
            <p className="text-gray-400">Mixed Martial Arts betting is under development.</p>
          </div>
        );
      case 'nfl':
        return (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold mb-4">NFL Coming Soon</h2>
            <p className="text-gray-400">National Football League betting is under development.</p>
          </div>
        );
      case 'rugby':
        return (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold mb-4">Rugby Coming Soon</h2>
            <p className="text-gray-400">Rugby betting is under development.</p>
          </div>
        );
      case 'live':
        return <LiveSection sport={activeTab} onBetClick={handleBetClick} />;
      case 'my-bets':
        return <MyBetsSection userId={isLoggedIn ? userData?.id : undefined} userCountry={userCountry} placedBets={placedBets} />;
      case 'statement':
        return <StatementSection onBack={() => setActiveTab('account')} userCountry={userCountry} userId={isLoggedIn ? userData?.id : undefined} />;

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

          onDepositClick={handleOpenDepositModal}
          onWithdrawClick={handleOpenWithdrawalModal}
          onStatementClick={() => setActiveTab('statement')}
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
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-400">This section is under development.</p>
          </div>
        );
      case 'home':
        return <FootballSection onBetClick={handleBetClick} isInBetslip={isInBetslip} />;
      default:
        return <FootballSection onBetClick={handleBetClick} isInBetslip={isInBetslip} />;
    }
  };

  // Show loading screen during app initialization
  if (isAppLoading) {
    return <LoadingScreen />;
  }

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
        onDepositClick={handleOpenDepositModal}
      />

      <div className="main-container w-full bg-background min-h-screen relative pt-24">
        
        {/* Filter Bar - shown only for sports tabs */}
        {['football', 'basketball', 'tennis', 'ice-hockey', 'american-football', 'esports'].includes(activeTab) && (
          <FilterBar 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        
        <main className={`pb-20 md:pb-4 ${
          ['football', 'basketball', 'tennis', 'ice-hockey', 'american-football', 'esports'].includes(activeTab) 
            ? 'pt-0' 
            : 'pt-4'
        }`}>
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
