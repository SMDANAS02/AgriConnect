import { useQuery } from '@tanstack/react-query';
import { fetchEquipmentList } from '../services/equipmentService';

export const useEquipment = (filters) => {
  return useQuery({
    queryKey: ['equipment', filters],
    queryFn: () => fetchEquipmentList(filters),
  });
};
