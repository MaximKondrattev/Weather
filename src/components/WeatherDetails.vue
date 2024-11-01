<template>
  <div class="weather-details-grid">
    <div class="detail-item">
      <div class="detail-icon">🌡️</div>
      <div class="detail-info">
        <div class="detail-label">Ощущается как</div>
        <div class="detail-value">{{ weather.main?.feels_like }}°C</div>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-icon">💨</div>
      <div class="detail-info">
        <div class="detail-label">Ветер</div>
        <div class="detail-value">{{ weather.wind?.speed }} м/с</div>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-icon">💧</div>
      <div class="detail-info">
        <div class="detail-label">Влажность</div>
        <div class="detail-value">{{ weather.humidity }}%</div>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-icon">🌡️</div>
      <div class="detail-info">
        <div class="detail-label">Температура</div>
        <div class="detail-value">
          {{ weather.main?.temp_min }}° / {{ weather.main?.temp_max }}°
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { WeatherData } from "../types/WatherType";

export default defineComponent({
  name: "WeatherDetails",
  props: {
    weather: {
      type: Object as PropType<WeatherData>,
      required: true,
    },
  },
});
</script>

<style scoped>
.details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
}
.weather-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.weather-details-primary {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.weather-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-icon {
  font-size: 1.5rem;
}

.detail-info {
  flex: 1;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}
</style>
