import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ScratchCard {
  id: number;
  isScratched: boolean;
  symbol: string;
  prize: string;
}

export function ScratchCardsSection() {
  const [cards, setCards] = useState<ScratchCard[]>([
    { id: 1, isScratched: false, symbol: "🍒", prize: "$100" },
    { id: 2, isScratched: false, symbol: "🍒", prize: "$100" },
    { id: 3, isScratched: false, symbol: "💎", prize: "$500" }
  ]);
  
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [canPlayAgain, setCanPlayAgain] = useState(true);

  const scratchCard = (cardId: number) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, isScratched: true } : card
      )
    );

    // Check if all cards are scratched
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isScratched: true } : card
    );
    
    const scratchedCount = updatedCards.filter(card => card.isScratched).length;
    
    if (scratchedCount === 3) {
      checkGameResult(updatedCards);
    }
  };

  const checkGameResult = (allCards: ScratchCard[]) => {
    const symbols = allCards.map(card => card.symbol);
    const uniqueSymbols = symbols.filter((symbol, index) => symbols.indexOf(symbol) === index);
    
    if (uniqueSymbols.length === 1) {
      // All three match - win the prize
      setGameResult(`🎉 JACKPOT! You won ${allCards[0].prize}!`);
      setCanPlayAgain(false);
    } else if (uniqueSymbols.length === 2) {
      // Two match - get one free scratch
      setGameResult("🎁 Two matches! You get one free scratch card!");
      setTimeout(() => {
        resetGame();
      }, 3000);
    } else {
      // No matches
      setGameResult("Try again next week!");
      setCanPlayAgain(false);
    }
  };

  const resetGame = () => {
    setCards([
      { id: 1, isScratched: false, symbol: "🍒", prize: "$100" },
      { id: 2, isScratched: false, symbol: "🍒", prize: "$100" },
      { id: 3, isScratched: false, symbol: "💎", prize: "$500" }
    ]);
    setGameResult(null);
    setCanPlayAgain(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Weekly Lottery Scratch Cards</h2>
        <p className="text-gray-400 mb-6">
          Scratch all three cards! Match 3 symbols to win the jackpot, match 2 to get a free scratch!
        </p>
      </div>

      {/* Scratch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col items-center">
            <div 
              className={`w-40 h-40 rounded-xl border-2 border-gray-600 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                card.isScratched 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
              }`}
              onClick={() => !card.isScratched && canPlayAgain && scratchCard(card.id)}
            >
              {card.isScratched ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">{card.symbol}</div>
                  <div className="text-sm font-bold text-gray-800">{card.prize}</div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <i className="fas fa-hand-pointer text-3xl mb-2"></i>
                  <div className="text-sm">Click to Scratch</div>
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm text-gray-400">Card {card.id}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Result */}
      {gameResult && (
        <div className="text-center mb-6">
          <div className="bg-slate-custom rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-2">{gameResult}</h3>
          </div>
        </div>
      )}

      {/* Reset Button */}
      {!canPlayAgain && (
        <div className="text-center">
          <Button 
            onClick={resetGame}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
          >
            <i className="fas fa-redo mr-2"></i>
            Play Again
          </Button>
        </div>
      )}

      {/* Weekly Timer */}
      <div className="text-center mt-8">
        <div className="bg-slate-custom rounded-xl p-4 border border-gray-700">
          <h4 className="text-lg font-bold mb-2">Next Weekly Draw</h4>
          <div className="text-2xl font-mono text-primary">
            <i className="fas fa-clock mr-2"></i>
            6d 12h 34m 15s
          </div>
          <p className="text-sm text-gray-400 mt-2">
            New scratch cards available every Monday at 12:00 GMT
          </p>
        </div>
      </div>
    </div>
  );
}