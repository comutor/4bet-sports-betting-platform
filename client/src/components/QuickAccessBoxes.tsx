import { Button } from "@/components/ui/button";

interface QuickAccessBoxesProps {
  onUpcomingClick: () => void;
  onLiveClick: () => void;
}

export function QuickAccessBoxes({ onUpcomingClick, onLiveClick }: QuickAccessBoxesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-4">
      {/* Upcoming Matches Box */}
      <div 
        className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105"
        onClick={onUpcomingClick}
      >
        <div className="text-center text-white">
          <div className="mb-2">
            <i className="fas fa-calendar text-2xl"></i>
          </div>
          <h3 className="text-base font-bold mb-1">Upcoming Matches</h3>
          <p className="text-xs text-blue-100 mb-3">Bet on future games</p>
          <Button 
            className="bg-white text-blue-800 hover:bg-gray-100 px-4 py-1.5 text-sm font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onUpcomingClick();
            }}
          >
            View All
          </Button>
        </div>
      </div>

      {/* Live Now Box */}
      <div 
        className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105"
        onClick={onLiveClick}
      >
        <div className="text-center text-white">
          <div className="mb-2 relative">
            <i className="fas fa-broadcast-tower text-2xl"></i>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-live rounded-full animate-pulse"></span>
          </div>
          <h3 className="text-base font-bold mb-1">Live Now</h3>
          <p className="text-xs text-red-100 mb-3">Bet on live games</p>
          <Button 
            className="bg-white text-red-800 hover:bg-gray-100 px-4 py-1.5 text-sm font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onLiveClick();
            }}
          >
            Watch Live
          </Button>
        </div>
      </div>
    </div>
  );
}