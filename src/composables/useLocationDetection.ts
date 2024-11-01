import axios from "axios";

export function useLocationDetection() {
  const fetchLocationByIP = async (): Promise<string | null> => {
    try {
      const response = await axios.get("https://ipapi.co/json/");
      return response.data.city || null;
    } catch (error) {
      console.error("Error in determining city by IP:", error);
      return null;
    }
  };

  return {
    fetchLocationByIP,
  };
}
