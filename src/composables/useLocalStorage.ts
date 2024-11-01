import type { WeatherBlock } from "../types/WeatherBlock";
import type { FavoriteCity } from "../types/FavoriteCity";

export function useLocalStorage() {
  const saveToLocalStorage = (
    weatherBlocks: WeatherBlock[],
    favoriteCities: FavoriteCity[]
  ): void => {
    localStorage.setItem("weatherBlocks", JSON.stringify(weatherBlocks));
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
  };

  const loadFromLocalStorage = () => {
    const savedBlocks = localStorage.getItem("weatherBlocks");
    const savedFavorites = localStorage.getItem("favoriteCities");

    return {
      savedBlocks: savedBlocks ? JSON.parse(savedBlocks) : null,
      savedFavorites: savedFavorites ? JSON.parse(savedFavorites) : null,
    };
  };

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
  };
}
