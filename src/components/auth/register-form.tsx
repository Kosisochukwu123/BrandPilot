
// src/components/auth/register-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth";

import { registerUser } from "@/server/actions/register";
import { signIn } from "next-auth/react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);

    const result = await registerUser(values);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    // Start the transition into the app — /dashboard itself will
    // redirect to /dashboard/brand if this user has no Brand yet.
    setIsNavigating(true);

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 950);
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
          BRANDPILOT TRANSITION
      ====================================================== */}

      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-hidden"
          >
            {/* Main transition expanding from top left */}
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
              className="absolute inset-0 bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-950"
            />

            {/* Background ambient light */}
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
                delay: 0.1,
              }}
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/20 blur-[110px]"
            />

            {/* Top corner light */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.4,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
              }}
              className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl"
            />

            {/* Center BrandPilot mark */}
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
                delay: 0.32,
                type: "spring",
                stiffness: 180,
                damping: 16,
              }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            >
              {/* Temporary logo */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(217,70,239,0)",
                    "0 0 50px rgba(217,70,239,0.5)",
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
                <div className="absolute inset-[3px] rounded-[13px] bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-500" />

                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
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
                  <Sparkles className="h-3 w-3 text-fuchsia-200" />

                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Setting up your workspace
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          REGISTER FORM
      ====================================================== */}

      <motion.div
        animate={{
          opacity: isNavigating ? 0 : 1,
          y: isNavigating ? -8 : 0,
          scale: isNavigating ? 0.985 : 1,
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
          {/* =================================================
              NAME
          ================================================= */}

          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-[13px] font-medium text-foreground/90"
            >
              Full name
            </label>

            <div className="group relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-violet-500" />

              <input
                id="name"
                type="text"
                placeholder="John Doe"
                disabled={isNavigating}
                {...register("name")}
                className="h-11 w-full rounded-xl border border-border/60 bg-background px-3 pl-10 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/40 hover:border-violet-300/60 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1 text-xs text-rose-500"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-medium text-foreground/90"
            >
              Email address
            </label>

            <div className="group relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-violet-500" />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isNavigating}
                {...register("email")}
                className="h-11 w-full rounded-xl border border-border/60 bg-background px-3 pl-10 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/40 hover:border-violet-300/60 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-medium text-foreground/90"
            >
              Password
            </label>

            <div className="group relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-violet-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                disabled={isNavigating}
                {...register("password")}
                className="h-11 w-full rounded-xl border border-border/60 bg-background px-3 pl-10 pr-11 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/40 hover:border-violet-300/60 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                disabled={isNavigating}
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground/50 transition hover:bg-violet-500/10 hover:text-violet-600 disabled:pointer-events-none"
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  {showPassword ? (
                    <motion.span
                      key="hide"
                      initial={{
                        opacity: 0,
                        scale: 0.75,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.75,
                      }}
                      className="block"
                    >
                      <EyeOff className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="show"
                      initial={{
                        opacity: 0,
                        scale: 0.75,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.75,
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

            {/* Password requirements */}

            <div className="flex items-center gap-1.5 pt-0.5">
              <CheckCircle2 className="h-3 w-3 text-violet-400/70" />

              <p className="text-[10px] text-muted-foreground/55">
                Use 8+ characters with an uppercase letter and number.
              </p>
            </div>
          </div>

          {/* =================================================
              SERVER ERROR
          ================================================= */}

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
                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                <span>{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              SUBMIT
          ================================================= */}

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
            className="group relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* subtle button shine */}

            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex items-center gap-2">
              {isSubmitting || isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {isNavigating
                    ? "Preparing your workspace..."
                    : "Creating account..."}
                </>
              ) : (
                <>
                  Create account

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </span>
          </motion.button>
        </form>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />

          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/45">
            or continue with
          </span>

          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* =================================================
            GOOGLE
        ================================================= */}

        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isNavigating}
          whileHover={!isNavigating ? { y: -1 } : undefined}
          whileTap={!isNavigating ? { scale: 0.99 } : undefined}
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background text-sm font-medium shadow-sm transition-all duration-200 hover:border-violet-300/60 hover:bg-violet-50/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Chrome className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-6" />

          Continue with Google
        </motion.button>

        {/* =================================================
            TERMS
        ================================================= */}

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
            delay: 0.25,
          }}
          className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 px-3.5 py-3 text-center"
        >
          {/* subtle decorative glow */}

          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-400/10 blur-2xl" />

          <div className="relative mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-violet-500/70" />

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-violet-500/70">
              BrandPilot
            </span>
          </div>

          <p className="relative text-[10px] leading-relaxed text-muted-foreground/60">
            By creating an account, you agree to our{" "}

            <a
              href="/terms"
              className="font-medium text-foreground/75 transition hover:text-violet-600"
            >
              Terms of Service
            </a>

            {" "}and{" "}

            <a
              href="/privacy"
              className="font-medium text-foreground/75 transition hover:text-violet-600"
            >
              Privacy Policy
            </a>

            .
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}

