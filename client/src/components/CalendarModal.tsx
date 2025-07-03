import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarModal({ isOpen, onClose, selectedDate, onDateSelect }: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const modalRef = useRef<HTMLDivElement>(null);

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const today = isToday(date);
      const selected = isSelected(date);
      const hasEventsIndicator = hasEvents(date);

      days.push(
        <button
          key={day}
          onClick={() => {
            onDateSelect(date);
            onClose();
          }}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
            selected
              ? 'bg-primary text-white'
              : today
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {day}
          {hasEventsIndicator && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-48 pr-4 z-50">
      <div ref={modalRef} className="bg-slate-800 border border-gray-700 rounded-xl shadow-lg w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <button
            onClick={() => navigateMonth('prev')}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <i className="fas fa-chevron-left text-sm"></i>
          </button>
          
          <h2 className="text-base font-bold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
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

        {/* Calendar */}
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
            {renderCalendarDays()}
          </div>
        </div>

        {/* Footer with event indicator legend */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Event days for your favourites</span>
          </div>
        </div>
      </div>
    </div>
  );
}