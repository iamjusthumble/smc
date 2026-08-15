import { TripAvailability, TripWithRelations } from "../../../services/supabase/types";

export type { TripWithRelations };

export type TripAvailabilityMap = Record<string, TripAvailability | undefined>;
