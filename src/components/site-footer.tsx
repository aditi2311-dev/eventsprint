import { CATEGORY_META, CATEGORIES } from "@/data/events";
import { Code2 } from "lucide-react";
import { Link } from "react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Code2 className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              EventSprint
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The student tech-event portal. Discover hackathons, workshops and
            competitions, register in seconds, and keep track of everything —
            right in your browser.
          </p>
          <p className="mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            Built for WebSprint 2026
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/events" className="transition-colors hover:text-foreground">
                All events
              </Link>
            </li>
            <li>
              <Link
                to="/my-registrations"
                className="transition-colors hover:text-foreground"
              >
                My registrations
              </Link>
            </li>
            <li>
              <Link to="/events" className="transition-colors hover:text-foreground">
                Featured events
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {CATEGORIES.map((category) => {
              const meta = CATEGORY_META[category];
              const Icon = meta.icon;
              return (
                <li key={category}>
                  <Link
                    to={`/events?category=${category}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                    {category}s
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© 2026 EventSprint. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}
