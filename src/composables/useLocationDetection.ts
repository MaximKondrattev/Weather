import axios from "axios";

export function useLocationDetection() {
  const fetchLocationByIP = async (): Promise<string | null> => {
    try {
      const response = await axios.get("http://ip-api.com/json/");
      return response.data.city || null;
    } catch (error) {
      console.error("Ошибка при определении города по IP:", error);
      return null;
    }
  };

  return {
    fetchLocationByIP,
  };
}
