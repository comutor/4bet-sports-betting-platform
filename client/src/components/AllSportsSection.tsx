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
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="fas fa-futbol mr-3 text-primary"></i>
          All Sports
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-8 bg-slate-800 p-1 rounded-lg border border-gray-700">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`${tab.icon} text-sm`}></i>
            <span className="font-bold text-sm uppercase">{tab.label}</span>
            {tab.id === 'live' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}