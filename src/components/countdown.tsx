import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function useCountdown(target: string | Date): CountdownParts {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { days, hours, minutes, seconds, done: diff <= 0 };
}

const pad = (value: number) => String(value).padStart(2, "0");

const CELLS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export function Countdown({ target }: { target: string | Date }) {
  const { days, hours, minutes, seconds, done } = useCountdown(target);

  if (done) {
    return (
      <p className="text-sm font-medium text-foreground">
        This event starts today — see you there!
      </p>
    );
  }

  const values = { days, hours, minutes, seconds };

  return (
    <div className="flex items-stretch gap-2" aria-label="Countdown to event">
      {CELLS.map((cell, index) => (
        <div key={cell.key} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-sm font-semibold text-muted-foreground/60">
              :
            </span>
          )}
          <div className="flex min-w-14 flex-col items-center rounded-xl border bg-card/80 px-3 py-2 shadow-sm backdrop-blur">
            <span className="relative block h-7 w-full overflow-hidden text-center">
              <motion.span
                key={pad(values[cell.key])}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-block text-xl font-bold tabular-nums tracking-tight text-foreground"
              >
                {pad(values[cell.key])}
              </motion.span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              {cell.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
