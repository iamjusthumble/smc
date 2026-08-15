import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateDriverPayload,
  UpdateDriverPayload,
  countTripsForDriver,
  createDriver,
  deleteDriver,
  getDriver,
  listDrivers,
  updateDriver,
} from "./drivers";

export const useDrivers = () =>
  useQuery({
    queryKey: ["drivers"],
    queryFn: listDrivers,
  });

export const useDriver = (id: string | undefined) =>
  useQuery({
    queryKey: ["drivers", id],
    queryFn: () => getDriver(id as string),
    enabled: !!id,
  });

export const useTripCountForDriver = (id: string | undefined) =>
  useQuery({
    queryKey: ["drivers", id, "trip-count"],
    queryFn: () => countTripsForDriver(id as string),
    enabled: !!id,
  });

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDriverPayload) => createDriver(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDriverPayload;
    }) => updateDriver(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });
};
