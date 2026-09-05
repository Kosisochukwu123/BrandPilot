import { SpotlightCard } from "./motion-primitives";

export function StatCard({
  label,
  value,
  hint,
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  progress?: number;
}) {
  return (
    <SpotlightCard className="p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[28px]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
      {typeof progress === "number" ? (
        <div className="mt-4 h-px w-full overflow-hidden bg-border">
          <span
            className="block h-px bg-accent transition-[width] duration-1000 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
    </SpotlightCard>
  );
}

export default StatCard;
