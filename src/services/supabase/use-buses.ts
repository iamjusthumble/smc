import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateBusPayload,
  UpdateBusPayload,
  countTripsForBus,
  createBus,
  deleteBus,
  getBus,
  listBuses,
  updateBus,
} from "./buses";

export const useBuses = () =>
  useQuery({
    queryKey: ["buses"],
    queryFn: listBuses,
  });

export const useBus = (id: string | undefined) =>
  useQuery({
    queryKey: ["buses", id],
    queryFn: () => getBus(id as string),
    enabled: !!id,
  });

export const useTripCountForBus = (id: string | undefined) =>
  useQuery({
    queryKey: ["buses", id, "trip-count"],
    queryFn: () => countTripsForBus(id as string),
    enabled: !!id,
  });

export const useCreateBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBusPayload) => createBus(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buses"] }),
  });
};

export const useUpdateBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBusPayload }) =>
      updateBus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buses"] }),
  });
};

export const useDeleteBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buses"] }),
  });
};
