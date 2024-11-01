<template>
  <AppHeader
    :current-tab="currentTab"
    @update:tab="setTab"
  />

  <div class="app-container">
    <div class="weather-blocks">
      <button
        v-if="currentTab === 'main'"
        @click="addWeatherBlock"
        :disabled="weatherBlocks.length >= 5"
        class="add-block-btn"
      >
        +
      </button>

      <div
        v-for="(block, index) in displayedBlocks"
        :key="block.id"
        class="weather-display"
      >
        <WeatherCard
          :weatherData="block.weatherData ?? undefined"
          :isFavorite="isCityFavorite(block.cityName)"
          :isFirstCard="index === 0 && weatherBlocks.length === 1"
          @toggleFavorite="handleFavoriteToggle(block)"
          @updateWeatherData="updateWeatherData(index, $event)"
        />
        <div class="action-buttons">
          <button
            v-if="currentTab === 'main'"
            @click="confirmDeleteBlock(index)"
            class="delete-btn"
          >
            Удалить
          </button>
          <button
            v-else
            @click="removeFromFavorites(block.cityName)"
            class="remove-favorite-btn"
          >
            Убрать из избранного
          </button>
        </div>
      </div>
    </div>

    <DeleteConfirmModal
      :show="showModal"
      @confirm="deleteBlock"
      @close="showModal = false"
    />

    <div
      v-if="showFavoritesModal"
      class="modal"
    >
      <p>Достигнут максимальный лимит избранных городов (5)</p>
      <button @click="showFavoritesModal = false">OK</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import type { WeatherBlock } from "./types/WeatherBlock";
import type { TabType } from "./types/TabType";
import type { WeatherData } from "./types/WatherType";
import { useWeatherBlocks } from "@/composables/useWeatherBlocks";
import { useFavorites } from "@/composables/useFavorites";
import { useLocalStorage } from "@/composables/useLocalStorage";
import WeatherCard from "./components/WatherCard.vue";
import AppHeader from "./components/AppHeader.vue";
import DeleteConfirmModal from "./components/DeleteConfirmModal.vue";

export default defineComponent({
  name: "App",

  components: {
    WeatherCard,
    AppHeader,
    DeleteConfirmModal,
  },

  setup() {
    const currentTab = ref<TabType>("main");
    const showModal = ref(false);

    const {
      weatherBlocks,
      blockToDeleteIndex,
      addWeatherBlock,
      updateWeatherData,
      deleteBlock: removeBlock,
    } = useWeatherBlocks();

    const {
      favoriteCities,
      showFavoritesModal,
      isCityFavorite,
      addToFavorites,
      removeFromFavorites,
    } = useFavorites();

    const { saveToLocalStorage, loadFromLocalStorage } = useLocalStorage();

    const displayedBlocks = computed(() => {
      return currentTab.value === "favorite"
        ? weatherBlocks.value.filter(
            (block) =>
              isCityFavorite(block.cityName) && block.weatherData !== null
          )
        : weatherBlocks.value;
    });

    const setTab = (tab: TabType): void => {
      currentTab.value = tab;
    };

    const handleFavoriteToggle = (block: WeatherBlock): void => {
      if (!block.cityName || !block.weatherData) return;

      if (isCityFavorite(block.cityName)) {
        removeFromFavorites(block.cityName);
      } else {
        addToFavorites(block);
      }
    };

    const confirmDeleteBlock = (index: number): void => {
      blockToDeleteIndex.value = index;
      showModal.value = true;
    };

    const deleteBlock = (): void => {
      if (blockToDeleteIndex.value !== null) {
        const block = weatherBlocks.value[blockToDeleteIndex.value];

        if (block && isCityFavorite(block.cityName)) {
          removeFromFavorites(block.cityName);
        }

        removeBlock(blockToDeleteIndex.value);
        showModal.value = false;
        blockToDeleteIndex.value = null;
      }
    };

    watch(
      [weatherBlocks, favoriteCities],
      () => {
        saveToLocalStorage(weatherBlocks.value, favoriteCities.value);
      },
      { deep: true }
    );

    onMounted(() => {
      const { savedBlocks, savedFavorites } = loadFromLocalStorage();

      if (savedBlocks) {
        weatherBlocks.value = savedBlocks;
      } else {
        addWeatherBlock();
      }

      if (savedFavorites) {
        favoriteCities.value = savedFavorites;
      }
    });

    return {
      currentTab,
      weatherBlocks,
      showModal,
      showFavoritesModal,
      displayedBlocks,
      setTab,
      isCityFavorite,
      addWeatherBlock,
      handleFavoriteToggle,
      removeFromFavorites,
      updateWeatherData,
      confirmDeleteBlock,
      deleteBlock,
    };
  },
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.weather-blocks {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.weather-display {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.weather-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Модальное окно и оверлей */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  text-align: center;
  min-width: 320px;
  z-index: 1001;
  animation: modalAppear 0.3s ease;
}

.modal::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  animation: overlayAppear 0.3s ease;
}

.modal p {
  margin: 0 0 20px;
  font-size: 1.1rem;
  color: #343a40;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Кнопки */
.add-block-btn {
  position: relative;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 24px;
  background-color: #28a745;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.add-block-btn::before {
  content: "+";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.add-block-btn:hover {
  background-color: #218838;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  transform: translateY(-2px);
}

.add-block-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.delete-btn,
.remove-favorite-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
  margin-top: 8px;
}

.delete-btn:hover,
.remove-favorite-btn:hover {
  background-color: #c82333;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  transform: translateY(-1px);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes overlayAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .app-header {
    padding: 12px 16px;
  }

  .weather-blocks {
    grid-template-columns: 1fr;
  }

  .modal {
    width: 90%;
    max-width: 320px;
    padding: 20px;
  }
}
@media screen and (max-width: 1200px) {
  .app-container {
    padding: 20px;
  }
}

@media screen and (max-width: 768px) {
  .app-header {
    padding: 12px 16px;
  }

  .tabs button {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .weather-blocks {
    padding: 0 8px;
  }

  .weather-display {
    padding: 12px;
  }

  .modal {
    padding: 20px;
  }
  .card-header {
    flex-direction: column;
  }
}

@media screen and (max-width: 480px) {
  .app-header {
    padding: 8px 12px;
  }

  h1 {
    font-size: 1.25rem;
  }

  .tabs {
    gap: 8px;
  }

  .tabs button {
    padding: 4px 8px;
    font-size: 0.85rem;
  }

  .app-container {
    padding: 16px 8px;
  }

  .weather-blocks {
    padding: 0 4px;
    gap: 16px;
  }

  .modal {
    width: 95%;
    padding: 16px;
  }

  .modal-buttons {
    gap: 8px;
  }

  .modal button {
    padding: 6px 16px;
  }
}

/* Добавляем стили для очень маленьких экранов */
@media screen and (max-width: 360px) {
  .app-container {
    min-width: 360px;
    overflow-x: auto;
  }

  .weather-blocks {
    padding: 0;
  }
}
</style>
