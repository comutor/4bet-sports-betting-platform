import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface Country {
  id: string;
  name: string;
  flag: string;
  leagues: string[];
}

interface CountriesSectionProps {
  selectedCategory?: string;
  onBetClick: (eventName: string, selection: string, odds: string) => void;
}

export function CountriesSection({ selectedCategory = 'top-countries', onBetClick }: CountriesSectionProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Fetch top countries from API
  const { data: topCountriesData } = useQuery({
    queryKey: ['/api/countries/top'],
    enabled: selectedCategory === 'top-countries'
  });

  const topCountries: Country[] = Array.isArray(topCountriesData) ? topCountriesData : [];

  // Fetch international competitions from API
  const { data: internationalData } = useQuery({
    queryKey: ['/api/international/competitions'],
    enabled: selectedCategory === 'international'
  });

  const internationalCompetitions: Country[] = internationalData && Array.isArray(internationalData) ? [
    { 
      id: 'international', 
      name: 'All International Leagues', 
      flag: '🌍', 
      leagues: internationalData.map((comp: any) => comp.name)
    }
  ] : [];

  // Fetch other countries from API
  const { data: otherCountriesData } = useQuery({
    queryKey: ['/api/countries/other'],
    enabled: selectedCategory === 'other-countries'
  });

  const otherCountries: Country[] = Array.isArray(otherCountriesData) ? otherCountriesData : [];

  const getCountriesByCategory = () => {
    switch (selectedCategory) {
      case 'international':
        return internationalCompetitions;
      case 'other-countries':
        return otherCountries;
      default:
        return topCountries;
    }
  };

  const countries = getCountriesByCategory();

  return (
    <div className="space-y-6">
      {/* Country/Competition List */}
      <div className="grid grid-cols-1 gap-3">
        {countries.map((country) => (
          <div key={country.id} className="bg-slate-800 rounded-lg border border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-between text-left p-4 h-auto"
              onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <div className="font-semibold text-white">{country.name}</div>
                  <div className="text-sm text-gray-400">{country.leagues.length} competitions</div>
                </div>
              </div>
              <i className={`fas fa-chevron-${selectedCountry === country.id ? 'up' : 'down'} text-gray-400`}></i>
            </Button>
            
            {/* Expanded Leagues */}
            {selectedCountry === country.id && (
              <div className="border-t border-gray-700 p-4 space-y-2">
                {country.leagues.map((league, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
                  >
                    <i className="fas fa-trophy mr-3 text-blue-500"></i>
                    {league}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}