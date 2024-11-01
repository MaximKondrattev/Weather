<template>
  <div class="tabs">
    <button
      :class="{ active: modelValue === 'day' }"
      @click="$emit('update:modelValue', 'day')"
    >
      День
    </button>
    <button
      :class="{ active: modelValue === 'week' }"
      @click="$emit('update:modelValue', 'week')"
    >
      Неделя
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WeatherTabs",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
});
</script>

<style scoped>
.tabs {
  display: flex;
  margin-bottom: 10px;
}

.tabs button {
  flex: 1;
  padding: 8px 0;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}
</style>
