import { useState, useEffect } from 'react';

interface AdBanner {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  buttonColor: string;
}

const advertisementBanners: AdBanner[] = [
  {
    id: '1',
    title: 'Welcome Bonus',
    description: 'Get up to 100,000 SSP welcome bonus on your first deposit',
    backgroundColor: 'bg-gradient-to-r from-blue-600 to-blue-800',
    textColor: 'text-white',
    buttonText: 'Claim Now',
    buttonColor: 'bg-yellow-500 hover:bg-yellow-600 text-black'
  },
  {
    id: '2',
    title: 'Aviator Challenge',
    description: 'Play Aviator and win big! Cash out before the plane flies away',
    backgroundColor: 'bg-gradient-to-r from-red-600 to-red-800',
    textColor: 'text-white',
    buttonText: 'Play Now',
    buttonColor: 'bg-white hover:bg-gray-100 text-red-600'
  },
  {
    id: '3',
    title: 'Virtual Sports',
    description: 'Non-stop action with Virtual Football, Basketball & Tennis',
    backgroundColor: 'bg-gradient-to-r from-green-600 to-green-800',
    textColor: 'text-white',
    buttonText: 'Explore',
    buttonColor: 'bg-white hover:bg-gray-100 text-green-600'
  },
  {
    id: '4',
    title: 'Live Betting',
    description: 'Experience the thrill of live in-play betting on all sports',
    backgroundColor: 'bg-gradient-to-r from-purple-600 to-purple-800',
    textColor: 'text-white',
    buttonText: 'Bet Live',
    buttonColor: 'bg-white hover:bg-gray-100 text-purple-600'
  }
];

export function AdvertisementBanner() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        (prevIndex + 1) % advertisementBanners.length
      );
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAd = advertisementBanners[currentAdIndex];

  return (
    <div className="w-full py-4">
      <div className={`w-full h-48 ${currentAd.backgroundColor} rounded-lg flex items-center justify-between px-8 shadow-lg`}>
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${currentAd.textColor} mb-3`}>
            {currentAd.title}
          </h3>
          <p className={`text-lg ${currentAd.textColor} opacity-90`}>
            {currentAd.description}
          </p>
        </div>
        <div className="flex-shrink-0 ml-6">
          <button className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${currentAd.buttonColor}`}>
            {currentAd.buttonText}
          </button>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-4 space-x-3">
        {advertisementBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentAdIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}