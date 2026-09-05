"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const pillRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = pillRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();

    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--lit", "1");
  };

  const onLeave = () => {
    pillRef.current?.style.setProperty("--lit", "0");
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5 sm:px-6">
      <div className="pointer-events-auto relative w-full max-w-3xl">

        {/* ================= NAVBAR ================= */}

        <div
          ref={pillRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative overflow-hidden rounded-full border border-border/80 bg-background/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          style={{ "--lit": 0 } as React.CSSProperties}
        >
          {/* Cursor Glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[var(--lit)] transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--foreground) 14%, transparent), transparent 65%)",
            }}
          />

          {/* Top Hairline */}
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />

          <nav className="relative flex items-center justify-between px-3 py-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 pl-1.5">
              <span className="flex size-7 items-center justify-center rounded-full border border-border bg-secondary font-mono text-[10px] font-semibold">
                BP
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="text-sm font-medium tracking-tight">
                BrandPilot
              </span>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side */}
            <div className="flex items-center gap-2">

              {/* Theme Toggle (Desktop) */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Desktop Login */}
              <Link
                href="/login"
                className="hidden rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition hover:text-foreground md:inline-flex"
              >
                Log in
              </Link>

              {/* Desktop CTA */}
              <Button
                asChild
                className="hidden md:inline-flex group rounded-full bg-foreground py-1.5 pl-4 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-background"
              >
                <Link href="/register">
                  Start free
                  <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                    <svg viewBox="0 0 16 16" className="size-3" fill="none">
                      <path
                        d="M4 12L12 4M12 4H6M12 4v6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Button>

              {/* Mobile Toggle */}
              <button
                type="button"
                aria-expanded={open}
                aria-label="Toggle menu"
                onClick={() => setOpen(!open)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
              >
                <span className="relative h-4 w-4">
                  <span
                    className={`absolute left-0 top-1/2 h-0.5 w-4 bg-current transition-all duration-300 ${
                      open ? "rotate-45" : "-translate-y-1.5"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-1/2 h-0.5 w-4 bg-current transition-all duration-300 ${
                      open ? "-rotate-45" : "translate-y-1.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* ================= MOBILE MENU ================= */}

        <div
          className={`absolute left-0 right-0 top-full mt-3 origin-top overflow-hidden rounded-3xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-300 md:hidden ${
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="p-3">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-3 h-px bg-border" />

            {/* Theme Toggle (Mobile) */}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            <div className="my-3 h-px bg-border" />

            <Link
              href="/login"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              Log in
            </Link>

            <Button asChild className="mt-3 w-full rounded-xl">
              <Link href="/register" onClick={closeMenu}>
                Start Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;