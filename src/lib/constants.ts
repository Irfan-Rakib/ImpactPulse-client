export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health",
  "Food",
  "Community",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_STYLES: Record<string, string> = {
  Cleanup: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  Plantation: "bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300",
  Donation: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  Education: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  Health: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  Food: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300",
  Community: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export const SITE = {
  name: "ImpactPulse",
  tagline: "Small actions. Big changes.",
  email: "hello@impactpulse.org",
  phone: "+880 1700 000000",
  address: "Dhaka, Bangladesh",
};
