<template>
  <header class="app-header">
    <div class="logo">
      <img
        src="../assets/logo.png"
        alt=""
      />
    </div>
    <nav class="tabs">
      <button
        @click="$emit('update:tab', 'main')"
        :class="{ active: currentTab === 'main' }"
      >
        Home
      </button>
      <button
        @click="$emit('update:tab', 'favorite')"
        :class="{ active: currentTab === 'favorite' }"
      >
        Favorites
      </button>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { TabType } from "../types/TabType";

export default defineComponent({
  name: "AppHeader",
  props: {
    currentTab: {
      type: String as () => TabType,
      required: true,
    },
  },
  emits: ["update:tab"],
});
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.logo img {
  width: 48px;
  height: 48px;
}

.tabs {
  display: flex;
  gap: 16px;
}

.tabs button {
  position: relative;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tabs button::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007bff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tabs button:hover {
  color: #007bff;
}

.tabs button.active {
  color: #007bff;
}

.tabs button.active::after {
  transform: scaleX(1);
}
</style>
