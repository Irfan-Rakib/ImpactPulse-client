"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Ticket } from "lucide-react";

import EventCard from "@/components/shared/event-card";
import EventCardSkeleton from "@/components/shared/event-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import type { EventsResponse, EventItem } from "@/types/event";

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<EventsResponse>(
        "/api/my/joined-events",
        {},
        true,
      );
      setEvents(data.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your joined events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="mb-3 border-0 bg-primary/10 text-primary hover:bg-primary/10">
            <Ticket className="mr-1.5 size-3.5" />
            Your commitments
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Joined events
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            All the events you signed up for, sorted by event date so the next
            one is always first.
          </p>
        </div>

        <Button variant="outline" onClick={loadEvents} disabled={loading}>
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" variant="outline" onClick={loadEvents}>
            Try again
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {loading
          ? "Loading your events..."
          : `${events.length} joined event${events.length === 1 ? "" : "s"}`}
      </p>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Ticket className="mx-auto size-12 text-muted-foreground/40" />
          <h2 className="mt-4 text-xl font-bold">No joined events yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Find a cause you care about and join your first event.
          </p>
          <Button className="mt-5" render={<Link href="/events" />}>
            Browse upcoming events
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.eventId || event._id}
              event={event}
              showStatus
            />
          ))}
        </div>
      )}
    </div>
  );
}
