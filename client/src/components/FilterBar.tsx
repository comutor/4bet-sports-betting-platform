import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  return (
    <div className="bg-slate-custom/90 backdrop-blur-sm border-b border-gray-700/30 px-4 py-3">
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
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <i className="fas fa-calendar text-sm"></i>
            <span>{selectedDate ? formatDate(selectedDate) : 'TODAY'}</span>
            <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`}></i>
          </Button>

          {/* Calendar Dropdown */}
          {isCalendarOpen && (
            <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-gray-700 rounded-xl shadow-lg z-50 min-w-[200px]">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-300">Select Date</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-1"
                    onClick={() => setIsCalendarOpen(false)}
                  >
                    <i className="fas fa-times text-xs"></i>
                  </Button>
                </div>
                <div className="space-y-1">
                  {generateDateOptions().map((date, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-between p-2 h-10 rounded-lg transition-all duration-200 ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'bg-primary text-white'
                          : 'hover:bg-slate-700 text-gray-300'
                      }`}
                      onClick={() => {
                        onDateChange?.(date);
                        setIsCalendarOpen(false);
                      }}
                    >
                      <span className="text-xs font-medium">{formatDate(date)}</span>
                      <span className="text-xs text-gray-400">
                        {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}