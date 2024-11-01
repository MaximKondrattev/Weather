import { ref, computed } from "vue";
import type { WeatherBlock } from "../types/WeatherBlock";
import type { WeatherData } from "../types/WatherType";

export function useWeatherBlocks() {
  const weatherBlocks = ref<WeatherBlock[]>([]);
  const blockToDeleteIndex = ref<number | null>(null);

  const addWeatherBlock = (): void => {
    if (weatherBlocks.value.length < 5) {
      weatherBlocks.value.push({
        id: Date.now().toString(),
        cityName: "",
        weatherData: null,
      });
    }
  };

  const updateWeatherData = (index: number, data: WeatherData): void => {
    if (index >= 0 && index < weatherBlocks.value.length) {
      weatherBlocks.value[index].weatherData = data;
      weatherBlocks.value[index].cityName = data.name;
    }
  };

  const deleteBlock = (index: number): void => {
    weatherBlocks.value.splice(index, 1);
  };

  return {
    weatherBlocks,
    blockToDeleteIndex,
    addWeatherBlock,
    updateWeatherData,
    deleteBlock,
  };
}
