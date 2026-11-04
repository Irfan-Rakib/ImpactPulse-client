"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventsResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      setError("");
      const data = await apiRequest<EventsResponse>("/api/my/events");
      setEvents(data.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function handleDelete(eventId: string) {
    setDeletingId(eventId);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest<{ message?: string }>(
        `/api/events/${eventId}`,
        { method: "DELETE" },
        true,
      );

      setEvents((previous) =>
        previous.filter(
          (event) => event.eventId !== eventId && event._id !== eventId,
        ),
      );

      setMessage(result.message || "Event deleted successfully.");
      setConfirmId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this event.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading your events...
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

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage the community events you created.
            </p>
          </div>

          <Button asChild>
            <Link href="/dashboard/create-event">Create New Event</Link>
          </Button>
        </div>

        {error && (
          <p className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-6 rounded-md bg-green-100 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
            {message}
          </p>
        )}

        {events.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center p-10 text-center">
              <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No events created yet</h2>
              <p className="mt-2 text-muted-foreground">
                Start making a difference by organizing your first event.
              </p>
              <Button asChild className="mt-5">
                <Link href="/dashboard/create-event">Create an Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {events.map((event) => {
              const id = event.eventId || event._id;

              return (
                <Card key={id} className="overflow-hidden">
                  {event.imageUrl && (
                    <div className="h-44 overflow-hidden bg-muted">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold">{event.title}</h2>
                      <Badge variant="secondary">{event.category}</Badge>
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
                    </div>

                    <p className="text-sm">
                      Volunteers:{" "}
                      <strong>
                        {event.participantCount || 0}/{event.volunteersNeeded}
                      </strong>
                    </p>

                    {confirmId === id ? (
                      <div className="space-y-3 rounded-lg border border-destructive/30 p-3">
                        <p className="text-sm font-medium">
                          Are you sure you want to delete this event?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === id}
                            onClick={() => handleDelete(id)}
                          >
                            {deletingId === id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm Delete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmId(null)}
                            disabled={deletingId === id}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild className="flex-1">
                          <Link href={`/events/${id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Event
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          aria-label={`Delete ${event.title}`}
                          onClick={() => setConfirmId(id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
