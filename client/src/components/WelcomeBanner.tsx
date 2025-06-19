import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const bannerSlides = [
  {
    id: 1,
    title: "Welcome to TATAbets",
    subtitle: "Your Premier Betting Destination",
    buttonText: "Start Betting Now",
    gradient: "from-blue-600/90 to-emerald-600/90",
    icon: "fas fa-trophy"
  },
  {
    id: 2,
    title: "Live Betting Action",
    subtitle: "Bet on Live Sports Events",
    buttonText: "Watch Live",
    gradient: "from-red-600/90 to-orange-600/90",
    icon: "fas fa-broadcast-tower"
  },
  {
    id: 3,
    title: "Welcome Bonus",
    subtitle: "Get 100% Match on First Deposit",
    buttonText: "Claim Bonus",
    gradient: "from-purple-600/90 to-pink-600/90",
    icon: "fas fa-gift"
  },
  {
    id: 4,
    title: "Casino Games",
    subtitle: "Play Slots, Poker & More",
    buttonText: "Play Now",
    gradient: "from-green-600/90 to-teal-600/90",
    icon: "fas fa-dice"
  }
];

export function WelcomeBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000); // Auto-rotate every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentBanner = bannerSlides[currentSlide];

  return (
    <div className="relative overflow-hidden">
      <div className={`h-52 md:h-64 bg-gradient-to-r ${currentBanner.gradient} relative`}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <div className="mb-3">
              <i className={`${currentBanner.icon} text-4xl md:text-5xl text-white`}></i>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">{currentBanner.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-5">{currentBanner.subtitle}</p>
            <Button className="bg-warning hover:bg-yellow-500 text-black px-6 py-2.5 text-base font-bold transition-colors">
              {currentBanner.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}