

interface SearchBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function SearchBar({ searchQuery = '', onSearchChange }: SearchBarProps) {
  return (
    <div className="fixed top-[112px] left-0 right-0 z-35 bg-slate-custom border-b border-gray-700/30">
      <div className="px-4 py-2">
        <div className="flex items-center justify-end">
          <button className="bg-primary hover:bg-primary/90 text-white font-medium text-sm px-3 py-1.5 rounded-md transition-colors duration-200">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}