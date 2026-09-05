// src/components/dashboard/sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Fingerprint,
  Sparkles,
  Radio,
  FolderOpen,
  Settings,
  CreditCard,
  ImageIcon,
  Menu,
  X,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/brand", label: "Brand Analysis", icon: Fingerprint },
  { href: "/dashboard/generate", label: "Content Generator", icon: Sparkles },
  { href: "/dashboard/channels", label: "Channels", icon: Radio },
  { href: "/dashboard/content", label: "Saved Content", icon: FolderOpen },
  { href: "/dashboard/posters", label: "Posters", icon: ImageIcon },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function BrandMark() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-full border border-border bg-secondary font-mono text-[10px] font-semibold tracking-tight text-foreground">
        BP
      </span>
      <span className="text-sm font-medium tracking-tight text-foreground">
        BrandPilot
      </span>
    </Link>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                active
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-accent" />
              )}
              <Icon
                className={cn(
                  "size-[18px] shrink-0 transition-colors duration-200",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground/70 group-hover:text-foreground"
                )}
              />
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ProCard() {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
        <Zap className="size-4 text-accent" />
        <span>Upgrade to Pro</span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        Unlock unlimited channels and priority generation.
      </p>
    </div>
  );
}

function BottomActions({ onClick }: { onClick?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <ThemeToggle />

      <button
        onClick={() => {
          onClick?.();
          signOut({ callbackUrl: "/" });
        }}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <LogOut className="size-3.5" />
        <span>Log out</span>
      </button>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden">
        <BrandMark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[260px] flex-col border-r border-border bg-background p-4 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <BrandMark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto scrollbar-thin">
              <NavLinks onClick={() => setOpen(false)} />
            </nav>

            <div className="mt-4 space-y-3">
              <ProCard />
              <BottomActions onClick={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col border-r border-border/60 bg-background/50 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center px-5">
          <BrandMark />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          <NavLinks />
        </nav>

        <div className="mx-4 mb-4 space-y-3">
          <ProCard />
          <BottomActions />
        </div>
      </aside>

      {/* Thin scrollbar styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.4);
        }
      `}</style>
    </>
  );
}