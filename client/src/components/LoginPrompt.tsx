import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export function LoginPrompt({ isOpen, onClose, onLogin, onSignup }: LoginPromptProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-gray-700 text-white max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Login Required</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <p className="text-center text-gray-300 text-sm">
            You need to be logged in to place bets
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={onSignup}
              className="w-full bg-yellow-400 border-2 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300 hover:scale-105 font-bold py-3"
            >
              SIGN UP
            </Button>
            
            <Button 
              onClick={onLogin}
              variant="outline" 
              className="w-full border-2 border-gray-400 text-gray-300 hover:bg-slate-700 font-bold py-3"
            >
              LOG IN
            </Button>
          </div>
          
          <Button 
            onClick={onClose}
            variant="ghost" 
            className="w-full text-gray-400 hover:text-white text-sm"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}