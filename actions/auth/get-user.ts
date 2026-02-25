import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }
    const userId = session.user.id;

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return null;
    }
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
