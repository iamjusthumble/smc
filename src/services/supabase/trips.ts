import { supabase } from ".";
import { Route, Trip, TripAvailability, TripWithRelations } from "./types";

export type CreateTripPayload = Omit<Trip, "id" | "created_at" | "updated_at">;
export type UpdateTripPayload = Partial<
  Omit<Trip, "id" | "company_id" | "created_at" | "updated_at">
>;
export type TripTab = "upcoming" | "completed" | "cancelled";

const TRIP_SELECT =
  "*, route:routes(id,origin,destination,duration_minutes), bus:buses(id,vehicle_number,seat_count), driver:drivers(id,full_name)";

export const listTrips = async (tab: TripTab): Promise<TripWithRelations[]> => {
  let query = supabase.from("trips").select(TRIP_SELECT);

  if (tab === "upcoming") {
    query = query
      .in("status", ["scheduled", "in_progress"])
      .order("departure_time", { ascending: true });
  } else if (tab === "completed") {
    query = query
      .eq("status", "completed")
      .order("departure_time", { ascending: false });
  } else {
    query = query
      .eq("status", "cancelled")
      .order("departure_time", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as TripWithRelations[];
};

export const getTrip = async (id: string): Promise<TripWithRelations> => {
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_SELECT)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as TripWithRelations;
};

export const createTrip = async (payload: CreateTripPayload): Promise<Trip> => {
  const { data, error } = await supabase
    .from("trips")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTrip = async (
  id: string,
  payload: UpdateTripPayload
): Promise<Trip> => {
  const { data, error } = await supabase
    .from("trips")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTrip = async (id: string): Promise<void> => {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
};

// Batched — one query for every trip id on the visible page, not one
// request per row.
export const getTripAvailabilities = async (
  tripIds: string[]
): Promise<TripAvailability[]> => {
  if (tripIds.length === 0) return [];
  const { data, error } = await supabase
    .from("trip_availability")
    .select("*")
    .in("trip_id", tripIds);
  if (error) throw error;
  return data ?? [];
};

// Head count only — guards deleteTrip (a trip with bookings should be
// cancelled, not deleted) without fetching the booking rows themselves.
export const countBookingsForTrip = async (tripId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("trip_id", tripId);
  if (error) throw error;
  return count ?? 0;
};

export interface ScheduleConflicts {
  busConflict: TripWithRelations | null;
  driverConflict: TripWithRelations | null;
}

// Standard interval-overlap check: two windows overlap when each starts
// before the other ends. Trips with no arrival_time set can't be checked
// and are simply skipped — the create/edit form always sets one.
export const findScheduleConflicts = async (
  busId: string | undefined,
  driverId: string | undefined,
  departureTime: string,
  arrivalTime: string,
  excludeTripId?: string
): Promise<ScheduleConflicts> => {
  if (!busId && !driverId) return { busConflict: null, driverConflict: null };

  const orParts: string[] = [];
  if (busId) orParts.push(`bus_id.eq.${busId}`);
  if (driverId) orParts.push(`driver_id.eq.${driverId}`);

  let query = supabase
    .from("trips")
    .select(TRIP_SELECT)
    .or(orParts.join(","))
    .neq("status", "cancelled")
    .lt("departure_time", arrivalTime)
    .gt("arrival_time", departureTime);

  if (excludeTripId) query = query.neq("id", excludeTripId);

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as unknown as TripWithRelations[];
  const busConflict = busId ? rows.find((t) => t.bus_id === busId) ?? null : null;
  const driverConflict = driverId
    ? rows.find((t) => t.driver_id === driverId) ?? null
    : null;

  return { busConflict, driverConflict };
};

// No dedicated routes module exists — routes only exist in this app to
// populate the trip form's route picker, so this one read lives here.
export const listRoutes = async (): Promise<Route[]> => {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .order("origin", { ascending: true });
  if (error) throw error;
  return data ?? [];
};
