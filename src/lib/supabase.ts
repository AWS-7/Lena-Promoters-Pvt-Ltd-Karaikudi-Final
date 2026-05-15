import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function getSupabase() {
  if (client) return client;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
  client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: true },
  });
  return client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    const sb = getSupabase();
    const value = (sb as any)[prop];
    return typeof value === "function" ? value.bind(sb) : value;
  },
});
