// src/components/auth/login-form.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginInput,
} from "@/lib/validations/auth";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Zap,
} from "lucide-react";

import { TransitionLink } from "@/components/ui/transition-link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password");
      return;
    }

    const callbackUrl =
      searchParams.get("callbackUrl") ?? "/dashboard";

    // Start BrandPilot transition
    setIsNavigating(true);

    // Give the transition enough time to play
    window.setTimeout(() => {
      router.push(callbackUrl);
    }, 900);
  }

  function handleGoogleSignIn() {
    setIsNavigating(true);

    window.setTimeout(() => {
      signIn("google", {
        callbackUrl: "/dashboard",
      });
    }, 650);
  }

  return (
    <>
      {/* =====================================================
          PAGE TRANSITION
      ====================================================== */}

      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-hidden"
          >
            {/* Background fade */}
            <motion.div
              initial={{
                clipPath: "circle(0% at 0% 0%)",
              }}
              animate={{
                clipPath: "circle(150% at 0% 0%)",
              }}
              transition={{
                duration: 0.85,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute inset-0 bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-950"
            />

            {/* Ambient glow */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/20 blur-[100px]"
            />

            {/* Top-left subtle light */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
              }}
              className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-white/10 blur-3xl"
            />

            {/* Center logo */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.45,
                y: 18,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                type: "spring",
                stiffness: 180,
                damping: 16,
              }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            >
              {/* Temporary BrandPilot logo */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(139,92,246,0)",
                    "0 0 45px rgba(139,92,246,0.55)",
                    "0 0 20px rgba(139,92,246,0.25)",
                  ],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl"
              >
                <div className="absolute inset-[3px] rounded-[13px] bg-gradient-to-br from-violet-400 via-indigo-500 to-fuchsia-500 opacity-90" />

                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Zap className="h-5 w-5 fill-white text-white" />
                </div>
              </motion.div>

              {/* Brand name */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                  duration: 0.4,
                }}
                className="mt-4 text-center"
              >
                <p className="text-sm font-semibold tracking-tight text-white">
                  BrandPilot
                </p>

                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-violet-200" />

                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Preparing workspace
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          LOGIN FORM
      ====================================================== */}

      <motion.div
        animate={{
          opacity: isNavigating ? 0 : 1,
          y: isNavigating ? -8 : 0,
          scale: isNavigating ? 0.98 : 1,
        }}
        transition={{
          duration: 0.25,
        }}
        className="space-y-4"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3.5"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground/90"
            >
              Email address
            </label>

            <div className="group relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/70 transition-colors group-focus-within:text-violet-500" />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={isNavigating}
                className="h-11 w-full rounded-xl border border-violet-200/60 bg-violet-50/30 pl-10 pr-3 text-sm shadow-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/45 hover:border-violet-300/70 focus:border-violet-400/70 focus:bg-background focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-400/10 dark:bg-violet-500/[0.03]"
              />
            </div>

            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1 text-xs text-rose-500"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground/90"
              >
                Password
              </label>

              <TransitionLink
                href="/forgot-password"
                className="text-xs font-medium text-violet-500/80 transition hover:text-violet-600"
              >
                Forgot password?
              </TransitionLink>
            </div>

            <div className="group relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400/70 transition-colors group-focus-within:text-indigo-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                disabled={isNavigating}
                className="h-11 w-full rounded-xl border border-indigo-200/60 bg-indigo-50/30 pl-10 pr-10 text-sm shadow-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/45 hover:border-indigo-300/70 focus:border-indigo-400/70 focus:bg-background focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-400/10 dark:bg-indigo-500/[0.03]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isNavigating}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 transition hover:bg-indigo-500/10 hover:text-indigo-500 disabled:pointer-events-none"
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  {showPassword ? (
                    <motion.span
                      key="hidden"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      className="block"
                    >
                      <EyeOff className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="visible"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      className="block"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1 text-xs text-rose-500"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Server Error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50/70 px-3 py-2.5 text-xs text-rose-600"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting || isNavigating}
            whileHover={
              !(isSubmitting || isNavigating)
                ? { y: -1 }
                : undefined
            }
            whileTap={
              !(isSubmitting || isNavigating)
                ? { scale: 0.985 }
                : undefined
            }
            className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting || isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {isNavigating
                    ? "Opening workspace..."
                    : "Signing in..."}
                </>
              ) : (
                <>
                  Sign in

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />

          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
            or
          </span>

          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Google */}
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isNavigating}
          whileHover={!isNavigating ? { y: -1 } : undefined}
          whileTap={!isNavigating ? { scale: 0.99 } : undefined}
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/70 text-sm font-medium shadow-sm transition-all hover:border-violet-300/50 hover:bg-violet-50/50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Chrome className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-6" />

          Continue with Google
        </motion.button>

        {/* Demo Credentials */}
        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
          className="relative overflow-hidden rounded-xl border border-violet-200/50 bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/60 px-3.5 py-3 text-center"
        >
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-violet-400/10 blur-xl" />

          <div className="relative flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-violet-500/70" />

            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-violet-500/70">
              Demo account
            </span>
          </div>

          <p className="relative mt-1.5 text-xs">
            <span className="font-medium text-violet-600">
              demo@brandpilot.com
            </span>

            <span className="mx-1.5 text-muted-foreground/40">
              /
            </span>

            <span className="font-medium text-indigo-600">
              password
            </span>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}