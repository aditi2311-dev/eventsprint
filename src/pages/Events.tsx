import { EventCard } from "@/components/event-card";
import { RegisterDialog } from "@/components/register-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  EVENTS,
  type EventCategory,
  type TechEvent,
} from "@/data/events";
import { useRegistrations } from "@/lib/registrations";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

type CategoryFilter = EventCategory | "All";
type SortKey = "soonest" | "latest" | "name";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "soonest", label: "Soonest first" },
  { value: "latest", label: "Latest first" },
  { value: "name", label: "Name A–Z" },
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [category, setCategory] = useState<CategoryFilter>(
    CATEGORIES.includes(urlCategory as EventCategory)
      ? (urlCategory as EventCategory)
      : "All",
  );

  // Keep local state in sync when the URL category changes (e.g. footer links).
  useEffect(() => {
    const next = CATEGORIES.includes(urlCategory as EventCategory)
      ? (urlCategory as EventCategory)
      : "All";
    setCategory(next);
  }, [urlCategory]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("soonest");
  const [registerEvent, setRegisterEvent] = useState<TechEvent | null>(null);

  const { registrations, addRegistration } = useRegistrations();
  const registeredIds = useMemo(
    () => new Set(registrations.map((r) => r.eventId)),
    [registrations],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = EVENTS.filter((event) => {
      const matchesCategory = category === "All" || event.category === category;
      const matchesQuery =
        q === "" ||
        event.name.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      const diff =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return sort === "latest" ? -diff : diff;
    });
  }, [category, query, sort]);

  const handleCategoryChange = (next: CategoryFilter) => {
    setCategory(next);
    setSearchParams(
      next === "All" ? {} : { category: next },
      { replace: true },
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Event listing
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            All events
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            of {EVENTS.length} events
          </p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events by name, topic or tag…"
            className="h-10 rounded-full bg-card pl-10"
            aria-label="Search events"
          />
        </div>

        <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
          <SelectTrigger className="h-10 w-full rounded-full lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Category chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-4 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Filter by category"
      >
        {(["All", ...CATEGORIES] as CategoryFilter[]).map((item) => {
          const active = category === item;
          const count =
            item === "All"
              ? EVENTS.length
              : EVENTS.filter((e) => e.category === item).length;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleCategoryChange(item)}
              className={cn(
                "relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-transparent text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {item}
                <span
                  className={cn(
                    "text-xs",
                    active ? "text-primary-foreground/70" : "text-muted-foreground/70",
                  )}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Grid */}
      <div className="mt-8">
        {filtered.length > 0 ? (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  registered={registeredIds.has(event.id)}
                  onRegister={setRegisterEvent}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              {query.trim() ? (
                <SearchX className="size-6" />
              ) : (
                <CalendarX2 className="size-6" />
              )}
            </span>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">
              {query.trim()
                ? `No events match "${query.trim()}"`
                : "No events in this category yet"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {query.trim()
                ? "Try a different keyword, or clear the filters to see everything."
                : "New events are added all the time — check back soon."}
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-full"
              onClick={() => {
                setQuery("");
                handleCategoryChange("All");
              }}
            >
              Clear filters
            </Button>
          </motion.div>
        )}
      </div>

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
