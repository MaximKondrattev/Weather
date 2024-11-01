<template>
  <div class="autocomplete-container">
    <input
      type="text"
      v-model="query"
      placeholder="Enter city name..."
      @input="onInput"
      class="autocomplete-input"
    />
    <ul
      v-if="suggestions.length"
      class="suggestions-list"
    >
      <li
        v-for="(city, index) in suggestions"
        :key="index"
        @click="selectCity(city)"
        class="suggestion-item"
      >
        {{ city.name }} ({{ city.country }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "CityAutocomplete",
  emits: ["citySelected"],

  setup(_, { emit }) {
    const query = ref("");
    const suggestions = ref<{ name: string; id: number; country?: string }[]>(
      []
    );

    const onInput = async () => {
      if (query.value.length > 2) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/geo/1.0/direct`,
            {
              params: {
                q: query.value,
                limit: 5,
                appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
              },
            }
          );
          suggestions.value = response.data.map((city: any) => ({
            name: city.name,
            id: city.id,
            country: city.country,
          }));
        } catch (error) {
          console.error("Error while requesting cities:", error);
        }
      } else {
        suggestions.value = [];
      }
    };
    const selectCity = (city: {
      name: string;
      id: number;
      country?: string;
    }) => {
      emit("citySelected", city);
      query.value = city.name;
      suggestions.value = [];
    };
    return {
      query,
      suggestions,
      onInput,
      selectCity,
    };
  },
});
</script>

<style scoped>
.autocomplete-container {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.autocomplete-input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ccc;
  border-top: none;
  background-color: white;
  z-index: 10;
  max-height: 150px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
  color: black;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}
</style>
