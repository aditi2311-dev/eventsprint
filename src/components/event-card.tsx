import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TechEvent, TintKey } from "@/data/events";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { CalendarDays, Check, MapPin, Sparkles } from "lucide-react";
import { type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

const TINT_CLASSES: Record<
  TintKey,
  { chip: string; dot: string }
> = {
  indigo: {
    chip: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  sky: {
    chip: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  emerald: {
    chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  amber: {
    chip: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  rose: {
    chip: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  violet: {
    chip: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  teal: {
    chip: "bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  orange: {
    chip: "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300",
    dot: "bg-orange-500",
  },
};

export function formatEventDate(event: TechEvent): string {
  const start = format(new Date(event.date), "EEE, MMM d");
  if (event.endDate) {
    const end = format(new Date(event.endDate), "MMM d");
    return `${start} – ${end} · ${event.time}`;
  }
  return `${start} · ${event.time}`;
}

const TILT_SPRING = { stiffness: 180, damping: 18 };

/** Interactive 3D tilt + cursor-tracking glare wrapper for cards. */
function TiltCard({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(py, [0, 1], [6, -6]),
    TILT_SPRING,
  );
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-6, 6]),
    TILT_SPRING,
  );
  const glare = useMotionTemplate`radial-gradient(160px circle at ${useTransform(
    px,
    (v) => `${v * 100}%`,
  )} ${useTransform(py, (v) => `${v * 100}%`)}, rgba(255, 255, 255, 0.14), transparent 70%)`;

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 900,
      }}
      className="group relative h-full [transform-style:preserve-3d]"
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glare, opacity: reduceMotion ? 0 : undefined }}
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  );
}

interface EventCardProps {
  event: TechEvent;
  registered?: boolean;
  featured?: boolean;
  index?: number;
  onRegister: (event: TechEvent) => void;
}

export function EventCard({
  event,
  registered = false,
  featured = false,
  index = 0,
  onRegister,
}: EventCardProps) {
  const Icon = event.icon;
  const tint = TINT_CLASSES[event.tint];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.05, 0.3),
        ease: "easeOut",
      }}
      className="h-full"
    >
      <TiltCard>
        <Card
          className={cn(
            "group h-full gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5",
            featured && "border-primary/20",
          )}
        >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
              tint.chip,
            )}
          >
            <Icon className="size-5" />
          </span>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {featured && (
              <Badge className="gap-1">
                <Sparkles className="size-3" />
                Featured
              </Badge>
            )}
            <Badge variant="secondary">{event.category}</Badge>
            <Badge variant="outline">{event.mode}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg leading-snug font-semibold tracking-tight">
            {event.name}
          </h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" />
              {formatEventDate(event)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" />
              {event.venue}
            </p>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {event.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div className="text-xs leading-4">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <span className={cn("size-1.5 rounded-full", tint.dot)} />
              {event.spotsLeft} seats left
            </p>
            <p className="text-muted-foreground">of {event.spots} total</p>
            <div className="mt-2 h-1 w-28 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{
                  width: `${(event.spotsLeft / event.spots) * 100}%`,
                }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
                className={cn(
                  "h-full rounded-full",
                  event.spotsLeft / event.spots < 0.15
                    ? "bg-rose-500"
                    : tint.dot,
                )}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-full"
            disabled={registered}
            onClick={() => onRegister(event)}
          >
            {registered ? (
              <>
                <Check className="size-3.5" />
                Registered
              </>
            ) : (
              "Register"
            )}
          </Button>
        </div>
        </Card>
      </TiltCard>
    </motion.div>
  );
}
