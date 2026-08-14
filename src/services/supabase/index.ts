import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missing = [
  !url && "VITE_SUPABASE_URL",
  !publishableKey && "VITE_SUPABASE_PUBLISHABLE_KEY",
].filter(Boolean);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(
      ", "
    )}. Set them in .env before starting the app.`
  );
}

export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
