import { Countdown } from "@/components/countdown";
import { EventCard, formatEventDate } from "@/components/event-card";
import { RegisterDialog } from "@/components/register-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CATEGORIES,
  CATEGORY_META,
  EVENTS,
  getFeaturedEvents,
  getUpcomingEvents,
} from "@/data/events";
import type { TechEvent } from "@/data/events";
import { useRegistrations } from "@/lib/registrations";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Flame,
  MapPin,
  Moon,
  Quote,
  Search,
  Sparkles,
  Star,
  Ticket,
  Timer,
  Zap,
} from "lucide-react";
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link } from "react-router";

const STATS = [
  { value: `${EVENTS.length}+`, label: "Live events" },
  { value: `${CATEGORIES.length}`, label: "Categories" },
  { value: "40+", label: "Colleges" },
  { value: "100%", label: "Free to join" },
];

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    text: "Browse hackathons, workshops and competitions — search by name or filter by category in one click.",
  },
  {
    icon: Ticket,
    step: "02",
    title: "Register",
    text: "Fill a short form with instant validation. Your seat is confirmed the moment you hit submit.",
  },
  {
    icon: CalendarDays,
    step: "03",
    title: "Show up & build",
    text: "Track every registration in one place and walk in ready — no paper, no queues, no confusion.",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Find things fast",
    text: "Live search and category filters surface the right event in seconds, not tabs.",
  },
  {
    icon: Moon,
    title: "Easy on the eyes",
    text: "A polished dark mode that keeps late-night planning sessions comfortable.",
  },
  {
    icon: Timer,
    title: "Never miss a date",
    text: "A live countdown tracks the next event so you always know what's coming up.",
  },
  {
    icon: Check,
    title: "Private by default",
    text: "Registrations are saved locally in your browser — no account, no backend, no data leaving your device.",
  },
];

const BUZZ: {
  quote: string;
  name: string;
  college: string;
  event: string;
}[] = [
  {
    quote:
      "Registered for WebSprint in under a minute. The ticket with the barcode made me feel so official.",
    name: "Ananya R.",
    college: "VIT",
    event: "WebSprint 2026",
  },
  {
    quote:
      "Finally one place for every hackathon on campus. No more scrolling through 40 WhatsApp groups.",
    name: "Rohan K.",
    college: "SRM",
    event: "Hack the Future",
  },
  {
    quote:
      "The live countdown on the homepage got my whole team hyped the week before CTF day.",
    name: "Meera S.",
    college: "NIT Trichy",
    event: "CyberQuest: CTF",
  },
  {
    quote:
      "Found a UI/UX sprint I would've totally missed. The filters are dangerously fast.",
    name: "Kabir M.",
    college: "BITS Pilani",
    event: "UI/UX Design Sprint",
  },
  {
    quote:
      "Dark mode, live seat counts and one-click registration — my new Friday-night planning ritual.",
    name: "Sara V.",
    college: "Anna University",
    event: "AI & ML Bootcamp",
  },
  {
    quote:
      "Booked my seat, got a ticket, showed up, built something. Zero friction anywhere.",
    name: "Dev P.",
    college: "IIIT Hyderabad",
    event: "Web Dev Masterclass",
  },
  {
    quote:
      "The seat-count bars tell me exactly which events will sell out. I've never missed a deadline since.",
    name: "Ishita G.",
    college: "DTU",
    event: "Scaling Systems Talk",
  },
  {
    quote:
      "Took a chance on Flutter Fast-Track with zero mobile experience — shipped my first app in a weekend.",
    name: "Arjun N.",
    college: "MIT Pune",
    event: "Flutter Fast-Track",
  },
];

const BUZZ_CHIPS = [
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  "bg-violet-500/10 text-violet-600 dark:text-violet-300",
];

function buzzInitials(name: string): string {
  return name
    .replace(/\s+[A-Z]\.?$/, "")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function BuzzCard({
  item,
  index,
}: {
  item: (typeof BUZZ)[number];
  index: number;
}) {
  return (
    <figure className="w-[19rem] shrink-0 rounded-2xl border bg-card p-5 shadow-sm transition-colors duration-300 hover:border-primary/25">
      <div className="flex items-center justify-between">
        <span className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star
              key={starIndex}
              className="size-3 fill-amber-400 text-amber-400"
            />
          ))}
        </span>
        <Quote className="size-4 text-primary/40" />
      </div>
      <blockquote className="mt-3 text-sm leading-6 text-foreground/90">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5 border-t pt-4">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
            BUZZ_CHIPS[index % BUZZ_CHIPS.length],
          )}
        >
          {buzzInitials(item.name)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold">{item.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {item.college} · {item.event}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/** One infinite marquee row; `reverse` flips the direction. */
function BuzzRow({
  items,
  reverse = false,
  duration = 46,
}: {
  items: (typeof BUZZ)[number][];
  reverse?: boolean;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap items-start justify-center gap-4">
        {items.map((item, index) => (
          <BuzzCard key={`${item.name}-${index}`} item={item} index={index} />
        ))}
      </div>
    );
  }

  const row = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex shrink-0 gap-4 pr-4">
      {items.map((item, index) => (
        <BuzzCard
          key={`${keyPrefix}-${item.name}`}
          item={item}
          index={index}
        />
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {row("a")}
        {row("b")}
      </motion.div>
    </div>
  );
}

/** Headline split into words so each one can stagger in. */
const HEADLINE_WORDS = [
  "Discover",
  "the",
  "events",
  "that",
  "shape",
  "your",
  "skills.",
];
const GRADIENT_WORD_INDEX = new Set([4, 5, 6]);

const GRADIENT_CLASS =
  "bg-gradient-to-r from-primary via-primary to-sky-500 bg-clip-text text-transparent";

/** The hero verb cycles through these, one every few seconds. */
const HERO_VERBS = ["shape", "ignite", "level up", "supercharge"];

function RotatingWord({
  words,
  gradient = false,
  interval = 2600,
}: {
  words: string[];
  gradient?: boolean;
  interval?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [words, interval, reduceMotion]);

  const word = words[index];

  if (reduceMotion) {
    return (
      <span className={cn("inline-block", gradient && GRADIENT_CLASS)}>
        {word}
      </span>
    );
  }

  return (
    <span className="relative inline-block">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={word}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={cn("inline-block", gradient && GRADIENT_CLASS)}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function StatValue({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");
  const match = useMemo(() => value.match(/^(\d+)(.*)$/), [value]);

  useEffect(() => {
    if (!inView) return;
    if (!match) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, Number(match[1]), {
      duration: 1.1,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, match, value, delay]);

  return (
    <span ref={ref}>
      {display}
      {match ? match[2] : ""}
    </span>
  );
}

function TickerStrip() {
  const reduceMotion = useReducedMotion();
  const items = EVENTS.map((event) => ({
    name: event.name,
    category: event.category,
  }));

  const row = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <span
          key={`${keyPrefix}-${index}`}
          className="flex items-center gap-8 pr-8 text-sm"
        >
          <span className="font-medium whitespace-nowrap text-foreground/85">
            {item.name}
          </span>
          <span className="flex items-center gap-2 font-medium whitespace-nowrap text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary/60" />
            {item.category}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y bg-muted/40 py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      {reduceMotion ? (
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4">
          {items.map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-primary/60" />
              {item.name}
            </span>
          ))}
        </div>
      ) : (
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        >
          {row("a")}
          {row("b")}
        </motion.div>
      )}
    </div>
  );
}

function useRegisterFlow() {
  const { registrations, addRegistration } = useRegistrations();
  const [registerEvent, setRegisterEvent] = useState<TechEvent | null>(null);

  return {
    registrations,
    registeredIds: useMemo(
      () => new Set(registrations.map((r) => r.eventId)),
      [registrations],
    ),
    registerEvent,
    setRegisterEvent,
    addRegistration,
  };
}

export default function Landing() {
  const reduceMotion = useReducedMotion();
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const springX = useSpring(spotX, { stiffness: 80, damping: 25 });
  const springY = useSpring(spotY, { stiffness: 80, damping: 25 });
  const heroSpotlight = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, color-mix(in oklab, var(--primary) 8%, transparent), transparent 70%)`;

  const handleHeroMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const featured = getFeaturedEvents();
  const upcoming = getUpcomingEvents();
  const nextEvent = upcoming[0];
  const {
    registrations,
    registeredIds,
    registerEvent,
    setRegisterEvent,
    addRegistration,
  } = useRegisterFlow();

  return (
    <div className="overflow-x-clip">
      {/* ============ HERO ============ */}
      <section
        className="relative"
        onMouseMove={reduceMotion ? undefined : handleHeroMouseMove}
      >
        <div className="bg-grid-faint pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: "-50%" }}
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] max-w-full rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          aria-hidden
          style={{ background: heroSpotlight, opacity: reduceMotion ? 0 : 1 }}
          className="pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10 lg:pt-24 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Badge className="gap-1.5 px-3 py-1 text-xs">
                <Sparkles className="size-3" />
                EventSprint · Student edition
              </Badge>
            </motion.div>

            <h1 className="text-balance mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {HEADLINE_WORDS.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  {index === 4 ? (
                    <RotatingWord words={HERO_VERBS} gradient />
                  ) : (
                    <motion.span
                      className={cn(
                        "inline-block",
                        GRADIENT_WORD_INDEX.has(index) && GRADIENT_CLASS,
                      )}
                      initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.55,
                        delay: 0.18 + index * 0.07,
                        ease: "easeOut",
                      }}
                    >
                      {word}
                    </motion.span>
                  )}
                  {" "}
                </Fragment>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-pretty mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            >
              EventSprint brings hackathons, workshops and competitions from
              campuses everywhere into one clean portal — search, register in
              seconds, and keep every confirmation in your browser.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.72 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="btn-shine group rounded-full px-7"
              >
                <Link to="/events">
                  Browse events
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group rounded-full px-7"
              >
                <a href="#how-it-works">
                  How it works
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>

            {registrations.length > 0 && (
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Ticket className="size-4 text-primary" />
                You have {registrations.length} registration
                {registrations.length === 1 ? "" : "s"} saved —{" "}
                <Link
                  to="/my-registrations"
                  className="font-medium text-primary hover:underline"
                >
                  view them
                </Link>
              </p>
            )}

            <dl className="mt-10 grid max-w-lg grid-cols-4 gap-4 border-t pt-8">
              {STATS.map((stat, index) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold tracking-tight text-foreground">
                    <StatValue value={stat.value} delay={0.5 + index * 0.08} />
                  </dd>
                  <dd className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Hero visual — next event + countdown */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            {nextEvent && (
              <Card className="relative gap-5 overflow-hidden p-6 shadow-xl shadow-primary/5 sm:p-7">
                <motion.div
                  aria-hidden
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -top-20 -right-20 size-52 rounded-full bg-primary/10 blur-3xl"
                />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
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

                  <h2 className="mt-4 text-2xl font-bold tracking-tight">
                    {nextEvent.name}
                  </h2>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 shrink-0" />
                      {formatEventDate(nextEvent)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0" />
                      {nextEvent.venue}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="mb-2.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                      Starts in
                    </p>
                    <Countdown target={nextEvent.date} />
                  </div>

                  <div className="mt-7 flex gap-2.5">
                    <Button
                      className="btn-shine group flex-1 rounded-full"
                      disabled={registeredIds.has(nextEvent.id)}
                      onClick={() => setRegisterEvent(nextEvent)}
                    >
                      {registeredIds.has(nextEvent.id) ? (
                        <>
                          <Check className="size-4" />
                          Registered
                        </>
                      ) : (
                        <>
                          <Ticket className="size-4 transition-transform duration-300 group-hover:scale-110" />
                          Reserve my seat
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="group rounded-full"
                      aria-label="All events"
                    >
                      <Link to="/events">
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Floating accents */}
            <motion.div
              aria-hidden
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -left-4 hidden rounded-2xl border bg-card/90 px-4 py-3 shadow-lg backdrop-blur sm:block"
            >
              <p className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Zap className="size-3.5" />
                </span>
                Instant confirmation
              </p>
            </motion.div>
            <motion.div
              aria-hidden
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-5 -right-3 hidden rounded-2xl border bg-card/90 px-4 py-3 shadow-lg backdrop-blur sm:block"
            >
              <p className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Search className="size-3.5" />
                </span>
                Search & filter built in
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <TickerStrip />

      {/* ============ EVENT HIGHLIGHTS ============ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Event highlights
            </p>
            <h2 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured this month
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Hand-picked events worth your weekend — from the flagship build
              sprint to hands-on workshops and CTF battles.
            </p>
          </div>
          <Button asChild variant="ghost" className="group rounded-full shrink-0">
            <Link to="/events">
              View all events
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              featured
              index={index}
              registered={registeredIds.has(event.id)}
              onRegister={setRegisterEvent}
            />
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        id="how-it-works"
        className="border-y bg-muted/30 py-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              How it works
            </p>
            <h2 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              From curious to registered in three steps
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              No accounts, no approvals, no paperwork. Just you and the events
              you want to build at.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card className="group h-full gap-4 p-6 transition-colors hover:border-primary/25">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-4xl font-bold tracking-tight text-muted-foreground/15">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Browse by category
          </p>
          <h2 className="text-balance mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
            Whatever you want to build, there&apos;s an event for it
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => {
            const meta = CATEGORY_META[category];
            const Icon = meta.icon;
            const count = EVENTS.filter((e) => e.category === category).length;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  to={`/events?category=${category}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-primary/10 group-hover:text-primary">
                      <Icon className="size-5" />
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {category}s
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {meta.blurb}
                    </p>
                    <p className="mt-3 text-xs font-medium text-primary">
                      {count} event{count === 1 ? "" : "s"} live
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ CAMPUS BUZZ ============ */}
      <section className="border-t py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                Campus buzz
              </p>
              <h2 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Students sprint, students rave
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Real words from the folks who&apos;ve already sprinted — because
                a seat reserved is a story started.
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-xs shrink-0">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              4.9/5 from 2,300+ students
            </Badge>
          </motion.div>

          <div className="mt-12 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <BuzzRow items={BUZZ.slice(0, 4)} duration={48} />
            <BuzzRow items={BUZZ.slice(4)} reverse duration={56} />
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="border-t bg-muted/30 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Why EventSprint
            </p>
            <h2 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A portal that feels as fast as it looks
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="group h-full gap-3 p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <feature.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {feature.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12"
        >
          <div className="bg-grid-faint pointer-events-none absolute inset-0 opacity-40 invert dark:invert-0" />
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-sky-400/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Your seat at the next event is waiting.
            </h2>
            <p className="text-pretty mx-auto mt-4 max-w-xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
              Seats fill fast and most events cap their cohorts. Find what&apos;s
              next, register in under a minute, and show up ready to build.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="btn-shine group rounded-full px-7"
              >
                <Link to="/events">
                  Browse all events
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="btn-shine group rounded-full border border-primary-foreground/30 bg-transparent px-7 text-primary-foreground shadow-none hover:bg-primary-foreground/10"
              >
                <Link to="/my-registrations">
                  My registrations
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <RegisterDialog
        open={registerEvent !== null}
        onOpenChange={(open) => !open && setRegisterEvent(null)}
        event={registerEvent}
        registeredIds={registeredIds}
        onSubmit={addRegistration}
      />
    </div>
  );
}
