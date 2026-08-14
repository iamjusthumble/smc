// Hand-written to match supabase/schema.sql exactly. Update alongside any
// migration — uuid/timestamptz -> string, numeric/int -> number, nullable
// columns (no `not null` in the DDL) are optional here.

export type BusStatus = "active" | "maintenance" | "decommissioned";
export type DriverStatus = "active" | "suspended" | "retired";
export type TripStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type StaffRole = "owner" | "manager" | "staff";

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

// No updated_at column on profiles.
export interface Profile {
  id: string;
  company_id: string;
  full_name?: string;
  role: StaffRole;
  created_at: string;
}

export interface Bus {
  id: string;
  company_id: string;
  vehicle_number: string;
  model?: string;
  make_year?: number;
  color?: string;
  seat_count: number;
  status: BusStatus;
  insurance_doc_path?: string;
  insurance_expiry?: string;
  roadworthy_doc_path?: string;
  roadworthy_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  company_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  // Nullable despite the unique constraint in the DDL.
  license_number?: string;
  license_class?: string;
  license_expiry?: string;
  status: DriverStatus;
  created_at: string;
  updated_at: string;
}

// No updated_at column on routes.
export interface Route {
  id: string;
  company_id: string;
  origin: string;
  destination: string;
  distance_km?: number;
  duration_minutes?: number;
  created_at: string;
}

export interface Trip {
  id: string;
  company_id: string;
  route_id?: string;
  bus_id?: string;
  driver_id?: string;
  departure_time: string;
  arrival_time?: string;
  fare: number;
  status: TripStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  trip_id: string;
  company_id: string;
  booking_reference: string;
  passenger_name: string;
  passenger_phone?: string;
  passenger_email?: string;
  seat_count: number;
  amount: number;
  commission_amount: number;
  payment_status: PaymentStatus;
  payment_reference?: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

// No created_at/updated_at columns on booking_seats.
export interface BookingSeat {
  id: string;
  booking_id: string;
  trip_id: string;
  seat_number: string;
}
