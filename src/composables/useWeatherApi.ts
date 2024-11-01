import { ref } from "vue";
import axios from "axios";

import type { WeatherData } from "../types/WatherType";
import type { HourlyTemperature } from "../types/HourlyTemperature";

export function useWeatherApi() {
  const isLoading = ref(false);

  const fetchWeatherData = async (
    cityName: string
  ): Promise<WeatherData | null> => {
    isLoading.value = true;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: cityName,
            units: "metric",
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            lang: "ru",
          },
        }
      );

      const data = response.data;
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        name: data.name,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        main: {
          feels_like: data.main.feels_like,
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          grnd_level: data.main.grnd_level || 0,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          sea_level: data.main.sea_level || 0,
        },
        wind: data.wind,
        weather: data.weather,
      };
    } catch (error) {
      console.error("Error loading weather data:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  const fetchHourlyData = async (
    cityName: string
  ): Promise<HourlyTemperature[]> => {
    isLoading.value = true;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: cityName,
            units: "metric",
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            lang: "ru",
          },
        }
      );

      return response.data.list.slice(0, 8).map((entry: any) => ({
        time: new Date(entry.dt * 1000).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: entry.main.temp,
      }));
    } catch (error) {
      console.error("Error loading hourly data:", error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchWeeklyData = async (
    cityName: string
  ): Promise<HourlyTemperature[]> => {
    isLoading.value = true;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: cityName,
            units: "metric",
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            lang: "ru",
          },
        }
      );

      const dailyData: { [date: string]: { sumTemp: number; count: number } } =
        {};

      response.data.list.forEach((entry: any) => {
        const date = new Date(entry.dt * 1000).toLocaleDateString("ru-RU", {
          weekday: "short",
        });

        if (!dailyData[date]) {
          dailyData[date] = { sumTemp: 0, count: 0 };
        }

        dailyData[date].sumTemp += entry.main.temp;
        dailyData[date].count += 1;
      });

      return Object.keys(dailyData).map((date) => ({
        time: date,
        temp: +(dailyData[date].sumTemp / dailyData[date].count).toFixed(1),
      }));
    } catch (error) {
      console.error("Error loading data for the week:", error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    fetchWeatherData,
    fetchHourlyData,
    fetchWeeklyData,
  };
}
