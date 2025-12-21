"use client";

import { useState } from "react";
import { School } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Login error:", error);
        alert("Failed to login. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl shadow-sm transition-all transform active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaGoogle className="w-5 h-5" />
        {isLoading ? "Connecting..." : "Continue with Google"}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
        <School className="w-4 h-4" />
        <span>Used by teachers in 120+ Schools</span>
      </div>
    </div>
  );
}
