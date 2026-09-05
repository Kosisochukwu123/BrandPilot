import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/components/Projects";
import { Navbar } from "@/components/marketing/navbar";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <section className="flex min-h-[100dvh] flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-16 md:px-16 md:pb-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
          01 · Studio
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight sm:mt-6 sm:text-5xl md:text-7xl lg:text-8xl">
          Products built with <span className="text-accent">craft</span>,
          shipped with intent.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-8 sm:text-base md:text-lg">
          A small, senior team working on interfaces, systems, and the
          storytelling around them. Scroll to see recent work.
        </p>
      </section>
      <Projects />
      <footer className="border-t border-border px-4 py-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:px-6 sm:py-10 sm:text-xs md:px-16">
        © 2026 — Selected work
      </footer>
    </main>
  );
}
