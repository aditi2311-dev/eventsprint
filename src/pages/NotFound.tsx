import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-sky-500/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative text-center"
      >
        <motion.p
          aria-hidden
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-r from-primary via-primary to-sky-500 bg-clip-text text-8xl font-bold tracking-tight text-transparent select-none sm:text-9xl"
        >
          404
        </motion.p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          This page sprinted off somewhere.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
          The event you&apos;re looking for doesn&apos;t exist — or it already
          wrapped. Head back to the portal and find the next one.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="btn-shine group rounded-full px-7">
            <Link to="/">
              Back to home
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group rounded-full px-7"
          >
            <Link to="/events">
              <Compass className="size-4" />
              Browse events
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
