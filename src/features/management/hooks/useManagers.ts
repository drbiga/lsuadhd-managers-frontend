import { useCallback, useEffect, useState } from "react";
import managementService, { Manager } from "../services/managementService";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";

export function useManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const fetchedManagers = await managementService.getManagers();
        setManagers(fetchedManagers);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    })()
  }, []);

  const createManager = useCallback(async (data: FieldValues) => {
    try {
      const newManager = await managementService.setManager(data.name);
      setManagers(prevManagers => [...prevManagers, newManager]);
      toast.success('Manager created successfully')
    } catch (error) {
      console.error('Error creating manager: ', error);
      toast.error('Error creating manager.');
    }
  }, [managers]);

  return { managers, createManager };
}