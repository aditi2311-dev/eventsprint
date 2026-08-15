import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EVENTS, getEventById } from "@/data/events";
import type { Registration } from "@/lib/registrations";
import { formatEventDate } from "@/components/event-card";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Ticket,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import type { TechEvent } from "@/data/events";

type RegistrationInput = Omit<Registration, "id" | "registeredAt">;

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: TechEvent | null;
  registeredIds: Set<string>;
  onSubmit: (input: RegistrationInput) => Registration | null;
}

interface FormValues {
  name: string;
  email: string;
  college: string;
  phone: string;
  eventId: string;
  notes: string;
  agree: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+]?[\d\s()-]{10,16}$/;

const sortedEvents = [...EVENTS].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
);

const CONFETTI_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
];

function fireConfetti() {
  const defaults = {
    spread: 360,
    ticks: 70,
    gravity: 0.9,
    decay: 0.94,
    startVelocity: 26,
    colors: CONFETTI_COLORS,
  };
  confetti({ ...defaults, particleCount: 70, origin: { y: 0.75 } });
  window.setTimeout(
    () =>
      confetti({
        ...defaults,
        particleCount: 35,
        angle: 60,
        origin: { x: 0.25, y: 0.8 },
      }),
    160,
  );
  window.setTimeout(
    () =>
      confetti({
        ...defaults,
        particleCount: 35,
        angle: 120,
        origin: { x: 0.75, y: 0.8 },
      }),
    320,
  );
}

/** Decorative barcode whose bars are derived from the registration id. */
function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    const list: number[] = [];
    let acc = 0;
    for (const ch of seed) {
      const code = ch.charCodeAt(0);
      list.push((code % 3) + 1, (code % 2) + 1);
      acc += code;
    }
    list.push((acc % 3) + 1);
    return list;
  }, [seed]);

  return (
    <div className="flex shrink-0 items-stretch gap-[2px]" aria-hidden>
      {bars.map((width, index) => (
        <motion.span
          key={index}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.35,
            delay: 0.35 + index * 0.012,
            ease: "easeOut",
          }}
          style={{ width: width * 2 }}
          className="inline-block h-7 origin-left rounded-[1px] bg-foreground/90"
        />
      ))}
    </div>
  );
}

export function RegisterDialog({
  open,
  onOpenChange,
  event,
  registeredIds,
  onSubmit,
}: RegisterDialogProps) {
  const [submitted, setSubmitted] = useState<Registration | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      college: "",
      phone: "",
      eventId: event?.id ?? "",
      notes: "",
      agree: false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        email: "",
        college: "",
        phone: "",
        eventId: event?.id ?? "",
        notes: "",
        agree: false,
      });
      setSubmitted(null);
      setDuplicate(false);
    }
  }, [open, event, form]);

  const handleSubmit = (values: FormValues) => {
    const record = onSubmit({
      eventId: values.eventId,
      name: values.name.trim(),
      email: values.email.trim(),
      college: values.college.trim(),
      phone: values.phone.trim() || undefined,
      notes: values.notes.trim() || undefined,
    });
    if (!record) {
      setDuplicate(true);
      return;
    }
    setSubmitted(record);
    fireConfetti();
    const registeredEvent = getEventById(record.eventId);
    toast.success("Registration confirmed", {
      description: registeredEvent
        ? `Your seat at ${registeredEvent.name} is reserved.`
        : "Your seat is reserved.",
    });
  };

  const selectedEvent = event ? getEventById(event.id) ?? event : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 py-2 text-center"
            >
              <span className="relative mx-auto flex size-14 items-center justify-center">
                <motion.span
                  initial={{ scale: 0, rotate: -24 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                    delay: 0.05,
                  }}
                  className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="size-7" />
                </motion.span>
                <motion.span
                  aria-hidden
                  initial={{ scale: 0.5, opacity: 0.7 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-emerald-500/40"
                />
              </span>
              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-xl">
                  You&apos;re in, {submitted.name.split(" ")[0]}!
                </DialogTitle>
                <DialogDescription className="text-pretty">
                  Your seat is confirmed — here&apos;s your ticket. Show it at
                  the venue entrance.
                </DialogDescription>
              </DialogHeader>

              {(() => {
                const registeredEvent = getEventById(submitted.eventId);
                if (!registeredEvent) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 18, rotateX: -8 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
                    className="relative rounded-2xl border text-left shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-gradient-to-r from-primary to-sky-500 px-5 py-3 text-primary-foreground">
                      <p className="text-xs font-bold tracking-[0.2em] uppercase">
                        Admit one
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] font-medium opacity-85">
                        <Ticket className="size-3.5" />
                        EventSprint
                      </p>
                    </div>
                    <div className="relative px-5 pt-4 pb-5">
                      <p className="text-base font-semibold tracking-tight">
                        {registeredEvent.name}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            When
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground">
                            <CalendarDays className="size-3.5 shrink-0" />
                            {formatEventDate(registeredEvent)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            Where
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground">
                            <MapPin className="size-3.5 shrink-0" />
                            {registeredEvent.venue}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            Guest
                          </p>
                          <p className="mt-0.5 font-medium text-foreground">
                            {submitted.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            Reg ID
                          </p>
                          <p className="mt-0.5 font-mono font-semibold text-foreground">
                            #{submitted.id}
                          </p>
                        </div>
                      </div>

                      <div className="relative my-4 flex items-center">
                        <span className="absolute top-1/2 -left-5 size-5 -translate-y-1/2 rounded-full bg-background" />
                        <div className="w-full border-t border-dashed border-border" />
                        <span className="absolute top-1/2 -right-5 size-5 -translate-y-1/2 rounded-full bg-background" />
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <p className="max-w-[55%] text-[10px] leading-4 text-muted-foreground">
                          Present this ticket at the venue entrance. Keep your
                          registration ID handy.
                        </p>
                        <Barcode seed={submitted.id} />
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              <DialogFooter className="sm:justify-center">
                <Button asChild onClick={() => onOpenChange(false)}>
                  <Link to="/my-registrations">View my registrations</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Done
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <DialogHeader>
                <DialogTitle>Register for an event</DialogTitle>
                <DialogDescription>
                  {selectedEvent
                    ? `Reserve your seat for ${selectedEvent.name}.`
                    : "Pick an event and tell us who's coming."}
                </DialogDescription>
              </DialogHeader>

              {duplicate && (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertTitle>Already registered</AlertTitle>
                  <AlertDescription>
                    This email is already registered for the selected event.
                    Check{" "}
                    <Link
                      to="/my-registrations"
                      className="font-medium underline underline-offset-2"
                    >
                      My Registrations
                    </Link>{" "}
                    if you think this is a mistake.
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setDuplicate(false);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sortedEvents.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id}
                                disabled={registeredIds.has(item.id)}
                              >
                                {item.name}
                                <span className="text-muted-foreground">
                                  {" "}
                                  · {format(new Date(item.date), "MMM d")}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ada Lovelace"
                              autoComplete="name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@college.edu"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="college"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College / University</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your institution"
                              autoComplete="organization"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+91 98765 43210"
                              autoComplete="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Only used for event updates.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Team members, dietary needs, questions for the organisers…"
                            maxLength={300}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-xl border p-3.5">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(value) =>
                              field.onChange(value === true)
                            }
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div className="grid gap-1">
                          <FormLabel className="text-xs leading-5 font-normal text-muted-foreground">
                            I confirm the details above are correct and I can
                            attend the selected event on the listed date.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={cn("btn-shine rounded-full")}
                    >
                      <Ticket className="size-4" />
                      Confirm registration
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
