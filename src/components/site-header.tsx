import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/data/events";
import { useAuth } from "@/hooks/use-auth";
import { useRegistrations } from "@/lib/registrations";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Ticket,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/my-registrations", label: "My Registrations" },
];

/** Auth-aware entry point: sign-in CTA when signed out, account menu when in. */
function AuthMenu() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-muted">
        <span className="size-3 animate-pulse rounded-full bg-muted-foreground/30" />
      </span>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full md:hidden"
          aria-label="Sign in"
        >
          <Link to="/auth">
            <LogIn className="size-4" />
          </Link>
        </Button>
        <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
          <Link to="/auth">Sign in</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Account menu"
        >
          <Avatar className="size-8 border border-border/60">
            <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="border-b px-2 py-2">
          <p className="truncate px-2 text-sm font-semibold">
            {user?.name ?? "Guest builder"}
          </p>
          <p className="truncate px-2 pt-0.5 text-xs text-muted-foreground">
            {user?.email ?? "Anonymous session"}
          </p>
        </div>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/dashboard">
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/my-registrations">
            <Ticket className="mr-2 size-4" />
            My registrations
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { registrations } = useRegistrations();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Code2 className="size-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            EventSprint
            <span className="ml-1.5 hidden text-xs font-medium text-muted-foreground sm:inline">
              · Events
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <span className="flex items-center gap-1.5">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {link.label}                    {link.to === "/my-registrations" &&
                      registrations.length > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                        {registrations.length}
                      </span>
                    )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link to="/events">
              <Ticket className="size-3.5" />
              Browse events
            </Link>
          </Button>
          <AuthMenu />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )
                  }
                >
                  {link.label}
                  {link.to === "/my-registrations" &&
                    registrations.length > 0 && (
                      <Badge variant="secondary">{registrations.length}</Badge>
                    )}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full"
                  >
                    <Link to={`/events?category=${category}`}>{category}s</Link>
                  </Button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
