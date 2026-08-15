import { supabase } from ".";
import { Bus } from "./types";

export type CreateBusPayload = Omit<Bus, "id" | "created_at" | "updated_at">;
export type UpdateBusPayload = Partial<
  Omit<Bus, "id" | "company_id" | "created_at" | "updated_at">
>;
export type BusDocumentKind = "insurance" | "roadworthy";

export const listBuses = async (): Promise<Bus[]> => {
  const { data, error } = await supabase
    .from("buses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const getBus = async (id: string): Promise<Bus> => {
  const { data, error } = await supabase
    .from("buses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createBus = async (payload: CreateBusPayload): Promise<Bus> => {
  const { data, error } = await supabase
    .from("buses")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateBus = async (
  id: string,
  payload: UpdateBusPayload
): Promise<Bus> => {
  const { data, error } = await supabase
    .from("buses")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Storage cleanup lives here (not in the caller) so it holds for every
// caller of deleteBus, not just the one page that happens to wire it up.
export const deleteBus = async (id: string): Promise<void> => {
  const { data: bus, error: fetchError } = await supabase
    .from("buses")
    .select("insurance_doc_path, roadworthy_doc_path")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  const paths = [bus?.insurance_doc_path, bus?.roadworthy_doc_path].filter(
    (path): path is string => !!path
  );
  if (paths.length > 0) {
    const { error: removeError } = await supabase.storage
      .from("vehicle-documents")
      .remove(paths);
    if (removeError) throw removeError;
  }

  const { error } = await supabase.from("buses").delete().eq("id", id);
  if (error) throw error;
};

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export const uploadBusDocument = async (
  companyId: string,
  busId: string,
  kind: BusDocumentKind,
  file: File
): Promise<string> => {
  const extension =
    EXTENSION_BY_MIME[file.type] ?? file.name.split(".").pop() ?? "bin";
  const path = `${companyId}/${busId}/${kind}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("vehicle-documents")
    .upload(path, file);
  if (error) throw error;

  return path;
};

// Bucket is private — signed, short-lived URL, fetched fresh at click time
// rather than cached, since a URL grabbed at modal-open time could easily
// be stale (expired) by the time the user actually clicks it.
export const getDocumentUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from("vehicle-documents")
    .createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
};

// Head count only — used to guard deleteBus (a bus with trip history should
// be decommissioned, not deleted) without fetching the trip rows themselves.
export const countTripsForBus = async (busId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("trips")
    .select("*", { count: "exact", head: true })
    .eq("bus_id", busId);
  if (error) throw error;
  return count ?? 0;
};
