import { ref } from "vue";
import type { FavoriteCity } from "../types/FavoriteCity";
import type { WeatherBlock } from "@/types/WeatherBlock";

export function useFavorites() {
  const favoriteCities = ref<FavoriteCity[]>([]);
  const showFavoritesModal = ref(false);

  const isCityFavorite = (cityName: string): boolean => {
    return favoriteCities.value.some((city) => city.cityName === cityName);
  };

  const addToFavorites = (block: WeatherBlock): void => {
    if (favoriteCities.value.length >= 5) {
      showFavoritesModal.value = true;
      return;
    }

    if (block.weatherData) {
      favoriteCities.value.push({
        cityName: block.cityName,
        weatherData: block.weatherData,
      });
    }
  };

  const removeFromFavorites = (cityName: string): void => {
    const index = favoriteCities.value.findIndex(
      (city) => city.cityName === cityName
    );
    if (index !== -1) {
      favoriteCities.value.splice(index, 1);
    }
  };
  return {
    favoriteCities,
    showFavoritesModal,
    isCityFavorite,
    addToFavorites,
    removeFromFavorites,
  };
}
