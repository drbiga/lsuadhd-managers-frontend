import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import trackingService, { Stats } from "../services/trackingService";

export function useTrackingStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await trackingService.getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch tracking stats");
      }
    };

    fetchStats();
  }, []);

  return { stats };
}