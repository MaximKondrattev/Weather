import type { WeatherData } from "./WatherType";

export interface WeatherBlock {
  cityName: string;
  id: string;
  weatherData: WeatherData | null;
}
