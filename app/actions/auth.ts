"use server"

import { createClient } from "@/lib/supabase/server"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  // 1. Fetch the profile with a fallback check
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  // 2. Log the actual role found to your terminal for debugging
  console.log(`User ${email} identified with role: ${profile?.role || "NONE"}`)

  // 3. Precise Routing Logic
  let redirectTo = "/tenant" // Default fallback
  
  if (profile?.role === "superadmin") {
    redirectTo = "/superadmin" // Main superadmin dashboard
  } else if (profile?.role === "admin") {
    redirectTo = "/admin" // Main PG Owner dashboard
  }

  return { 
    success: true, 
    redirectTo, 
    role: profile?.role // Return role to client for easier debugging
  }
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { success: true }
}