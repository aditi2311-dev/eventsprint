import { useCallback, useState } from "react";

export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  college: string;
  phone?: string;
  notes?: string;
  registeredAt: string;
}

const STORAGE_KEY = "eventsprint:registrations:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadRegistrations(): Registration[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Registration =>
        !!item &&
        typeof item === "object" &&
        typeof (item as Registration).id === "string" &&
        typeof (item as Registration).eventId === "string",
    );
  } catch {
    return [];
  }
}

export function persistRegistrations(list: Registration[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage full or unavailable — registration simply won't persist.
  }
}

export function isDuplicateRegistration(
  list: Registration[],
  eventId: string,
  email: string,
): boolean {
  const normalized = email.trim().toLowerCase();
  return list.some(
    (item) =>
      item.eventId === eventId && item.email.trim().toLowerCase() === normalized,
  );
}

export function makeRegistrationId(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8).toUpperCase();
  }
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function formatRegisteredAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Shared hook for reading and mutating localStorage-backed registrations. */
export function useRegistrations() {
  const [registrations, setRegistrations] =
    useState<Registration[]>(loadRegistrations);

  const addRegistration = useCallback(
    (input: Omit<Registration, "id" | "registeredAt">): Registration | null => {
      if (
        isDuplicateRegistration(
          registrations,
          input.eventId,
          input.email,
        )
      ) {
        return null;
      }
      const record: Registration = {
        ...input,
        id: makeRegistrationId(),
        registeredAt: new Date().toISOString(),
      };
      const next = [record, ...registrations];
      setRegistrations(next);
      persistRegistrations(next);
      return record;
    },
    [registrations],
  );

  const removeRegistration = useCallback((id: string) => {
    setRegistrations((current) => {
      const next = current.filter((item) => item.id !== id);
      persistRegistrations(next);
      return next;
    });
  }, []);

  return { registrations, addRegistration, removeRegistration };
}
