import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeaturedEvents } from "./FeaturedEvents";
import { SportsOverview } from "./SportsOverview";
import { LiveSection } from "./LiveSection";

interface AllSportsSectionProps {
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function AllSportsSection({ onBetClick }: AllSportsSectionProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'popular' | 'live'>('upcoming');

  const tabs = [
    { id: 'upcoming' as const, label: 'Upcoming', icon: 'fas fa-clock' },
    { id: 'popular' as const, label: 'Popular', icon: 'fas fa-fire' },
    { id: 'live' as const, label: 'Live', icon: 'fas fa-broadcast-tower' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Upcoming Matches</h3>
              <p className="text-gray-400 text-sm">Arranged by time - next matches first</p>
            </div>
            <FeaturedEvents onBetClick={onBetClick} />
          </div>
        );
      case 'popular':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Popular Matches</h3>
              <p className="text-gray-400 text-sm">Most selected bets by users</p>
            </div>
            <SportsOverview onBetClick={onBetClick} activeFilter="popular" />
          </div>
        );
      case 'live':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Live Matches</h3>
              <p className="text-gray-400 text-sm">Currently playing - bet in real time</p>
            </div>
            <LiveSection onBetClick={onBetClick} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-4">
      {/* Header - positioned closer to top */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="fas fa-futbol mr-3 text-primary"></i>
          All Sports
        </h2>
      </div>

      {/* Enhanced Tab Navigation - positioned closer to header */}
      <div className="relative mb-6 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12">
        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm p-1.5 mx-4 sm:mx-6 lg:mx-8 xl:mx-12 rounded-xl border border-slate-600/50 shadow-lg">
          {tabs.map((tab, index) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`relative flex-1 flex items-center justify-center gap-2 py-4 px-3 rounded-lg font-medium transition-all duration-300 transform ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105 border border-blue-500/50'
                  : 'text-gray-300 hover:bg-slate-700/70 hover:text-white hover:scale-102 active:scale-95'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* Background gradient for active tab */}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-lg animate-pulse"></div>
              )}
              
              {/* Icon with enhanced styling */}
              <i className={`${tab.icon} text-base relative z-10 ${
                activeTab === tab.id ? 'text-white drop-shadow-sm' : ''
              }`}></i>
              
              {/* Label with enhanced typography */}
              <span className={`font-bold text-sm uppercase tracking-wide relative z-10 ${
                activeTab === tab.id ? 'text-white drop-shadow-sm' : ''
              }`}>
                {tab.label}
              </span>
              
              {/* Live indicator with enhanced animation */}
              {tab.id === 'live' && (
                <div className="relative z-10 flex items-center">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></div>
                </div>
              )}
              
              {/* Active tab border indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
        
        {/* Decorative underline */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}