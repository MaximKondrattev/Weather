import type { WeatherData } from "./WatherType";

export interface FavoriteCity {
  cityName: string;
  weatherData: WeatherData | null;
}
