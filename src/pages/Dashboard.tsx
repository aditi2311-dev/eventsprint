import { Countdown } from "@/components/countdown";
import { formatEventDate } from "@/components/event-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CATEGORIES,
  CATEGORY_META,
  EVENTS,
  getEventById,
  getUpcomingEvents,
  type TechEvent,
} from "@/data/events";
import { useAuth } from "@/hooks/use-auth";
import { useRegistrations } from "@/lib/registrations";
import { cn } from "@/lib/utils";
import { animate, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Flame,
  LayoutDashboard,
  LogOut,
  MapPin,
  Rocket,
  School,
  Ticket,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

const STAT_CARDS = [
  {
    key: "seats",
    label: "Seats reserved",
    icon: Ticket,
    chip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  },
  {
    key: "upcoming",
    label: "Events upcoming",
    icon: CalendarDays,
    chip: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  },
  {
    key: "colleges",
    label: "Colleges represented",
    icon: School,
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  {
    key: "days",
    label: "Days to next sprint",
    icon: Rocket,
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
];

/** Animated count-up number that starts when scrolled into view. */
function CountUp({
  value,
  suffix = "",
  delay = 0,
}: {
  value: number;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { registrations } = useRegistrations();

  const upcomingEvents = useMemo(() => getUpcomingEvents(), []);
  const nextEvent = upcomingEvents[0];

  const registeredEvents = useMemo(
    () =>
      registrations
        .map((registration) => ({
          registration,
          event: getEventById(registration.eventId),
        }))
        .filter(
          (entry): entry is { registration: (typeof registrations)[number]; event: TechEvent } =>
            entry.event !== undefined,
        ),
    [registrations],
  );

  const upcomingRegistrations = registeredEvents.filter(
    ({ event }) => new Date(event.date).getTime() >= Date.now(),
  );

  const collegeCount = useMemo(
    () =>
      new Set(
        registrations
          .map((r) => r.college.trim().toLowerCase())
          .filter(Boolean),
      ).size,
    [registrations],
  );

  const daysToNext = nextEvent
    ? Math.max(
        1,
        Math.ceil(
          (new Date(nextEvent.date).getTime() - Date.now()) / 86_400_000,
        ),
      )
    : 0;

  const hottest = useMemo(() => {
    let best: TechEvent | null = null;
    for (const event of EVENTS) {
      if (
        !best ||
        event.spotsLeft / event.spots < best.spotsLeft / best.spots
      ) {
        best = event;
      }
    }
    return best;
  }, []);

  const firstName = useMemo(() => {
    if (user?.name) return user.name.trim().split(/\s+/)[0];
    if (user?.email) return user.email.split("@")[0];
    return "builder";
  }, [user]);

  const initials = useMemo(() => {
    if (user?.name) {
      return user.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return (user?.email ?? "ES").slice(0, 2).toUpperCase();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const stats = [
    { ...STAT_CARDS[0], value: registrations.length, suffix: "" },
    { ...STAT_CARDS[1], value: upcomingRegistrations.length, suffix: "" },
    { ...STAT_CARDS[2], value: collegeCount, suffix: "" },
    { ...STAT_CARDS[3], value: daysToNext, suffix: "d" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar className="size-12 border border-border/60 shadow-sm">
              <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                Your Event Hub
              </p>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
                Good to see you, {firstName}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {user?.email ?? "Anonymous session"} ·{" "}
                {registrations.length} seat
                {registrations.length === 1 ? "" : "s"} reserved
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/events">
                <Compass className="size-4" />
                Browse events
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + index * 0.06 }}
            >
              <Card className="h-full gap-3 p-5">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    stat.chip,
                  )}
                >
                  <stat.icon className="size-4" />
                </span>
                <div>
                  <p className="text-2xl font-bold tracking-tight tabular-nums">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      delay={0.15 + index * 0.05}
                    />
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Next up */}
            {nextEvent && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
              >
                <Card className="relative gap-5 overflow-hidden p-6 shadow-sm sm:p-7">
                  <motion.div
                    aria-hidden
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -top-24 -right-20 size-56 rounded-full bg-primary/10 blur-3xl"
                  />
                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge
                        variant="secondary"
                        className="gap-1.5 text-xs font-medium"
                      >
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                        Next up
                      </Badge>
                      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Flame className="size-3.5 text-orange-500" />
                        {nextEvent.spotsLeft} seats left
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold tracking-tight">
                          {nextEvent.name}
                        </h2>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <CalendarDays className="size-4 shrink-0" />
                            {formatEventDate(nextEvent)}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="size-4 shrink-0" />
                            {nextEvent.venue}
                          </p>
                        </div>
                      </div>
                      <Countdown target={nextEvent.date} />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                      <Button
                        asChild
                        className="btn-shine group rounded-full"
                      >
                        <Link to="/events">
                          Reserve my seat
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link to="/events">See all events</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Your seats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                    Your seats
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight">
                    Registrations
                  </h2>
                </div>
                <Button asChild variant="ghost" className="group rounded-full">
                  <Link to="/my-registrations">
                    View all
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {registeredEvents.length === 0 ? (
                <Card className="mt-4 items-center gap-3 p-8 text-center">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <LayoutDashboard className="size-5" />
                  </span>
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                    No seats reserved yet — the next sprint fills fast, so grab
                    yours before it&apos;s gone.
                  </p>
                  <Button asChild className="rounded-full">
                    <Link to="/events">
                      Browse events
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="mt-4 space-y-3">
                  {registeredEvents.slice(0, 4).map(
                    ({ registration, event }, index) => (
                      <motion.div
                        key={registration.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.35 + index * 0.06,
                        }}
                      >
                        <Link
                          to="/my-registrations"
                          className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md hover:shadow-primary/5"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                            <event.icon className="size-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold tracking-tight">
                              {event.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {formatEventDate(event)} · {event.venue}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="hidden shrink-0 sm:inline-flex"
                          >
                            #{registration.id}
                          </Badge>
                          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                            {new Date(event.date).getTime() >= Date.now()
                              ? "Upcoming"
                              : "Done"}
                            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      </motion.div>
                    ),
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
            >
              <Card className="gap-4 p-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                    Explore
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight">
                    Find your next sprint
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {CATEGORIES.map((category) => {
                    const meta = CATEGORY_META[category];
                    const Icon = meta.icon;
                    return (
                      <Link
                        key={category}
                        to={`/events?category=${category}`}
                        className="group flex items-center gap-2.5 rounded-xl border p-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                          <Icon className="size-4" />
                        </span>
                        <span className="truncate">{category}s</span>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Trending */}
            {hottest && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.36 }}
              >
                <Card className="relative gap-4 overflow-hidden p-6">
                  <motion.div
                    aria-hidden
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.9, 0.4],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-orange-500/10 blur-3xl"
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                        Trending now
                      </p>
                      <Flame className="size-4 text-orange-500" />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-base font-bold tracking-tight">
                        {hottest.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {hottest.category} · {hottest.venue}
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-foreground">
                          {hottest.spotsLeft} seats left
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(
                            (hottest.spotsLeft / hottest.spots) * 100,
                          )}
                          % open
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${(hottest.spotsLeft / hottest.spots) * 100}%`,
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.5,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-orange-500"
                        />
                      </div>
                    </div>
                    <Button asChild size="sm" className="btn-shine mt-5 w-full rounded-full">
                      <Link to="/events">
                        <Trophy className="size-4" />
                        Grab a seat
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
