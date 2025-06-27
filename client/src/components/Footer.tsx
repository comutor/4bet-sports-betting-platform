export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-4 px-4 text-xs border-t border-slate-700 mt-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main copyright and licensing info */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="text-center sm:text-left">
            <span className="text-slate-300">
              © {new Date().getFullYear()} Wobo Gaming Limited. All rights reserved.
            </span>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-slate-300">
              Licensed and regulated by South Sudan Gaming Board (Temporary)
            </span>
          </div>
        </div>
        
        {/* Payment processing and age restriction */}
        <div className="border-t border-slate-700 pt-3 text-center space-y-1">
          <div className="text-slate-300">
            Bets and payments are processed by Wobo Gaming Limited
          </div>
          <div className="text-yellow-400 font-medium">
            ⚠️ You have to be 18 and above to be eligible to bet
          </div>
        </div>
      </div>
    </footer>
  );
}