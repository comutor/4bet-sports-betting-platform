import { useState, useCallback, useEffect } from 'react';

export interface BetslipItem {
  id: string;
  eventName: string;
  selection: string;
  odds: string;
  stake: number;
  potentialReturn: number;
}

export function useBetslip() {
  const [items, setItems] = useState<BetslipItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load betslip from localStorage on mount
  useEffect(() => {
    const savedBetslip = localStorage.getItem('betslip');
    if (savedBetslip) {
      try {
        const parsedItems = JSON.parse(savedBetslip);
        setItems(parsedItems);
      } catch (error) {
        console.error('Error loading betslip from localStorage:', error);
      }
    }
  }, []);

  // Save betslip to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('betslip', JSON.stringify(items));
  }, [items]);

  const addToBetslip = useCallback((item: Omit<BetslipItem, 'id' | 'stake' | 'potentialReturn'>) => {
    const newItem: BetslipItem = {
      ...item,
      id: Date.now().toString(),
      stake: 100, // Default stake in SSP
      potentialReturn: 100 * parseFloat(item.odds)
    };
    
    setItems(prev => {
      const exists = prev.find(existing => 
        existing.eventName === item.eventName && existing.selection === item.selection
      );
      if (exists) return prev;
      return [...prev, newItem];
    });
  }, []);

  const removeFromBetslip = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateStake = useCallback((id: string, stake: number) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, stake, potentialReturn: stake * parseFloat(item.odds) }
        : item
    ));
  }, []);

  const clearBetslip = useCallback(() => {
    setItems([]);
  }, []);

  const totalStake = items.reduce((sum, item) => sum + item.stake, 0);
  const totalPotentialReturn = items.reduce((sum, item) => sum + item.potentialReturn, 0);

  return {
    items,
    isOpen,
    setIsOpen,
    addToBetslip,
    removeFromBetslip,
    updateStake,
    clearBetslip,
    totalStake,
    totalPotentialReturn,
    count: items.length
  };
}
