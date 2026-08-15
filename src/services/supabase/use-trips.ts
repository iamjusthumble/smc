import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateTripPayload,
  TripTab,
  UpdateTripPayload,
  countBookingsForTrip,
  createTrip,
  deleteTrip,
  getTrip,
  getTripAvailabilities,
  listRoutes,
  listTrips,
  updateTrip,
} from "./trips";

export const useTrips = (tab: TripTab) =>
  useQuery({
    queryKey: ["trips", tab],
    queryFn: () => listTrips(tab),
  });

export const useTrip = (id: string | undefined) =>
  useQuery({
    queryKey: ["trips", id],
    queryFn: () => getTrip(id as string),
    enabled: !!id,
  });

export const useTripAvailabilities = (tripIds: string[]) =>
  useQuery({
    queryKey: ["trip-availability", ...tripIds],
    queryFn: () => getTripAvailabilities(tripIds),
    enabled: tripIds.length > 0,
  });

export const useBookingCountForTrip = (id: string | undefined) =>
  useQuery({
    queryKey: ["trips", id, "booking-count"],
    queryFn: () => countBookingsForTrip(id as string),
    enabled: !!id,
  });

export const useRoutes = () =>
  useQuery({
    queryKey: ["routes"],
    queryFn: listRoutes,
  });

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTripPayload) => createTrip(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTripPayload }) =>
      updateTrip(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id] });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trips", id] });
    },
  });
};
