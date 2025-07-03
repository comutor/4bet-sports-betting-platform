import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function SearchBar({ searchQuery = '', onSearchChange }: SearchBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSearchOpen]);

  return (
    <div className="fixed top-[112px] left-0 right-0 z-35 bg-slate-custom border-b border-gray-700/30">
      <div className="px-4 py-2">
        {!isSearchOpen ? (
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium text-sm"
            >
              Search
            </button>
          </div>
        ) : (
          <div ref={searchBarRef} className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search matches, teams, competitions and more"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full bg-slate-700 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                autoFocus
              />
              <button
                onClick={() => {
                  onSearchChange && onSearchChange('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium text-sm whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        )}
        
        {isSearchOpen && searchQuery && (
          <div className="mt-2 bg-slate-700 rounded-lg border border-slate-600 max-h-60 overflow-y-auto">
            <div className="p-3 text-center text-gray-400 text-sm">
              <i className="fas fa-search mr-2"></i>
              Search results will appear here...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}