// src/components/auth/reset-password-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { resetPassword } from "@/server/actions/password-reset";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="rounded-xl border border-rose-200/60 bg-rose-50/70 px-3.5 py-3 text-center text-sm text-rose-600 dark:border-rose-500/15 dark:bg-rose-500/5 dark:text-rose-400">
        Missing reset token.
        <a href="/forgot-password" className="ml-1 underline underline-offset-4">Request a new link</a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await resetPassword({ token, password });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }
    router.push("/login?reset=success");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground/90">New password</label>
        <div className="group relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400/70 transition-colors duration-300 group-focus-within:text-indigo-500" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-indigo-200/60 bg-indigo-50/30 pl-10 pr-10 text-sm shadow-sm shadow-indigo-950/[0.02] outline-none transition-all duration-300 placeholder:text-muted-foreground/45 hover:border-indigo-300/70 focus:border-indigo-400/70 focus:bg-background focus:ring-4 focus:ring-indigo-500/10 dark:border-indigo-400/10 dark:bg-indigo-500/[0.03]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/55">At least 8 characters, one uppercase letter, one number.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50/70 px-3 py-2.5 text-center text-xs text-rose-600 dark:border-rose-500/15 dark:bg-rose-500/5 dark:text-rose-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { y: -1 } : undefined}
        whileTap={!isSubmitting ? { scale: 0.985 } : undefined}
        className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_100%] text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Reset password
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </span>
      </motion.button>
    </form>
  );
}