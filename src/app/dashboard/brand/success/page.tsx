// src/app/dashboard/brand/success/page.tsx
"use client";

import Link from "next/link";
import { Confetti } from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";
import { Sparkles, Globe, Image as ImageIcon, Radio, LayoutDashboard } from "lucide-react";

const NEXT_STEPS = [
  { href: "/dashboard/generate", label: "Generate Content", icon: Sparkles },
  { href: "/dashboard/brand/report", label: "View Brand Report", icon: Globe },
  { href: "/dashboard/posters/new", label: "Create Poster", icon: ImageIcon },
  { href: "/dashboard/channels", label: "Connect Socials", icon: Radio },
];

export default function BrandBrainSuccessPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Confetti />
      <h1 className="text-3xl font-semibold">Your Brand Brain has been created 🎉</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        BrandPilot now understands your business — every content generation,
        poster, and recommendation from here on will use this profile.
      </p>

      <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-3">
        {NEXT_STEPS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-5 text-sm hover:bg-muted"
          >
            <Icon className="h-5 w-5 text-primary" />
            {label}
          </Link>
        ))}
      </div>

      <Button variant="outline" className="mt-8" asChild>
        <Link href="/dashboard">
          <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
        </Link>
      </Button>
    </div>
  );
}