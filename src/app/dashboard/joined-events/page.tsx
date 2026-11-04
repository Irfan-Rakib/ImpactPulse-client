"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Eye,
  Loader2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventsResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      setError("");
      const data = await apiRequest<EventsResponse>("/api/my/joined-events");
      setEvents(data.events || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your joined events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading joined events...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Button variant="ghost" asChild className="mb-5">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Joined Events</h1>
          <p className="mt-2 text-muted-foreground">
            Keep track of the community activities you are volunteering for.
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {events.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center p-10 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">
                You have not joined any events
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore local events and find a cause you care about.
              </p>
              <Button asChild className="mt-5">
                <Link href="/events">Explore Events</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {events.map((event) => {
              const id = event.eventId || event._id;
              const isPast = new Date(event.eventDate).getTime() < Date.now();

              return (
                <Card key={id} className="overflow-hidden">
                  {event.imageUrl ? (
                    <div className="h-44 overflow-hidden bg-muted">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-primary/10">
                      <Users className="h-12 w-12 text-primary/60" />
                    </div>
                  )}

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold">{event.title}</h2>
                      <Badge variant={isPast ? "secondary" : "default"}>
                        {isPast ? "Completed" : "Upcoming"}
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.participantCount || 0} volunteers joined
                      </p>
                    </div>

                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/events/${id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Event Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
