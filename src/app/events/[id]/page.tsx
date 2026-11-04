"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  HeartHandshake,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SessionResponse {
  user?: {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
  };
  session?: unknown;
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEvent = useCallback(async () => {
    try {
      setError("");
      const data = await apiRequest<EventResponse>(`/api/events/${id}`);
      setEvent(data.event);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load this event.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  // Check the Better Auth session.
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/get-session", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data: SessionResponse | null = await response.json();

        const currentUserId = data?.user?.id || data?.user?._id;

        if (currentUserId) {
          setUserId(currentUserId);
        }
      } catch {
        // Visitors who are not logged in can still view events.
      } finally {
        setAuthChecked(true);
      }
    }

    checkSession();
  }, []);

  async function handleJoin() {
    if (!event) return;

    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest<EventResponse>(
        `/api/events/${id}/join`,
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        true,
      );

      if (data.event) {
        setEvent(data.event);
      } else {
        await loadEvent();
      }

      setMessage(data.message || "You successfully joined this event!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to join this event.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!event) return;

    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest<{ message?: string }>(
        `/api/events/${id}/leave`,
        { method: "DELETE" },
        true,
      );

      await loadEvent();
      setMessage(data.message || "You have left this event.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to leave this event.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading event details...
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button asChild className="mt-6">
          <Link href="/events">Back to Events</Link>
        </Button>
      </main>
    );
  }

  if (!event) return null;

  const participantCount =
    event.participantCount ?? event.participants?.length ?? 0;

  const remainingSpots = Math.max(0, event.volunteersNeeded - participantCount);

  const isJoined =
    !!userId &&
    event.participants?.some((participant) => participant.userId === userId);

  const isCreator = !!userId && event.createdBy === userId;

  const isFull = remainingSpots <= 0;
  const isPast = new Date(event.eventDate).getTime() < Date.now();

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event information */}
          <section className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden">
              {event.imageUrl ? (
                <div className="h-64 w-full overflow-hidden bg-muted sm:h-96">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center bg-primary/10 sm:h-96">
                  <HeartHandshake className="h-20 w-20 text-primary/60" />
                </div>
              )}

              <CardContent className="space-y-5 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{event.category}</Badge>

                  {isPast && <Badge variant="secondary">Event completed</Badge>}

                  {!isPast && isFull && (
                    <Badge variant="destructive">Volunteers full</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {event.title}
                </h1>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Event date</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {(event.startTime || event.endTime) && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Event time</p>
                        <p className="text-sm text-muted-foreground">
                          {event.startTime || "Time not specified"}
                          {event.endTime ? ` - ${event.endTime}` : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Users className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Volunteers</p>
                      <p className="text-sm text-muted-foreground">
                        {participantCount} joined out of{" "}
                        {event.volunteersNeeded}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="mb-3 text-xl font-semibold">
                    About This Event
                  </h2>
                  <p className="whitespace-pre-line leading-7 text-muted-foreground">
                    {event.description}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h2 className="mb-2 text-lg font-semibold">
                    Event Organizer
                  </h2>
                  <p className="text-muted-foreground">
                    {event.createdByName || "ImpactPulse Community"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Volunteer panel */}
          <aside>
            <Card className="sticky top-6">
              <CardContent className="space-y-5 p-6">
                <div>
                  <h2 className="text-xl font-bold">
                    Volunteer for this event
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your participation can make a real difference.
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Volunteer spots
                    </span>
                    <span className="font-semibold">
                      {participantCount}/{event.volunteersNeeded}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${
                          event.volunteersNeeded > 0
                            ? Math.min(
                                100,
                                (participantCount / event.volunteersNeeded) *
                                  100,
                              )
                            : 100
                        }%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {remainingSpots} volunteer spots remaining
                  </p>
                </div>

                {!authChecked ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking account...
                  </Button>
                ) : !userId ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Please log in to join this event.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/login">Log in to Join</Link>
                    </Button>
                  </div>
                ) : isCreator ? (
                  <div className="rounded-lg border p-4 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-primary" />
                    <p className="font-medium">You organized this event</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Thank you for making this event possible.
                    </p>
                  </div>
                ) : isJoined ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-green-600/30 bg-green-50 p-3 text-center text-green-800 dark:bg-green-950/30 dark:text-green-300">
                      <CheckCircle2 className="mx-auto mb-1 h-5 w-5" />
                      <p className="font-medium">You joined this event!</p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLeave}
                      disabled={actionLoading || isPast}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Leave Event
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleJoin}
                    disabled={actionLoading || isFull || isPast}
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <HeartHandshake className="mr-2 h-4 w-4" />
                    )}
                    {isPast
                      ? "Event Completed"
                      : isFull
                        ? "No Spots Available"
                        : "Join This Event"}
                  </Button>
                )}

                {message && (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {message}
                  </p>
                )}

                {error && event && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  Together, we can create positive change in our community.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
