"use client";

import { useEffect, useState } from "react";
import {
  Gauge,
  Users,
  CreditCard,
  ShieldAlert,
  FileText,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/content", label: "Moderation", icon: FileText },
  { href: "/admin/audit", label: "Audit log", icon: ShieldAlert },
];

function BrandMark() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-full border border-border bg-secondary font-mono text-[10px] font-semibold tracking-tight text-foreground">
        BP
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-medium tracking-tight text-foreground">
          BrandPilot
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Admin
        </span>
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
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-foreground transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className="truncate">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Panel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 border-r border-border/70 bg-secondary/20 px-4 py-6 backdrop-blur-xl">
      <BrandMark />

      <nav className="flex-1">
        <p className="px-3 pb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Platform
        </p>
        <NavLinks onClick={onNavigate} />
      </nav>

      <div className="space-y-3">
        <div className="rounded-xl border border-border/70 bg-background/40 p-3">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative size-1.5 rounded-full bg-accent" />
            </span>
            All systems normal
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to app
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile bar - shown only on mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl md:hidden">
        <BrandMark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Menu className="size-4" />
        </button>
      </div>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[264px] bg-background">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <Panel onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar - fixed and hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] md:block">
        <Panel />
      </aside>
    </>
  );
}

export default AdminSidebar;