// Alternative Sports Data Providers Configuration
export interface AlternativeSportsProvider {
  name: string;
  baseUrl: string;
  keyName: string;
  authMethod: 'header' | 'query';
  description: string;
  features: string[];
}

export const alternativeProviders: AlternativeSportsProvider[] = [
  {
    name: 'SportRadar',
    baseUrl: 'https://api.sportradar.com',
    keyName: 'SPORTRADAR_API_KEY',
    authMethod: 'query',
    description: 'Professional sports data with extensive coverage',
    features: ['Live odds', 'Match schedules', 'Player stats', 'Real-time scores']
  },
  {
    name: 'API-Sports',
    baseUrl: 'https://v3.football.api-sports.io',
    keyName: 'API_SPORTS_KEY',
    authMethod: 'header',
    description: 'Comprehensive football/soccer data',
    features: ['Live odds', 'Fixtures', 'Standings', 'Team stats']
  },
  {
    name: 'Pinnacle Sports API',
    baseUrl: 'https://api.pinnacle.com',
    keyName: 'PINNACLE_API_KEY',
    authMethod: 'header',
    description: 'Professional betting odds and lines',
    features: ['Live betting odds', 'Line movements', 'Multiple sports']
  },
  {
    name: 'BetConstruct API',
    baseUrl: 'https://api.betconstruct.com',
    keyName: 'BETCONSTRUCT_API_KEY',
    authMethod: 'header',
    description: 'White-label betting platform data',
    features: ['Real-time odds', 'Live betting', 'Multiple markets']
  },
  {
    name: 'RapidAPI Sports',
    baseUrl: 'https://api-football-v1.p.rapidapi.com',
    keyName: 'RAPIDAPI_KEY',
    authMethod: 'header',
    description: 'Multiple sports APIs through RapidAPI marketplace',
    features: ['Football', 'Basketball', 'Tennis', 'Live scores']
  }
];

// Helper function to test API connectivity
export async function testProvider(provider: AlternativeSportsProvider, apiKey: string): Promise<boolean> {
  try {
    const testUrl = `${provider.baseUrl}/test`;
    const headers: Record<string, string> = {};
    
    if (provider.authMethod === 'header') {
      headers['X-API-Key'] = apiKey;
      headers['X-RapidAPI-Key'] = apiKey; // For RapidAPI
    }
    
    const url = provider.authMethod === 'query' ? `${testUrl}?api_key=${apiKey}` : testUrl;
    
    const response = await fetch(url, { headers });
    return response.status !== 401 && response.status !== 403;
  } catch (error) {
    return false;
  }
}