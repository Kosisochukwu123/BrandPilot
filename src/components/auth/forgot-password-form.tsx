// src/components/auth/forgot-password-form.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "@/server/actions/password-reset";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await requestPasswordReset({ email });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 rounded-xl border border-violet-200/60 bg-violet-50/40 px-3.5 py-3 text-sm dark:border-violet-400/10 dark:bg-violet-500/[0.05]"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-500" />
        If an account exists for that email, a reset link has been sent. Check your inbox.
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground/90">Email address</label>
        <div className="group relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/70 transition-colors duration-300 group-focus-within:text-violet-500" />
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-violet-200/60 bg-violet-50/30 pl-10 pr-3 text-sm shadow-sm shadow-violet-950/[0.02] outline-none transition-all duration-300 placeholder:text-muted-foreground/45 hover:border-violet-300/70 focus:border-violet-400/70 focus:bg-background focus:ring-4 focus:ring-violet-500/10 dark:border-violet-400/10 dark:bg-violet-500/[0.03]"
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
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
              Sending...
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </span>
      </motion.button>
    </form>
  );
}