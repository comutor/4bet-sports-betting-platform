import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarModal } from './CalendarModal';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function FilterBar({ 
  activeFilter, 
  onFilterChange, 
  selectedDate, 
  onDateChange 
}: FilterBarProps) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'ALL' },
    { id: 'top-leagues', label: 'TOP LEAGUES' },
    { id: 'competitions', label: 'COMPETITIONS' },
    { id: 'favourites', label: 'FAVOURITES' }
  ];

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'TODAY';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'TOMORROW';
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short' 
      }).toUpperCase();
    }
  };



  return (
    <div className="sticky-filter-bar border-b border-gray-700/30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant="ghost"
                size="sm"
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => onFilterChange(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Calendar Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
              onClick={() => setIsCalendarModalOpen(true)}
            >
              <i className="fas fa-calendar text-sm"></i>
              <span>{selectedDate ? formatDate(selectedDate) : 'TODAY'}</span>
            </Button>

            {/* Calendar Modal */}
            <CalendarModal
              isOpen={isCalendarModalOpen}
              onClose={() => setIsCalendarModalOpen(false)}
              selectedDate={selectedDate || new Date()}
              onDateSelect={(date) => {
                onDateChange?.(date);
                setIsCalendarModalOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}