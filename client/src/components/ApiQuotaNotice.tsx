import { AlertTriangle, Clock, GamepadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiQuotaNoticeProps {
  onContinueToVirtual?: () => void;
  onContinueToAviator?: () => void;
}

export function ApiQuotaNotice({ onContinueToVirtual, onContinueToAviator }: ApiQuotaNoticeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-700/30 rounded-lg p-6 mx-4 my-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Sports Data Temporarily Unavailable
          </h3>
          <p className="text-gray-300 mb-4">
            We've reached our monthly sports data limit. Real-time odds and match data will resume next month.
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Clock className="h-4 w-4" />
            <span>Resets on the 1st of each month</span>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white flex items-center gap-2">
              <GamepadIcon className="h-4 w-4" />
              Available Gaming Options:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={onContinueToVirtual}
                variant="outline"
                className="bg-blue-600/20 border-blue-500 text-blue-100 hover:bg-blue-600/30 justify-start"
              >
                🏈 Virtual Sports
                <span className="text-xs text-blue-300 ml-auto">Live Now</span>
              </Button>
              
              <Button
                onClick={onContinueToAviator}
                variant="outline"
                className="bg-purple-600/20 border-purple-500 text-purple-100 hover:bg-purple-600/30 justify-start"
              >
                ✈️ Aviator Game
                <span className="text-xs text-purple-300 ml-auto">Available</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>Virtual Sports:</strong> Football, Basketball, Tennis matches every few minutes with real-time results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}