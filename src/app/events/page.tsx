"use client";

import { useCallback, useState, type FormEvent } from "react";
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";

import EventCard from "@/components/shared/event-card";
import EventCardSkeleton from "@/components/shared/event-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiData } from "@/hooks/use-api-data";
import { apiRequest } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import type { EventsResponse } from "@/types/event";

const filters = ["All", ...EVENT_TYPES];

export default function EventsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "9",
    });

    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);

    return apiRequest<EventsResponse>(`/api/events?${params.toString()}`);
  }, [category, page, search]);

  const { data, loading, error, reload } = useApiData(fetchEvents);

  const events = data?.events ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  function reloadEvents() {
    void reload();
  }

  function goToPage(nextPage: number) {
    const target = Math.min(totalPages, Math.max(1, nextPage));

    if (target !== page) setPage(target);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    if (nextSearch === search && page === 1) {
      reloadEvents();
      return;
    }

    setSearch(nextSearch);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");

    if (!search && category === "All" && page === 1) {
      reloadEvents();
      return;
    }

    setSearch("");
    setCategory("All");
    setPage(1);
  }

  const hasFilters = Boolean(search || category !== "All");

  return (
    <main className="min-h-screen bg-muted/20">
      <section className="border-b border-border bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <Badge className="mb-4 border-0 bg-primary/10 text-primary hover:bg-primary/10">
            <CalendarDays className="mr-1.5 size-3.5" />
            Upcoming events
          </Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find your next opportunity to make a difference
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Browse volunteer events created by the ImpactPulse community. Every
            event here is upcoming — pick a cause and show up.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by event, location, or keyword..."
                className="h-11 pl-10"
              />
            </div>
            <Button type="submit" className="h-11 px-6">
              Search
            </Button>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                className="h-11"
                onClick={clearFilters}
              >
                <X className="mr-1.5 size-4" />
                Clear
              </Button>
            )}
          </form>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === category && page === 1) return;

                  setCategory(item);
                  setPage(1);
                }}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {item === "All" ? "All events" : item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading events..." : `${total} upcoming event${total === 1 ? "" : "s"}`}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="font-semibold text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={reloadEvents}>
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
            <CalendarDays className="mx-auto size-12 text-muted-foreground/40" />
            <h2 className="mt-4 text-xl font-bold">No events found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search or category, or create a new event.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button render={<a href="/dashboard/create-event" />}>
                Create an event
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.eventId || event._id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    variant={page === index + 1 ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(index + 1)}
                    aria-label={`Go to page ${index + 1}`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
