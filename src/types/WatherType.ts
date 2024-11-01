export interface WeatherMain {
  feels_like: number;
  temp: number;
  temp_max: number;
  temp_min: number;
  grnd_level: number;
  humidity: number;
  pressure: number;
  sea_level: number;
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  name: string;
  humidity: number;
  windSpeed: number;
  main: WeatherMain;
  wind: {
    speed: number;
    [key: string]: any;
  };
  weather: Array<{
    description: string;
    icon: string;
    [key: string]: any;
  }>;
}

export interface DisplayWeatherData extends WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}
