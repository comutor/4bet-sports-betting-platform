import { Button } from "@/components/ui/button";

interface QuickAccessBoxesProps {
  onUpcomingClick: () => void;
  onLiveClick: () => void;
}

export function QuickAccessBoxes({ onUpcomingClick, onLiveClick }: QuickAccessBoxesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-6">
      {/* Upcoming Matches Box */}
      <div 
        className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 cursor-pointer transform transition-transform hover:scale-105"
        onClick={onUpcomingClick}
      >
        <div className="text-center text-white">
          <div className="mb-3">
            <i className="fas fa-calendar text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold mb-2">Upcoming Matches</h3>
          <p className="text-sm text-blue-100 mb-4">Bet on future games</p>
          <Button 
            className="bg-white text-blue-800 hover:bg-gray-100 px-6 py-2 font-semibold"
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
        className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 cursor-pointer transform transition-transform hover:scale-105"
        onClick={onLiveClick}
      >
        <div className="text-center text-white">
          <div className="mb-3 relative">
            <i className="fas fa-broadcast-tower text-3xl"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-live rounded-full animate-pulse"></span>
          </div>
          <h3 className="text-lg font-bold mb-2">Live Now</h3>
          <p className="text-sm text-red-100 mb-4">Bet on live games</p>
          <Button 
            className="bg-white text-red-800 hover:bg-gray-100 px-6 py-2 font-semibold"
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