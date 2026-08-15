import { formatEventDate } from "@/components/event-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getEventById } from "@/data/events";
import { formatRegisteredAt, useRegistrations } from "@/lib/registrations";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Mail,
  MapPin,
  School,
  Ticket,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function MyRegistrations() {
  const { registrations, removeRegistration } = useRegistrations();
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const pendingCancel = registrations.find((r) => r.id === pendingCancelId);

  const upcomingCount = registrations.filter((r) => {
    const event = getEventById(r.eventId);
    return event && new Date(event.date).getTime() >= Date.now();
  }).length;

  if (registrations.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ticket className="size-7" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            No registrations yet
          </h1>
          <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
            Once you register for an event, your confirmation lives here —
            safely stored in your browser. Go find something worth building.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-7">
            <Link to="/events">
              Browse events
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Your ticket wallet
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          My registrations
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            {registrations.length} total
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs">
            {upcomingCount} upcoming
          </Badge>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
        {registrations.map((registration, index) => {
          const event = getEventById(registration.eventId);
          const Icon = event?.icon ?? Ticket;
          return (
            <motion.div
              key={registration.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
            >
              <Card className="h-full gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-base leading-snug font-semibold tracking-tight">
                        {event ? event.name : "Event no longer listed"}
                      </h2>
                      {event && (
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                          {event.category} · {event.mode}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className="shrink-0 gap-1 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                    Confirmed
                  </Badge>
                </div>

                {event && (
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
                )}

                <div className="grid gap-2 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <Ticket className="size-3.5 shrink-0 text-primary" />
                    #{registration.id}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-3.5 shrink-0" />
                    {registration.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <School className="size-3.5 shrink-0" />
                    {registration.college}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-3.5 shrink-0" />
                    Registered {formatRegisteredAt(registration.registeredAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Registered as{" "}
                    <span className="font-medium text-foreground">
                      {registration.name}
                    </span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setPendingCancelId(registration.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      <AlertDialog
        open={pendingCancelId !== null}
        onOpenChange={(open) => !open && setPendingCancelId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this registration?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel && (
                <>
                  Your seat for{" "}
                  <span className="font-medium text-foreground">
                    {getEventById(pendingCancel.eventId)?.name ??
                      "this event"}
                  </span>{" "}
                  will be released and this entry removed from your browser.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="gap-1.5 rounded-full bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (pendingCancelId) removeRegistration(pendingCancelId);
                setPendingCancelId(null);
              }}
            >
              <Trash2 className="size-4" />
              Cancel registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
