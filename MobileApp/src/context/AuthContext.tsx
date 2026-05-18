// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";
import type { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  properties: any[];
  selectedProperty: any | null;
  setSelectedProperty: (prop: any) => void;
  refreshProperties: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) fetchProfile(session.user.id);
        else {
          setProfile(null);
          setProperties([]);
          setSelectedProperty(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Check if there is an explicit selection saved by LoginScreen
    let selectedRole = null;
    try {
      selectedRole = await AsyncStorage.getItem("@selected_role");
      if (selectedRole) {
        await AsyncStorage.removeItem("@selected_role");
      }
    } catch (e) {
      console.warn("AsyncStorage error reading selected role:", e);
    }

    if (data) {
      // If a role was selected on the screen, update the profile dynamically
      if (selectedRole && data.role !== selectedRole) {
        const { data: updatedData } = await supabase
          .from("profiles")
          .update({ role: selectedRole })
          .eq("id", userId)
          .select()
          .single();
        if (updatedData) {
          data = updatedData;
        }
      } else if (!data.role) {
        // Fallback default
        const { data: updatedData } = await supabase
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", userId)
          .select()
          .single();
        if (updatedData) {
          data = updatedData;
        }
      }
    }

    setProfile(data as Profile);
    await refreshProperties(userId);
    setLoading(false);
  }

  async function refreshProperties(userId?: string) {
    const targetUserId = userId || profile?.id;
    if (!targetUserId) return;

    const { data: pgData } = await supabase
      .from("pg_details")
      .select("*")
      .eq("owner_id", targetUserId);
      
    const pgs = pgData || [];
    setProperties(pgs);
    
    // Only set selected property if it's not set, or if it was deleted
    setOption(pgs);
  }

  function setOption(pgs: any[]) {
    if (pgs.length > 0) {
      if (!selectedProperty || !pgs.find(p => p.id === selectedProperty.id)) {
        setSelectedProperty(pgs[0]);
      } else {
        // refresh the selected property's data
        setSelectedProperty(pgs.find(p => p.id === selectedProperty.id));
      }
    } else {
      setSelectedProperty(null);
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }

  async function signUp(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) return { error: error.message };
    return {};
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
    return {};
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during Supabase signOut:", error);
    } finally {
      // Robust fallback: Always clear state locally to force navigation to login
      setSession(null);
      setProfile(null);
      setProperties([]);
      setSelectedProperty(null);
    }
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, properties, selectedProperty, setSelectedProperty, refreshProperties, signIn, signUp, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
