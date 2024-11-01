<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, type PropType } from "vue";
import type { HourlyTemperature } from "../types/HourlyTemperature";
import Chart from "chart.js/auto";

export default defineComponent({
  name: "WeatherChart",
  props: {
    hourlyData: {
      type: Array as PropType<HourlyTemperature[]>,
      required: true,
    },
    weeklyData: {
      type: Array as PropType<HourlyTemperature[]>,
      required: false,
    },
  },
  setup(props) {
    const chartInstance = ref<Chart | null>(null);
    const chartCanvas = ref<HTMLCanvasElement | null>(null);

    const createChart = () => {
      if (chartCanvas.value) {
        chartInstance.value = new Chart(chartCanvas.value, {
          type: "line",
          data: {
            labels: props.hourlyData.map((data) => data.time),
            datasets: [
              {
                label: "Температура (°C)",
                data: props.hourlyData.map((data) => data.temp),
                fill: false,
                borderColor: "#ff5722",
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Время",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Температура (°C)",
                },
                beginAtZero: false,
              },
            },
          },
        });
      }
    };
    watch(
      () => props.hourlyData,
      () => props.weeklyData
    );

    onMounted(createChart);
    return {
      chartCanvas,
    };
  },
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: 20px;
}
</style>
