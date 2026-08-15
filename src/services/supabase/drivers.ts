import { supabase } from ".";
import { Driver } from "./types";

export type CreateDriverPayload = Omit<
  Driver,
  "id" | "created_at" | "updated_at"
>;
export type UpdateDriverPayload = Partial<
  Omit<Driver, "id" | "company_id" | "created_at" | "updated_at">
>;

export const listDrivers = async (): Promise<Driver[]> => {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const getDriver = async (id: string): Promise<Driver> => {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createDriver = async (
  payload: CreateDriverPayload
): Promise<Driver> => {
  const { data, error } = await supabase
    .from("drivers")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateDriver = async (
  id: string,
  payload: UpdateDriverPayload
): Promise<Driver> => {
  const { data, error } = await supabase
    .from("drivers")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteDriver = async (id: string): Promise<void> => {
  const { error } = await supabase.from("drivers").delete().eq("id", id);
  if (error) throw error;
};

// Head count only — used to guard deleteDriver (a driver with trip history
// should be retired, not deleted) without fetching the trip rows themselves.
export const countTripsForDriver = async (driverId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("trips")
    .select("*", { count: "exact", head: true })
    .eq("driver_id", driverId);
  if (error) throw error;
  return count ?? 0;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRING_SOON_DAYS = 30;

export type LicenseExpiryStatus = "expired" | "expiring" | null;

// Pure date check, not a DB call — colocated here since it's driver-domain
// logic used by both the list and view screens.
export const getLicenseExpiryStatus = (
  expiry: string | undefined
): LicenseExpiryStatus => {
  if (!expiry) return null;
  const expiryDate = new Date(expiry);
  if (Number.isNaN(expiryDate.getTime())) return null;

  const daysUntilExpiry = (expiryDate.getTime() - Date.now()) / DAY_MS;
  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= EXPIRING_SOON_DAYS) return "expiring";
  return null;
};
