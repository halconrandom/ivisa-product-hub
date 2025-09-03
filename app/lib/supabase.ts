import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper to get Google provider access token for Drive API calls
export async function getGoogleAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  // provider_token contains the Google OAuth access token when provider is google
  return (data.session?.provider_token as string) ?? null;
}
