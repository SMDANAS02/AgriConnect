import { useQuery } from '@tanstack/react-query';
import { fetchWeatherAdvisory } from '../services/weatherService';

export const useWeather = (district) => {
  return useQuery({
    queryKey: ['weather', district],
    queryFn: () => fetchWeatherAdvisory(district),
    enabled: !!district,
  });
};
