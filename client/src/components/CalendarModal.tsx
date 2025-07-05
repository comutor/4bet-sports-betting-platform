import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarModal({ isOpen, onClose, selectedDate, onDateSelect }: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-update months when current month ends
  useEffect(() => {
    const checkMonthChange = () => {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      if (currentMonth.getTime() !== currentMonthStart.getTime()) {
        setCurrentMonth(currentMonthStart);
      }
    };

    // Check every day at midnight
    const interval = setInterval(checkMonthChange, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentMonth]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasEvents = (date: Date) => {
    // Mock logic - in real app, this would check for actual events
    const day = date.getDate();
    return day % 3 === 0 || day % 7 === 0; // Show dots on some days
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Generate the three months to display
  const getThreeMonths = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
      months.push(month);
    }
    return months;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const today = isToday(date);
      const selected = isSelected(date);
      const hasEventsIndicator = hasEvents(date);
      const isPast = isPastDate(new Date(date));

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast) {
              onDateSelect(date);
              onClose();
            }
          }}
          disabled={isPast}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
            isPast
              ? 'text-gray-600 line-through cursor-not-allowed opacity-50'
              : selected
              ? 'bg-primary text-white'
              : today
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {day}
          {hasEventsIndicator && !isPast && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const renderMonth = (month: Date, index: number) => {
    return (
      <div key={`month-${index}`} className="border-b border-gray-700 last:border-b-0">
        {/* Month header */}
        <div className="text-center py-2 bg-slate-700/30">
          <h3 className="text-sm font-bold text-white">
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </h3>
        </div>

        <div className="p-3">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays(month)}
          </div>
        </div>
      </div>
    );
  };

  const threeMonths = getThreeMonths();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-48 pr-4 z-50">
      <div ref={modalRef} className="bg-slate-800 border border-gray-700 rounded-xl shadow-lg w-80 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700 sticky top-0 bg-slate-800 z-10">
          <button
            onClick={() => navigateMonth('prev')}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <i className="fas fa-chevron-left text-sm"></i>
          </button>
          
          <h2 className="text-base font-bold text-white">
            3 Month Calendar
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 ml-2"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Three Months */}
        <div className="divide-y divide-gray-700">
          {threeMonths.map((month, index) => renderMonth(month, index))}
        </div>

        {/* Footer with event indicator legend */}
        <div className="px-3 py-3 border-t border-gray-700 bg-slate-800 sticky bottom-0">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Event days for your favourites</span>
          </div>
        </div>
      </div>
    </div>
  );
}