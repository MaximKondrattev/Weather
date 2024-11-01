<template>
  <div :class="['weather-card', { favorite: isFavorite }]">
    <div class="card-header">
      <CityAutocomplete @citySelected="onCitySelected" />
      <button
        class="favorite-button"
        @click="toggleFavorite"
      >
        {{ isFavorite ? "Удалить из избранного" : "Добавить в избранное" }}
      </button>
    </div>

    <WeatherTabs v-model="selectedTab" />

    <div
      v-if="isLoading"
      class="loader"
    >
      Загрузка...
    </div>

    <template v-if="displayWeatherData">
      <div class="weather-info">
        <div class="city-info">
          <h2>{{ displayWeatherData.name }}</h2>
        </div>

        <div class="weather-main">
          <div class="weather-primary">
            <img
              :src="`https://openweathermap.org/img/wn/${displayWeatherData.icon}@2x.png`"
              :alt="displayWeatherData.description"
              class="weather-icon"
            />
            <div class="weather-details-primary">
              <div class="temperature">
                {{ displayWeatherData.temperature }}°C
              </div>
              <div class="description">
                {{ displayWeatherData.description }}
              </div>
            </div>
          </div>

          <WeatherDetails :weather="displayWeatherData" />
        </div>
      </div>

      <WeatherChart
        v-if="selectedTab === 'day' && hourlyData.length"
        :hourlyData="hourlyData"
      />
      <WeatherChart
        v-else-if="selectedTab === 'week' && weeklyData.length"
        :hourlyData="weeklyData"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, type PropType } from "vue";
import type { WeatherData } from "../types/WatherType";
import type { HourlyTemperature } from "../types/HourlyTemperature";
import { useWeatherApi } from "@/composables/useWeatherApi";
import { useLocationDetection } from "@/composables/useLocationDetection";
import CityAutocomplete from "./CityAutocomplete.vue";
import WeatherChart from "./WatherChart.vue";
import WeatherTabs from "./WeatherTabs.vue";
import WeatherDetails from "./WeatherDetails.vue";

export default defineComponent({
  name: "WeatherCard",

  components: {
    CityAutocomplete,
    WeatherChart,
    WeatherTabs,
    WeatherDetails,
  },

  props: {
    weatherData: {
      type: Object as PropType<WeatherData>,
      required: false,
      default: null,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isFirstCard: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["toggleFavorite", "updateWeatherData"],

  setup(props, { emit }) {
    const localWeatherData = ref<WeatherData | null>(props.weatherData || null);
    const hourlyData = ref<HourlyTemperature[]>([]);
    const weeklyData = ref<HourlyTemperature[]>([]);
    const selectedTab = ref<"day" | "week">("day");

    const { isLoading, fetchWeatherData, fetchHourlyData, fetchWeeklyData } =
      useWeatherApi();
    const { fetchLocationByIP } = useLocationDetection();

    const displayWeatherData = computed(() => {
      if (!localWeatherData.value) return null;

      if (selectedTab.value === "day" && hourlyData.value.length) {
        return {
          ...localWeatherData.value,
          temperature: hourlyData.value[0].temp,
        };
      }

      if (selectedTab.value === "week" && weeklyData.value.length) {
        const averageTemp =
          weeklyData.value.reduce((acc, curr) => acc + curr.temp, 0) /
          weeklyData.value.length;
        return {
          ...localWeatherData.value,
          temperature: +averageTemp.toFixed(1),
        };
      }

      return localWeatherData.value;
    });

    const updateAllWeatherData = async (cityName: string) => {
      const weatherData = await fetchWeatherData(cityName);
      if (weatherData) {
        localWeatherData.value = weatherData;
        emit("updateWeatherData", weatherData);

        const [hourly, weekly] = await Promise.all([
          fetchHourlyData(cityName),
          fetchWeeklyData(cityName),
        ]);

        hourlyData.value = hourly;
        weeklyData.value = weekly;
      }
    };

    const onCitySelected = (city: { name: string }) => {
      updateAllWeatherData(city.name);
    };

    const toggleFavorite = () => {
      if (localWeatherData.value) {
        emit("toggleFavorite", localWeatherData.value.name);
      }
    };

    onMounted(async () => {
      if (props.weatherData) {
        await updateAllWeatherData(props.weatherData.name);
      } else if (props.isFirstCard) {
        const cityName = await fetchLocationByIP();
        if (cityName) {
          await updateAllWeatherData(cityName);
        }
      }
    });

    return {
      displayWeatherData,
      hourlyData,
      weeklyData,
      selectedTab,
      isLoading,
      toggleFavorite,
      onCitySelected,
    };
  },
});
</script>

<style scoped>
.weather-card {
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  background-color: #f9f9f9;
  position: relative;
}
.weather-card.favorite {
  border-color: #ffc107;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.favorite-button {
  padding: 5px 10px;
  color: #007bff;
  background-color: transparent;
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
}

.favorite-button:hover {
  background-color: #e0e0ff;
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 15px 0;
}

.weather-icon {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
.weather {
  display: flex;
  align-items: center;
}

.temperature {
  font-size: 2rem;
  color: #ff5722;
}

.description {
  text-transform: capitalize;
  color: #555;
}

.weather-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .favorite-button {
    margin-top: 10px;
  }
}
</style>
