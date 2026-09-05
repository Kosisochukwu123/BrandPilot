// src/components/marketing/footer.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Github, Twitter, Linkedin, Mail, Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-sm">
      {/* Subtle gradient line at top */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                BP
              </span>
              <span className="text-sm font-medium">BrandPilot</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Turn your website into a month of marketing. AI-powered content generation and scheduling across all platforms.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="rounded-full border border-border/50 p-2 text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-border/50 p-2 text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-border/50 p-2 text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@brandpilot.com"
                className="rounded-full border border-border/50 p-2 text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@brandpilot.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <span>© {currentYear} BrandPilot AI</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground/40">
              <Sparkles className="h-3 w-3" />
              <span>AI-powered</span>
            </span>
            <span className="h-3 w-px bg-border/50" />
            <span className="flex items-center gap-1.5 text-muted-foreground/40">
              <Heart className="h-3 w-3" />
              <span>Built with care</span>
            </span>
          </div>
        </motion.div>

        {/* Craft detail */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-border/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30">
              Crafting Digital Experiences
            </span>
            <span className="h-px w-8 bg-border/50" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}