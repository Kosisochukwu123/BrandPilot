// src/app/reset-password/page.tsx
"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <Link href="/login" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to login
        </Link>

        <div className="mt-8">
          <h1 className="text-2xl font-medium tracking-tight">Set a new password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Choose a strong new password for your account</p>
        </div>

        <div className="mt-6">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-secondary/40" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}