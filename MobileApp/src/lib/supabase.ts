// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// In-memory storage — works in Expo Go without native modules.
// For a production build, swap this with expo-secure-store + chunking.
const memoryStorage: Record<string, string> = {};

const InMemoryStorageAdapter = {
  getItem: (key: string): string | null => {
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    delete memoryStorage[key];
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: InMemoryStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
