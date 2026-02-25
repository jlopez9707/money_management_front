"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Login successful",
    data,
  };
}

export async function signup(formData: {
  name: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Signup successful",
    data,
  };
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback?next=/dashboard/profile`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Password reset email sent",
  };
}
