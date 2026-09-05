// src/app/(auth)/register/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-foreground/5 to-transparent blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm transition-all hover:border-foreground/20"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
              BP
            </span>
            <span className="text-sm font-medium">BrandPilot</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <h1 className="text-2xl font-medium tracking-tight">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Start free, no card required
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6"
        >
          <RegisterForm />
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-6 space-y-3 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground transition-colors hover:underline underline-offset-4"
            >
              Log in
            </Link>
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30">
              <Sparkles className="h-3 w-3" />
              Free forever
            </span>
            <span className="h-px w-8 bg-border" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}