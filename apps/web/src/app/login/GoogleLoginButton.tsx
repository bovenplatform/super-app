"use client";

import { getSupabaseBrowser } from "@/lib/supabase";
import { Button } from "@superapp/ui";
import { useState } from "react";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseBrowser();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://super-app-web-gray.vercel.app";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google login error:", error.message);
        window.location.href = `/login?error=${encodeURIComponent(error.message)}`;
      }
    } catch (err) {
      console.error("Unexpected error during Google login:", err);
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600 shadow-sm"
    >
      {loading ? "Menghubungkan ke Google..." : "Google Account"}
    </Button>
  );
}
