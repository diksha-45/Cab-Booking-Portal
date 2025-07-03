import { supabase } from './supabaseClient';

export async function signUpWithEmail(email: string, password: string, role: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Insert user role into your `users` table
  const userId = data.user?.id;
  if (userId) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        role,
      },
    ]);
    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return data;
}
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}
export async function getUserRole() {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.user_metadata?.role ?? null;
}

