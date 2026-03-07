import { useState, useEffect } from 'react';
import { userManagementService } from '../services/api';

export function usePendingDevicesCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await userManagementService.getPendingVerifications();
        setCount(response.data.users?.length || 0);
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    fetchCount();
  }, []);

  return count;
}
