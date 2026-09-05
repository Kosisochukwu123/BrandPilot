"use client";

import type { ReactNode } from "react";
import { useBrandTransition } from "@/components/providers/brand-transition-provider";

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function TransitionLink({
  href,
  children,
  className,
}: TransitionLinkProps) {
  const { startTransition, isTransitioning } = useBrandTransition();

  return (
    <button
      type="button"
      disabled={isTransitioning}
      onClick={() => startTransition(href)}
      className={className}
    >
      {children}
    </button>
  );
}